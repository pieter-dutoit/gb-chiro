import type { GlobalConfig } from "payload";

import { canEditContent, publishedOrEditor } from "../access/content";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const TreatmentAndCarePage: GlobalConfig = {
  slug: "treatment-and-care-page",
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrEditor,
    update: canEditContent,
  },
  hooks: {
    afterChange: [revalidateCache("services")],
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
              label: "Services",
              relationTo: "services",
              name: "services",
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
