import { GroupField } from "payload";

export const AddressField: GroupField = {
  type: "group",
  name: "address",
  label: "Address",
  fields: [
    {
      type: "row",
      fields: [
        {
          type: "text",
          name: "street",
          label: "Street name and number",
          minLength: 1,
          maxLength: 100,
          required: true,
        },
        {
          type: "text",
          name: "suburb",
          label: "Suburb",
          minLength: 1,
          maxLength: 100,
          required: true,
        },
        {
          type: "select",
          name: "state",
          label: "State",
          required: true,
          options: [
            { value: "nsw", label: "NSW" },
            { value: "vic", label: "VIC" },
            { value: "qld", label: "QLD" },
            { value: "wa", label: "WA" },
            { value: "sa", label: "SA" },
            { value: "tas", label: "TAS" },
            { value: "act", label: "ACT" },
            { value: "nt", label: "NT" },
          ],
        },
        {
          type: "text",
          name: "code",
          label: "Code",
          required: true,
          minLength: 1,
          maxLength: 6,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          type: "text",
          required: true,
          minLength: 1,
          maxLength: 200,
          name: "mapsLink",
          label: "Maps Link",
        },
        {
          type: "point",
          required: true,
          name: "coords",
          label: "Coordinates",
        },
      ],
    },
  ],
};
