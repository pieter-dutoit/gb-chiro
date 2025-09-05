import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";

export const Graphics: GlobalConfig = {
  slug: "graphics",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
    {
      name: "horizontalLogo",
      label: "Horizontal Logo",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
    {
      name: "heroBackground",
      label: "Hero Background",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
  ],
};
