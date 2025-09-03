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
        },
        {
          type: "text",
          name: "suburb",
          label: "Suburb",
          minLength: 1,
          maxLength: 100,
        },
        {
          type: "select",
          name: "state",
          label: "State",
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
          minLength: 1,
          maxLength: 5,
        },
      ],
    },
  ],
};
