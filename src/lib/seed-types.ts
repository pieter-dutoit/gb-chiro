export type DayKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MediaSize = {
  filename: string;
  width?: number;
  height?: number;
};

export type SiteMedia = {
  id: number;
  alt: string;
  filename: string;
  width?: number;
  height?: number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  sizes?: Record<string, MediaSize | undefined>;
};

export type SiteSEO = {
  meta: {
    title: string;
    description: string;
  };
  openGraph: {
    siteName: string;
    title: string;
    description: string;
    image: SiteMedia[];
  };
};

export type OpeningHours = {
  opens: string;
  closes: string;
  note?: string | null;
} & Record<DayKey, boolean>;

export type BusinessDetails = {
  id: number;
  bookingLink: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    code: string;
    mapsLink: string;
    coords: [number, number];
  };
  operatingHours: OpeningHours[];
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  thumbnail: SiteMedia;
  article?: Article;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  author: string;
  thumbnail?: SiteMedia;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type SocialPlatform = {
  id: number;
  name: "facebook" | "instagram";
  link: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: number;
  name: string;
  text: string;
  platform?: string | null;
  link?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NewPatientStep = {
  id: number;
  icon: SiteMedia;
  title: string;
  overview: string;
  description: string[];
  createdAt: string;
  updatedAt: string;
};

export type GraphicsData = {
  id: number;
  logo: SiteMedia;
  horizontalLogo: SiteMedia;
  backgroundGraphic: SiteMedia;
  createdAt: string;
  updatedAt: string;
};

export type HomePageData = {
  id: number;
  landingImage: SiteMedia;
  whatToExpectImage: SiteMedia;
  seo: SiteSEO;
  createdAt: string;
  updatedAt: string;
};

export type AboutUsPageData = {
  id: number;
  welcomeImage: SiteMedia;
  meetTheChiroImage: SiteMedia;
  practiceImages: SiteMedia[];
  seo: SiteSEO;
  createdAt: string;
  updatedAt: string;
};

export type WhatToExpectPageData = {
  id: number;
  steps: NewPatientStep[];
  seo: SiteSEO;
  createdAt: string;
  updatedAt: string;
};

export type TreatmentAndCarePageData = {
  id: number;
  services: Service[];
  seo: SiteSEO;
  createdAt: string;
  updatedAt: string;
};

export type ContactUsPageData = {
  id: number;
  seo: SiteSEO;
  createdAt: string;
  updatedAt: string;
};
