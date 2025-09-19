import type { GlobalConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCache from "../hooks/revalidate-cache";
import SEOFields from "../fields/seo";

export const ContactUsPage: GlobalConfig = {
  slug: "contact-us-page",
  versions: {
    drafts: true,
  },
  access: {
    read: isLoggedInOrIsPublished,
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
