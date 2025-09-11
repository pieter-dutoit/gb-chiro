import type { CollectionConfig } from "payload";
import revalidateCollection from "../hooks/revalidate-collection";

export const NewPatientSteps: CollectionConfig = {
  slug: "new-patient-steps",
  hooks: {
    afterChange: [revalidateCollection("what-to-expect", true)],
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "icon",
      label: "Icon",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
    {
      name: "title",
      type: "richText",
      label: "Step Title",
      required: true,
    },
    {
      name: "overview",
      type: "text",
      label: "Brief Overview",
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      required: true,
    },
  ],
};
