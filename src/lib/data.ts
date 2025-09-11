import { getPayload } from "payload";
import { unstable_cache } from "next/cache";

import config from "@payload-config";
import { Article } from "@/payload-types";

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
        throw new Error("Failed to find article");
      }

      return res.docs[0];
    },
    [],
    { revalidate: false, tags: ["payload", "articles", slug] }
  );

export const getArticles = unstable_cache(
  async (): Promise<Article[]> => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      draft: false,
      collection: "articles",
      depth: 1,
      pagination: false,
      sort: "-title",
      limit: 100,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    if (!res) {
      throw new Error("Failed to fetch articles");
    }

    return res.docs;
  },
  [],
  { revalidate: false, tags: ["payload", "articles"] }
);
