import { getBaseUrl } from "@/lib/utils";
import type { CollectionAfterChangeHook } from "payload";

const prewarmImages: CollectionAfterChangeHook = async ({ doc }) => {
  try {
    const baseURL = getBaseUrl();
    const main = doc?.filename ? [doc.filename] : [];
    const sizes = Object.values(doc?.sizes ?? {})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => s?.filename)
      .filter(Boolean) as string[];

    const all = [...new Set([...main, ...sizes])]; // unique

    const urls = all.map(
      (filename) => `${baseURL}/api/images/${encodeURIComponent(filename)}`
    );

    await Promise.allSettled(
      urls.map((url) =>
        fetch(url, {
          cache: "no-store",
        })
      )
    );
  } catch (err) {
    console.error("image prewarm failed:", err);
  }
};

export default prewarmImages;
