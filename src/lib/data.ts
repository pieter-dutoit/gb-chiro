import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";

const payload = await getPayload({ config });

export const getLogo = unstable_cache(
  async () => payload.findGlobal({ slug: "logo", depth: 1 }),
  undefined,
  {
    tags: ["payload", "logo"],
    revalidate: false,
  }
);

export const getBusinessDetails = unstable_cache(
  async () => payload.findGlobal({ slug: "business-details", depth: 1 }),
  undefined,
  {
    tags: ["payload", "business-details"],
    revalidate: false,
  }
);
