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

export const revalidateCollectionByField =
  (fieldName: string): CollectionAfterChangeHook =>
  async ({ doc }) => {
    if (!doc[fieldName])
      throw new Error("Field does not exist in collection document");
    revalidateTag(doc[fieldName]);
    return doc;
  };
