import CMSImage from "@/components/cms-image";
import { ArticleRichText } from "@/components/rich-text";
import { Typography } from "@/components/ui/typography";
import { getArticle, getArticles } from "@/lib/data";
import { formatDate, getDaysDifference } from "@/lib/utils";

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
    <section className="relative">
      {/* Container */}
      <div className="container max-w-[70ch] mx-auto px-4 md:px-12 py-10 lg:py-16 xl:py-20 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-baseline gap-2">
          {/* Tag */}
          <div className="text-xs leading-tight bg-zinc-400 text-white font-extrabold px-2 py-1 rounded-sm">
            Article
          </div>
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
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
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
  );
}

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map(({ slug }) => ({
    slug,
  }));
}
