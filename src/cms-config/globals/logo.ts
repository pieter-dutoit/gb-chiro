import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";

export const Logo: GlobalConfig = {
  slug: "logo",
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
  ],
};
