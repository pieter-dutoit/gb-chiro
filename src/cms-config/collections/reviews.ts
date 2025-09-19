import type { CollectionConfig } from "payload";
import revalidateCollection, {
  revalidateAfterDelete,
} from "../hooks/revalidate-collection";
import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: { read: isLoggedInOrIsPublished },
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [revalidateCollection("reviews")],
    afterDelete: [revalidateAfterDelete({ tags: ["reviews"] })],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Reviewer Name",
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    {
      name: "text",
      type: "textarea",
      label: "Review Text",
      required: true,
      minLength: 1,
      maxLength: 1000,
    },

    {
      name: "platform",
      type: "select",
      label: "Select Platform (Optional)",
      options: [
        "Google",
        "Facebook",
        "HealthEngine",
        "Whitecoat",
        "Word of Mouth",
        "HotDoc",
        "Yelp",
      ],
    },
    {
      name: "link",
      type: "text",
      label: "Link to Review (Optional)",
      maxLength: 200,
    },
  ],
};
