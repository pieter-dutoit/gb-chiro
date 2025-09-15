import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCache from "../hooks/revalidate-cache";

export const TreatmentAndCarePage: GlobalConfig = {
  slug: "treatment-and-care-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  hooks: {
    afterChange: [revalidateCache("services")],
  },
  fields: [
    {
      type: "relationship",
      label: "Services",
      relationTo: "services",
      name: "services",
      hasMany: true,
    },
  ],
};
