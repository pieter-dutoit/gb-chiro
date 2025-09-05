import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  fields: [
    {
      name: "landingImage",
      label: "Landing Image",
      admin: {
        description: "First image on Home page.",
      },
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
  ],
};
