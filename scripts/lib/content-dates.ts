export type ContentRow = Record<string, unknown>;
export type ContentSnapshot = Record<string, ContentRow[]>;
export type ContentDates = { created_at: string; updated_at: string };

const contentTables = new Set([
  'media', 'seo_media', 'services', 'articles', 'reviews', 'new_patient_steps',
  'social_media_platforms', 'business_details', 'graphics', 'home_page',
  'about_us_page', 'treatment_and_care_page', 'what_to_expect_page', 'contact_us_page',
]);

// Extract dates only. SQL from the archive is never executed; account records
// and their credentials are deliberately outside the allowlist.
export function historicalDates(sql: string): Map<string, ContentDates> {
  const dates = new Map<string, ContentDates>();
  const inserts = /^INSERT INTO payload\.(\w+) \(([^)]+)\) VALUES \(/gm;
  for (const match of sql.matchAll(inserts)) {
    if (!contentTables.has(match[1])) continue;
    const columns = match[2].split(',').map(column => column.trim());
    const values: (string | null)[] = [];
    let index = match.index! + match[0].length;
    while (index < sql.length) {
      while (/\s/.test(sql[index])) index++;
      let value = '';
      if (sql[index] === "'") {
        index++;
        let closed = false;
        while (index < sql.length) {
          if (sql[index] === "'") {
            if (sql[index + 1] === "'") { value += "'"; index += 2; continue; }
            index++; closed = true; break;
          }
          value += sql[index++];
        }
        if (!closed) throw new Error(`Unterminated value in ${match[1]} archive`);
        values.push(value);
      } else {
        while (index < sql.length && ![',', ')'].includes(sql[index])) value += sql[index++];
        values.push(value.trim() === 'NULL' ? null : value.trim());
      }
      while (/\s/.test(sql[index])) index++;
      if (sql[index] === ')') break;
      if (sql[index++] !== ',') throw new Error(`Unexpected value separator in ${match[1]} archive`);
    }
    if (values.length !== columns.length) throw new Error(`Column mismatch in ${match[1]} archive`);
    const row = Object.fromEntries(columns.map((column, i) => [column, values[i]]));
    if (!row.id || !row.created_at || !row.updated_at) continue;
    dates.set(`${match[1]}:${row.id}`, {
      created_at: new Date(row.created_at).toISOString(), updated_at: new Date(row.updated_at).toISOString(),
    });
  }
  return dates;
}

function originalID(table: string, row: ContentRow): string | undefined {
  const source = typeof row.source_i_d === 'string' ? row.source_i_d.match(/^[^:]+:([^:]+):(\d+)$/) : null;
  if (source) {
    if (source[1].replaceAll('-', '_') !== table) throw new Error(`Mismatched source collection for ${table}`);
    return `${table}:${source[2]}`;
  }
  // Globals retain their singleton identity. New collection records must keep
  // their actual dates, even if their numeric ID matches an archived record.
  return ['business_details', 'graphics', 'home_page', 'about_us_page', 'treatment_and_care_page', 'what_to_expect_page', 'contact_us_page'].includes(table)
    ? `${table}:${row.id}` : undefined;
}

export function applyContentDates(snapshot: ContentSnapshot, dates: Map<string, ContentDates>) {
  let matched = 0;
  let recentEdits = 0;
  for (const table of contentTables) {
    for (const row of snapshot[table] ?? []) {
      const key = originalID(table, row);
      const old = key ? dates.get(key) : undefined;
      if (!old) continue;
      const versions = (snapshot[`_${table}_v`] ?? []).filter(version => version.parent_id === row.id || !('parent_id' in version))
        .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
      const originalCreated = row.created_at;
      row.created_at = old.created_at;
      // Multiple saved versions indicate subsequent edits. Preserve their real
      // modification dates; the initial saved version keeps the known old date.
      const edited = versions.length > 1;
      if (!edited) row.updated_at = old.updated_at;
      else recentEdits++;
      for (const [index, version] of versions.entries()) {
        if (version.version_created_at === originalCreated) version.version_created_at = old.created_at;
        if (index === 0) {
          version.version_updated_at = old.updated_at;
          version.created_at = old.updated_at;
          version.updated_at = old.updated_at;
        }
      }
      matched++;
    }
  }
  return { matched, recentEdits };
}
