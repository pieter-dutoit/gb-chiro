import { getPayload, Where } from "payload";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import config from "@payload-config";
import { Article, Service, SocialMediaPlatform } from "@/payload-types";

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

export const getTreatmentAndCareData = unstable_cache(
  async () => payload.findGlobal({ slug: "treatment-and-care-page", depth: 2 }),
  undefined,
  {
    tags: ["payload", "services"],
    revalidate: false,
  }
);

export const getContactUsPageData = unstable_cache(
  async () => payload.findGlobal({ slug: "contact-us-page", depth: 1 }),
  undefined,
  {
    tags: ["payload", "contact-us-page"],
    revalidate: false,
  }
);

export const getArticle = (slug: string) =>
  unstable_cache(
    async (): Promise<Article> => {
      const payload = await getPayload({ config });
      const res = await payload.find({
        draft: false,
        collection: "articles",
        depth: 2,
        where: {
          slug: {
            equals: slug,
          },
          _status: {
            equals: "published",
          },
        },
      });

      if (!res || res.docs.length < 1) {
        console.error(`Article with slug ${slug} not found`);
        notFound();
      }

      return res.docs[0];
    },
    ["articles", slug],
    { revalidate: false, tags: ["payload", "articles", slug] }
  );

export const getServices = unstable_cache(
  async (where?: Where): Promise<Service[]> => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      draft: false,
      collection: "services",
      depth: 1,
      pagination: false,
      limit: 100,
      where: {
        ...where,
        _status: {
          equals: "published",
        },
      },
    });

    if (!res) {
      console.error("Failed to fetch articles");
      notFound();
    }

    return res.docs;
  },
  [],
  { revalidate: false, tags: ["payload", "services"] }
);

export const getSocials = unstable_cache(
  async (): Promise<SocialMediaPlatform[]> => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      draft: false,
      collection: "social-media-platforms",
      depth: 1,
      pagination: false,
      limit: 100,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    if (!res) {
      console.error("Failed to fetch articles");
      notFound();
    }

    return res.docs;
  },
  [],
  { revalidate: false, tags: ["payload", "social-media-platforms"] }
);
