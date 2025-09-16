import Breadcrumbs from "@/components/breadcrumbs";
import CMSImage from "@/components/cms-image";
import MoreArticlesCarousel from "@/components/more-articles";
import { ArticleRichText } from "@/components/rich-text";
import { Typography } from "@/components/ui/typography";
import { getArticle, getServices } from "@/lib/data";
import { formatDate, getDaysDifference } from "@/lib/utils";
import { Article } from "@/payload-types";

export const dynamicParams = true;
export const revalidate = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const services = await getServices();

  const withArticles: Article[] = services
    .filter((service) => service.article && typeof service.article !== "number")
    .map(({ article }) => article as Article);

  return withArticles.map(({ slug }) => ({
    slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug)();

  if (!article) return null;

  const { title, thumbnail, body, author, createdAt, updatedAt } = article;
  const createdDate = formatDate(createdAt);

  const updatedDate = updatedAt?.length && formatDate(updatedAt);
  const showUpdatedAt =
    updatedAt?.length && getDaysDifference(createdAt, updatedAt) >= 1;

  return (
    <>
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
            <Typography as="h1" variant="articleH1">
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
