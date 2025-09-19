import { GroupField } from "payload";

const MetadataField: GroupField = {
  interfaceName: "MetadataField",
  name: "meta",
  label: "Meta Fields (For SEO optimization)",
  type: "group",
  fields: [
    {
      name: "title",
      label: "Page Title (Up to 70 characters)",
      type: "text",
      minLength: 5,
      maxLength: 120,
      required: true,
    },
    {
      name: "description",
      label: "Description (Ideally 100 to 200 characters)",
      type: "textarea",
      required: true,
      minLength: 70,
      maxLength: 500,
    },
  ],
};

const OpenGraphField: GroupField = {
  interfaceName: "OpenGraphField",
  name: "open_graph",
  label: "Open Graph Fields (How shared links appear on social media)",
  type: "group",
  fields: [
    {
      name: "site_name",
      label: "Site Name (Ideally up to 200 characters)",
      type: "text",
      minLength: 5,
      maxLength: 500,
      required: true,
    },
    {
      name: "title",
      label: "Title (Ideally up to 70 characters)",
      type: "text",
      minLength: 5,
      maxLength: 200,
      required: true,
    },
    {
      name: "description",
      label: "Description (Ideally 100 to 200 characters)",
      type: "textarea",
      required: true,
      minLength: 50,
      maxLength: 500,
    },
    {
      name: "image",
      label: "Image",
      type: "upload",
      hasMany: true,
      relationTo: "seo-media",
      required: true,
    },
  ],
};

const TwitterField: GroupField = {
  interfaceName: "TwitterField",
  name: "twitter",
  label: "Twitter Fields",
  type: "group",
  admin: { hidden: true },
  fields: [
    {
      name: "creator",
      label: "Twitter / X Username (e.g. @username) (Optional)",
      type: "text",
      minLength: 1,
      maxLength: 500,
    },
    {
      name: "creatorId",
      label: "Twitter / X ID (Optional)",
      type: "text",
      minLength: 5,
      maxLength: 500,
    },
  ],
};

const SEOFields = [MetadataField, OpenGraphField, TwitterField];
export default SEOFields;
