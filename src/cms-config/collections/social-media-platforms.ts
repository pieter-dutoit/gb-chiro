import type { CollectionConfig } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import revalidateCollection, {
  revalidateAfterDelete,
} from "../hooks/revalidate-collection";

export const SocialMediaPlatforms: CollectionConfig = {
  slug: "social-media-platforms",
  labels: {
    singular: "Social Media Platform",
    plural: "Social Media Platforms",
  },
  admin: {
    useAsTitle: "name",
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateCollection("social-media-platforms")],
    afterDelete: [revalidateAfterDelete({ tags: ["social-media-platforms"] })],
  },
  access: {
    read: isLoggedInOrIsPublished,
  },
  fields: [
    {
      name: "name",
      label: "Platform",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "X (Twitter)", value: "x" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "YouTube", value: "youtube" },
        { label: "TikTok", value: "tiktok" },
        { label: "Snapchat", value: "snapchat" },
        { label: "Reddit", value: "reddit" },
        { label: "Threads", value: "threads" },
        { label: "Twitch", value: "twitch" },
        { label: "Telegram", value: "telegram" },
        { label: "WhatsApp", value: "whatsapp" },
        { label: "WeChat", value: "weChat" },
      ],
    },
    {
      name: "link",
      label: "URL / Link to platform",
      type: "text",
      required: true,
    },
  ],
};
