import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";

const payload = await getPayload({ config });

export const getGraphics = unstable_cache(
  async () => payload.findGlobal({ slug: "graphics", depth: 1 }),
  undefined,
  {
    tags: ["payload", "graphics"],
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

export const getAboutUs = unstable_cache(
  async () => payload.findGlobal({ slug: "about-us", depth: 1 }),
  undefined,
  {
    tags: ["payload", "about-us"],
    revalidate: false,
  }
);
