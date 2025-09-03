import type { Access, FieldAccess } from "payload";

export const isLoggedIn: Access = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user);
};

export const isLoggedInFieldLevel: FieldAccess<{ id: string }> = ({
  req: { user },
}) => {
  return Boolean(user);
};
