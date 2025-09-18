import { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import CMSImage from "@/components/cms-image";
import MoreArticlesCarousel from "@/components/more-articles";
import { ArticleRichText } from "@/components/rich-text";
import { Typography } from "@/components/ui/typography";

import { Article } from "@/payload-types";

import { generateArticleMetadata } from "@/lib/utils/generate-article-metadata";
import { getArticle, getServices } from "@/lib/data";
import { formatDate, getBaseUrl, getDaysDifference } from "@/lib/utils";

import {
  createStructuredData,
  getImageObject,
} from "@/lib/utils/create-structured-data";

export const dynamicParams = true;
export const revalidate = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const services = await getServices({ article: { exists: true } });

  const articles: Article[] = services
    .filter((service) => service.article && typeof service.article !== "number")
    .map(({ article }) => article as Article);

  return articles.map(({ slug }) => ({
    slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug)();
  if (!article) return {};

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug)();
  if (!article) return null;

  const { title, thumbnail, body, author, createdAt, updatedAt } = article;

  const createdDate = formatDate(createdAt);
  const updatedDate = updatedAt?.length > 0 && formatDate(updatedAt);

  const showUpdatedAt =
    !!updatedDate && getDaysDifference(createdAt, updatedAt) >= 1;

  const jsonLd = await createStructuredData({
    type: "MedicalWebPage",
    identifier: `/treatment-and-care/${slug}`,
    slug: `/treatment-and-care/${slug}`,
    name: title,
    crumbs: [
      { name: "Home", slug: "" },
      { name: "Treatment & Care", slug: "/treatment-and-care" },
      { name: title, slug: `/treatment-and-care/${slug}` },
    ],
    additionalData: {
      mainEntity: {
        "@context": "https://schema.org",
        "@type": "Article",
        url: `${getBaseUrl()}/treatment-and-care/${slug}`,
        headline: title,
        ...(thumbnail && {
          image: getImageObject(thumbnail),
        }),
        datePublished: createdDate.dateTime,
        ...(showUpdatedAt && {
          dateModified: updatedDate.dateTime,
        }),
        author: {
          "@type": "Organization",
          name: "GB Chiropractic",
          url: getBaseUrl(),
        },
        publisher: { "@id": `${getBaseUrl()}#gb-chiropractic` },
      },
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Treatment & Care", item: "/treatment-and-care" },
          {
            name: title,
            item: `/treatment-and-care/${slug}`,
          },
        ]}
      />
      <section className="relative">
        {/* Container */}
        <div className="container max-w-[70ch] mx-auto px-4 md:px-12 py-16 lg:py-20 xl:py-24 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-baseline gap-2">
            {/* Title */}
            <Typography as="h1" variant="articleH1" className="mt-2">
              {title}
            </Typography>

            {/* Author & Publish date */}
            <div className="space-y-1 text-xs font-semibold opacity-70">
              <p>
                <strong>{author}</strong>
              </p>
              <p>
                Published on{" "}
                <time dateTime={createdDate.dateTime}>
                  {createdDate.humanReadable}
                </time>{" "}
                {updatedDate && showUpdatedAt && (
                  <>
                    <br />
                    <>
                      Updated on{" "}
                      <time dateTime={updatedDate.dateTime}>
                        {updatedDate.humanReadable}
                      </time>
                    </>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Thumbnail */}
          {thumbnail && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-primary/10">
              {/* Blur bg */}
              <CMSImage
                priority
                media={thumbnail}
                sizes="(min-width: 660px) 576px, 90vw"
                className="object-cover object-center -z-0 blur-xl scale-125"
              />

              <CMSImage
                priority
                media={thumbnail}
                sizes="(min-width: 660px) 576px, 90vw"
                className="object-contain object-center z-10"
              />
            </div>
          )}

          {/* Content */}
          <ArticleRichText data={body} />
        </div>
      </section>

      <MoreArticlesCarousel slugToExclude={slug} />
    </>
  );
}
