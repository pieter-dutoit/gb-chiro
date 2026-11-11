import type { GlobalConfig } from "payload";

import { canEditContent, publishedOrEditor } from "../access/content";
import revalidateCache from "../hooks/revalidate-cache";

export const Graphics: GlobalConfig = {
  slug: "graphics",
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrEditor,
    update: canEditContent,
  },
  hooks: {
    afterChange: [revalidateCache("graphics")],
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
      name: "backgroundGraphic",
      label: "Background Graphic",
      type: "upload",
      relationTo: "media",
      hasMany: false,
      required: true,
    },
  ],
};
