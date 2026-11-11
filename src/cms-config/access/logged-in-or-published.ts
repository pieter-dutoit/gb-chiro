import type { Access } from "payload";

export const isLoggedInOrIsPublished: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    return Boolean(user);
  }

  // Non-logged in users can only read published docs
  return {
    _status: {
      equals: "published",
    },
  };
};
