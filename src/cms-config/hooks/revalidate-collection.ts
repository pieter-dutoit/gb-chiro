import { revalidateTag } from "next/cache";
import { CollectionAfterChangeHook } from "payload";

const revalidateCollection =
  (
    cacheTagName: string,
    checkIfPublished: boolean = false
  ): CollectionAfterChangeHook =>
  async ({ doc }) => {
    if (checkIfPublished && doc._status === "published") {
      revalidateTag(cacheTagName);
    } else {
      revalidateTag(cacheTagName);
    }
    return doc;
  };

export default revalidateCollection;
