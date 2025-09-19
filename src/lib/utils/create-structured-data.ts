import { parsePhoneNumber } from "libphonenumber-js/min";

import { BusinessDetail, Media, Service } from "@/payload-types";

import { DAY_KEYS, DayKey, extractMediaUrl, getBaseUrl } from ".";
import {
  getAboutUsPageData,
  getBusinessDetails,
  getGraphics,
  getHomePageData,
} from "../data";

type OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: DayKey[];
  opens: string; // "HH:mm"
  closes: string; // "HH:mm"
};

const DAY_ABBR: Record<DayKey, string> = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

export function createTreatmentEntity({
  id,
  name,
  description,
  thumbnail,
  article,
}: Service) {
  const linkedArticle = !!article && typeof article !== "number" && article;

  return {
    "@id": `${getBaseUrl()}/treatment-and-care#${id}`,
    "@type": "MedicalTherapy",
    medicineSystem: "Chiropractic",
    name,
    alternateName: `${name} - GB Chiropractic Griffith`,
    description: description,
    image: getImageObject(thumbnail),
    url: new URL(
      `treatment-and-care/${linkedArticle ? article.slug : ""}`,
      getBaseUrl()
    ),
  };
}

export function buildOpeningHours(
  rows: BusinessDetail["operatingHours"]
): string[] {
  const windowToDays = new Map<string, Set<number>>();

  for (const row of rows) {
    const timeWindow = `${row.opens}-${row.closes}`;
    const daySet = windowToDays.get(timeWindow) ?? new Set<number>();
    DAY_KEYS.forEach((day, idx) => {
      if (row[day]) daySet.add(idx);
    });
    windowToDays.set(timeWindow, daySet);
  }

  // Convert each time window's day set into merged contiguous ranges
  const results: { firstDay: number; text: string }[] = [];

  for (const [timeWindow, daySet] of windowToDays.entries()) {
    const days = Array.from(daySet).sort((a, b) => a - b);
    if (days.length === 0) continue;

    // Split into contiguous sequences (e.g., [0,1,2,3,4] -> one seq, [0,2] -> two seqs)
    const sequences: number[][] = [];
    let cur: number[] = [];

    for (const d of days) {
      if (cur.length === 0 || d === cur[cur.length - 1] + 1) {
        cur.push(d);
      } else {
        sequences.push(cur);
        cur = [d];
      }
    }
    if (cur.length) sequences.push(cur);

    for (const seq of sequences) {
      const start = seq[0];
      const end = seq[seq.length - 1];
      const dayLabel =
        start === end
          ? DAY_ABBR[DAY_KEYS[start]]
          : `${DAY_ABBR[DAY_KEYS[start]]}-${DAY_ABBR[DAY_KEYS[end]]}`;
      results.push({ firstDay: start, text: `${dayLabel} ${timeWindow}` });
    }
  }

  // Sort by first day for stable, human-friendly order
  results.sort((a, b) => a.firstDay - b.firstDay);
  return results.map((r) => r.text);
}

export function buildOpeningHoursSpecification(
  rows: BusinessDetail["operatingHours"] // or BusinessDetail["operatingHours"]
): OpeningHoursSpecification[] {
  const windowToDays = new Map<string, Set<number>>();

  for (const row of rows) {
    const key = `${row.opens}-${row.closes}`;

    const daySet = windowToDays.get(key) ?? new Set<number>();
    DAY_KEYS.forEach((day, idx) => {
      if (row[day]) daySet.add(idx);
    });
    windowToDays.set(key, daySet);
  }

  const specs: OpeningHoursSpecification[] = [];

  for (const [key, daySet] of windowToDays.entries()) {
    const [opens, closes] = key.split("-");
    const dayOfWeek = Array.from(daySet)
      .sort((a, b) => a - b)
      .map((i) => DAY_KEYS[i]);

    if (dayOfWeek.length > 0) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens,
        closes,
      });
    }
  }

  // Sort by the earliest day included in each spec for stable output
  specs.sort((a, b) => {
    const aIdx = Math.min(...a.dayOfWeek.map((d) => DAY_KEYS.indexOf(d)));
    const bIdx = Math.min(...b.dayOfWeek.map((d) => DAY_KEYS.indexOf(d)));
    return aIdx - bIdx;
  });

  return specs;
}

export function getImageObject(media: Media | number) {
  if (typeof media === "number") return;

  const thumbnailName = encodeURIComponent(
    media.sizes?.["256w"]?.filename ?? ""
  );
  const currentYear = new Date().getFullYear();
  const baseUrl = getBaseUrl();

  return {
    "@type": "ImageObject",
    caption: media.alt,
    width: media?.width,
    height: media?.height,
    contentUrl: extractMediaUrl(media),
    thumbnailUrl: `${baseUrl}/images/${thumbnailName}`,
    creditText: "GB Chiropractic",
    creator: {
      "@type": "Organization",
      "@id": `${baseUrl}#gb-chiropractic`,
      name: "GB Chiropractic",
    },
    copyrightNotice: `©${currentYear} GB Chiropractic.`,
  };
}

