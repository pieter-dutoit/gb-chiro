import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  hooks: {
    afterChange: [revalidateCache("home-page")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page Content",
          fields: [
            {
              name: "landingImage",
              label: "Landing image",
              admin: {
                description: "First image on Home page.",
              },
              type: "upload",
              relationTo: "media",
              hasMany: false,
              required: true,
            },
            {
              name: "whatToExpectImage",
              label: "'What to Expect' section image",
              type: "upload",
              relationTo: "media",
              hasMany: false,
              required: true,
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
