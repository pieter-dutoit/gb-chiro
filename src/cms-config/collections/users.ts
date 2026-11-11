import { APIError, type CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel } from "../access/is-admin";
import { isAdminOrSelf } from "../access/is-admin-or-self";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !user?.roles?.includes("admin"),
  },
  hooks: { beforeValidate: [({ operation, req, context, data }) => {
    if (operation === "create" && !req.user && !context.bootstrap) throw new APIError("An administrator must set up this account.", 403);
    return data;
  }] },
  auth: {
    depth: 0,
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
    cookies: {
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    },
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user?.roles?.some((role: string) => ["admin", "editor"].includes(role))),
    create: isAdmin,
    // Admins can read all, but any other logged in user can only read themselves
    read: isAdminOrSelf,
    // Admins can update all, but any other logged in user can only update themselves
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: "roles",
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: "select",
      hasMany: true,
      defaultValue: ["editor"],
      access: {
        // Only admins can create or update a value for this field
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
    },
  ],
};
