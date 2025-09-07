import { EmailField, GlobalConfig, TextField } from "payload";

import { isLoggedInOrIsPublished } from "../access/logged-in-or-published";
import { OpeningHoursField } from "../fields/opening-hours";
import { AddressField } from "../fields/address";
import revalidateCache from "../hooks/revalidate-cache";

export const EmailInputField: EmailField = {
  type: "email",
  name: "email",
  label: "Email address",
  required: true,
};

export const BookingLinkField: TextField = {
  type: "text",
  name: "bookingLink",
  label: "Booking link",
  required: true,
};

export const PhoneField: TextField = {
  type: "text",
  name: "phone",
  label: "Phone number",
  required: true,
};

export const BusinessDetailsGlobal: GlobalConfig = {
  slug: "business-details",
  access: {
    read: isLoggedInOrIsPublished,
  },
  hooks: {
    afterChange: [revalidateCache("business-details")],
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    BookingLinkField,
    {
      type: "row",
      fields: [EmailInputField, PhoneField],
    },

    AddressField,
    OpeningHoursField,
  ],
};