const BUSINESS_AUDIENCE = [
  {
    "@type": "Patient",
    audienceType: "People seeking chiropractic care",
    suggestedGender: "unisex",
    suggestedMinAge: 0,
    suggestedMaxAge: 120,
    geographicArea: {
      "@type": "AdministrativeArea",
      name: "Griffith",
    },
    healthCondition: [
      { "@type": "MedicalCondition", name: "Back pain" },
      { "@type": "MedicalCondition", name: "Lower Back pain" },
      { "@type": "MedicalCondition", name: "Neck pain" },
      { "@type": "MedicalCondition", name: "Headaches and migraines" },
      { "@type": "MedicalCondition", name: "Sports injuries" },
      { "@type": "MedicalCondition", name: "Work injuries" },
      { "@type": "MedicalCondition", name: "Joint pain and mobility issues" },
      { "@type": "MedicalCondition", name: "Posture-related pain" },
      { "@type": "MedicalCondition", name: "Pregnancy-related back pain" },
      {
        "@type": "MedicalCondition",
        name: "Paediatric musculoskeletal issues",
      },
    ],
  },
];

type Crumbs = { slug: string; name: string }[];

type CreateStructuredDataArgs = {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "MedicalWebPage";
  name?: string;
  identifier: string;
  slug: string;
  primaryImage?: Media | number;
  otherImages?: (Media | number)[];
  crumbs: Crumbs;
  additionalData?: Record<string, unknown>;
};

function generateBreadcrumbs(crumbs: Crumbs) {
  return crumbs.map(({ name, slug }, index) => {
    const position = index + 1;
    return {
      "@type": "ListItem",
      position,
      name,
      item: new URL(slug, getBaseUrl()),
    };
  });
}

export async function createStructuredData({
  type = "WebPage",
  identifier,
  name,
  slug,
  primaryImage,
  otherImages,
  crumbs,
  additionalData,
}: CreateStructuredDataArgs) {
  const { address, email, phone, operatingHours, bookingLink } =
    await getBusinessDetails();
  const { logo } = await getGraphics();
  const { landingImage, whatToExpectImage } = await getHomePageData();
  const { meetTheChiroImage } = await getAboutUsPageData();

  const number = parsePhoneNumber(phone, "AU");

  const location = {
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.suburb,
    addressRegion: address.state.toUpperCase(),
    postalCode: address.code,
    addressCountry: "AU",
  };

  const geo = {
    "@type": "GeoCoordinates",
    latitude: address.coords[1],
    longitude: address.coords[0],
  };

  const baseUrl = getBaseUrl();

  const businessID = `${baseUrl}#gb-chiropractic`;
  const websiteID = `${baseUrl}#website`;

  const bookingAction = {
    "@type": "ReserveAction",
    target: [
      bookingLink,
      {
        "@type": "LinkRole",
        target: bookingLink,
        inLanguage: "en-AU",
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization data
      {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "MedicalClinic"],
        "@id": businessID,
        // Business
        name: "GB Chiropractic",
        slogan: "Move Better. Live Freely",
        description:
          "Family-friendly chiropractic clinic in Griffith, NSW providing evidence-based care for back, neck and joint pain, sports injuries, pregnancy and paediatric needs.",
        url: baseUrl,
        logo: extractMediaUrl(logo),
        image: [landingImage, whatToExpectImage, meetTheChiroImage].map(
          extractMediaUrl
        ),
        openingHours: buildOpeningHours(operatingHours),
        openingHoursSpecification:
          buildOpeningHoursSpecification(operatingHours),
        priceRange: "$$",
        // Contact
        telephone: number.number,
        contactPoint: {
          contactType: "Customer Service",
          email,
          telephone: number.number,
        },
        email,
        // Location
        address: location,
        location,
        hasMap: address.mapsLink,
        geo,
        // Services
        availableService: {
          "@type": "MedicalTherapy",
          medicineSystem: "Chiropractic",
          name: "Chiropractic Care",
          alternateName: "Chiropractic Care - Griffith",
          recognizingAuthority: {
            "@type": "Organization",
            name: "Australian Health Practitioner Regulation Agency",
          },
        },
        potentialAction: bookingAction,
      },
      // Website data
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": websiteID,
        url: baseUrl,
        name: "GB Chiropractic - Chiropractor in Griffith",
        alternateName: "Griffith Chiropractor - GB Chiropractic",
        description:
          "Relief for back, neck and joint pain, right here in Griffith. Evidence-based care and a clear plan to help you move well again.",
        inLanguage: "en-AU",
        publisher: { "@id": businessID },
        potentialAction: bookingAction,
      },
      {
        "@type": type,
        "@id": `${baseUrl}#${identifier}`,
        ...(name && { name: `${name} - GB Chiropractic Griffith` }),
        url: new URL(slug, baseUrl).toString(),
        isPartOf: { "@id": websiteID },
        about: { "@id": businessID },
        ...(primaryImage && {
          primaryImageOfPage: getImageObject(primaryImage),
        }),
        ...(otherImages?.length && {
          image: otherImages.map(getImageObject),
        }),
        breadcrumb: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          name: "Breadcrumbs",
          itemListElement: generateBreadcrumbs(crumbs),
        },
        ...additionalData,
      },
    ],
  };
}
