import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const WhatToExpectPage: GlobalConfig = {
  slug: "what-to-expect-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  hooks: {
    afterChange: [revalidateCache("what-to-expect")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page Content",
          fields: [
            {
              type: "relationship",
              label: "New patient steps",
              relationTo: "new-patient-steps",
              name: "steps",
              hasMany: true,
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
