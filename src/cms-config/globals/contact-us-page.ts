import type { GlobalConfig } from "payload";

import { canEditContent, publishedOrEditor } from "../access/content";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const ContactUsPage: GlobalConfig = {
  slug: "contact-us-page",
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrEditor,
    update: canEditContent,
  },
  hooks: {
    afterChange: [revalidateCache("contact-us-page")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "seo",
          label: "SEO",
          fields: SEOFields,
        },
      ],
    },
  ],
};
