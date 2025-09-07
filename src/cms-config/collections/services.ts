import type { CollectionConfig } from "payload";
import revalidateCollection from "../hooks/revalidate-collection";
import createSlug from "../hooks/create-slug";

export const Services: CollectionConfig = {
  slug: "services",
  hooks: {
    beforeChange: [createSlug],
    afterChange: [revalidateCollection("services")],
  },
  admin: {
    useAsTitle: "name",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "slug",
      label: "Page Slug / URL (Auto Generated)",
      type: "text",
      unique: true,
      required: false,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "name",
      type: "text",
      label: "Service Name",
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    {
      name: "description",
      type: "text",
      label: "Description",
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
  ],
};
