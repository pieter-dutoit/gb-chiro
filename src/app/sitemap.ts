import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/lib/utils";
import {
  getAboutUsPageData,
  getArticle,
  getBusinessDetails,
  getGraphics,
  getHomePageData,
  getServices,
  getSocials,
  getTreatmentAndCareData,
  getWhatToExpectPageData,
} from "@/lib/data";
import { Article, Media } from "@/payload-types";

function extractMediaUrls(media: (Media | number)[]): string[] {
  return media
    .filter((item): item is Media => typeof item !== "number" && "url" in item)
    .map(
      (item) =>
        `${getBaseUrl()}/api/images/${encodeURIComponent(item.filename ?? "")}`
    );
}

async function getLastModified(
  fetchers: Array<() => Promise<unknown>>
): Promise<string | undefined> {
  try {
    const settled = await Promise.allSettled(fetchers.map((f) => f()));
    const values = settled
      .filter(
        (s): s is PromiseFulfilledResult<unknown> => s.status === "fulfilled"
      )
      .map((s) => s.value);

    const items = values.flatMap((v: any) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return [v];
    });

    const dates = items
      .map((i: any) => i?.updatedAt ?? i?.createdAt)
      .map((d: unknown) =>
        typeof d === "string" || d instanceof Date ? new Date(d) : undefined
      )
      .filter((d): d is Date => !!d && !isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    return dates[0]?.toISOString();
  } catch (err) {
    console.error(err);
    console.error('failed to fetch "Last modified data"');
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = getBaseUrl();

  // Articles data
  const services = await getServices({ article: { exists: true } });
  const articles: Article[] = services
    .filter((service) => service.article && typeof service.article !== "number")
    .map(({ article }) => article as Article);

  // Images
  const { logo, horizontalLogo } = await getGraphics();
  const { landingImage, whatToExpectImage } = await getHomePageData();
  const { welcomeImage, meetTheChiroImage, practiceImages } =
    await getAboutUsPageData();

  return [
    // Home Page
    {
      url: baseURL,
      lastModified: await getLastModified([
        getBusinessDetails,
        getTreatmentAndCareData,
        getWhatToExpectPageData,
        getSocials,
      ]),
      changeFrequency: "monthly" as const,
      priority: 1,
      images: extractMediaUrls([
        logo,
        horizontalLogo,
        landingImage,
        whatToExpectImage,
      ]),
    },
    // About page
    {
      url: baseURL + "/about-us",
      lastModified: await getLastModified([getAboutUsPageData]),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images: extractMediaUrls([
        welcomeImage,
        meetTheChiroImage,
        ...practiceImages,
      ]),
    },
    {
      url: baseURL + "/treatment-and-care",
      lastModified: await getLastModified([getTreatmentAndCareData]),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: extractMediaUrls(services.map(({ thumbnail }) => thumbnail)),
    },
    ...(await Promise.all(
      articles.map(async ({ slug }) => ({
        url: baseURL + "/treatment-and-care/" + slug,
        lastModified: await getLastModified([getArticle(slug || "")]),
        priority: 0.7,
        changeFrequency: "monthly" as const,
      }))
    )),
    {
      url: baseURL + "/what-to-expect",
      lastModified: await getLastModified([getWhatToExpectPageData]),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    // Contact page
    {
      url: baseURL + "/contact-us",
      lastModified: await getLastModified([
        // async () => getSEOConfig("contact-us"),
        getBusinessDetails,
        getSocials,
      ]),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];
}
