import { revalidateTag } from "next/cache";
import { GlobalAfterChangeHook } from "payload";

const revalidateCache =
  (cacheTagName: string): GlobalAfterChangeHook =>
  async ({ doc }) => {
    if (doc._status === "published") {
      revalidateTag(cacheTagName);
    }
    return doc;
  };

export default revalidateCache;
