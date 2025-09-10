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

export const getHomePageData = unstable_cache(
  async () => payload.findGlobal({ slug: "home-page", depth: 1 }),
  undefined,
  {
    tags: ["payload", "home-page"],
    revalidate: false,
  }
);

export const getAboutUsPageData = unstable_cache(
  async () => payload.findGlobal({ slug: "about-us-page", depth: 1 }),
  undefined,
  {
    tags: ["payload", "about-us-page"],
    revalidate: false,
  }
);

export const getWhatToExpectPageData = unstable_cache(
  async () => payload.findGlobal({ slug: "what-to-expect-page", depth: 2 }),
  undefined,
  {
    tags: ["payload", "what-to-expect"],
    revalidate: false,
  }
);

export const getServicesData = unstable_cache(
  async () => {
    const res = await payload.find({
      draft: false,
      collection: "services",
      depth: 1,
      pagination: false,
      sort: "-name",
      where: {
        _status: {
          equals: "published",
        },
      },
    });
    if (!res) {
      throw new Error("Failed to fetch services data");
    }

    return res.docs;
  },
  undefined,
  {
    tags: ["payload", "services"],
    revalidate: false,
  }
);
