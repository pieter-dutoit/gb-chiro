import { revalidateTag } from "next/cache";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

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
  async ({ doc, previousDoc }) => {
    if (previousDoc[fieldName]) {
      revalidateTag(previousDoc[fieldName]);
    }
    if (doc[fieldName]) {
      revalidateTag(doc[fieldName]);
    }
    return doc;
  };

type AfterDeleteHookProps = {
  tags?: string[];
  fieldNames?: string[];
};
export const revalidateAfterDelete =
  ({
    tags = [],
    fieldNames = [],
  }: AfterDeleteHookProps): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    fieldNames.forEach((fieldName) => {
      if (doc[fieldName]) {
        revalidateTag(doc[fieldName]);
      }
    });
    tags.forEach((tag) => {
      revalidateTag(tag);
    });

    return doc;
  };
