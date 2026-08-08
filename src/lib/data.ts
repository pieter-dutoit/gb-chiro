import {
  aboutUsPageData,
  articles,
  businessDetails,
  contactUsPageData,
  graphics,
  homePageData,
  reviews,
  services,
  socials,
  treatmentAndCarePageData,
  whatToExpectPageData,
} from "./site-data";

export async function getGraphics() {
  return graphics;
}

export async function getBusinessDetails() {
  return businessDetails;
}

export async function getHomePageData() {
  return homePageData;
}

export async function getAboutUsPageData() {
  return aboutUsPageData;
}

export async function getWhatToExpectPageData() {
  return whatToExpectPageData;
}

export async function getTreatmentAndCareData() {
  return treatmentAndCarePageData;
}

export async function getContactUsPageData() {
  return contactUsPageData;
}

export async function getServices() {
  return services;
}

export async function getServicesWithArticles() {
  return services.filter((service) => Boolean(service.article));
}

export async function getArticles() {
  return articles;
}

export async function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function getSocials() {
  return socials;
}

export async function getReviews() {
  return reviews;
}
