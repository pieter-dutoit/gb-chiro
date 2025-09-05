import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";

export const AboutUs: GlobalConfig = {
  slug: "about-us",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  fields: [
    {
      name: "welcomeImage",
      label: "Welcome Image",
      admin: {
        description: "First image on About Us page.",
      },
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
    {
      name: "meetTheChiroImage",
      label: "Meet the Chiro Image",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
  ],
};
