import { CollectionBeforeChangeHook } from "payload";
import { stringToSlug } from "@/lib/utils";

const createSlug: CollectionBeforeChangeHook = async ({ data }) => {
  return {
    ...data,
    slug: stringToSlug(data.name || data.title),
  };
};

export default createSlug;
