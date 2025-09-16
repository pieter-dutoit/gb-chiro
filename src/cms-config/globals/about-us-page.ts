import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const AboutUsPage: GlobalConfig = {
  slug: "about-us-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  hooks: {
    afterChange: [revalidateCache("about-us-page")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page Content",
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
            {
              name: "practiceImages",
              label: "Practice Images",
              admin: {
                description: "Requires 4 images",
              },
              type: "upload",
              relationTo: "media",
              hasMany: true,
              required: true,
              maxRows: 4,
            },
          ],
        },
        {
          name: "seo",
          label: "SEO",
          fields: SEOFields,
        },
      ],
    },
  ],
};
