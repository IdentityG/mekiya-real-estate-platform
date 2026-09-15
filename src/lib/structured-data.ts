/**
 * Generate JSON-LD structured data for SEO
 * https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Mekiya Real Estate",
    description:
      "Premium real estate agency in Addis Ababa, Ethiopia. Specializing in apartments, commercial properties, and verified listings.",
    url: process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com",
    logo: `${process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com"}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+251-11-XXX-XXXX",
      contactType: "Customer Service",
      areaServed: "ET",
      availableLanguage: ["English", "Amharic", "Oromo"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "CMC, Addis Ababa",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    sameAs: [
      "https://facebook.com/mekiya",
      "https://twitter.com/mekiya_realestate",
      "https://instagram.com/mekiya_realestate",
      "https://linkedin.com/company/mekiya-real-estate",
    ],
  };
}

export function generatePropertySchema(property: {
  name: string;
  description: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size?: number | null;
  images: string[];
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.description,
    url: property.url,
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability: "https://schema.org/InStock",
      url: property.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressCountry: "ET",
    },
    ...(property.size && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.size,
        unitCode: "MTK",
      },
    }),
    ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url,
    publisher: {
      "@type": "Organization",
      name: "Mekiya Real Estate",
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com"}/#organization`,
    name: "Mekiya Real Estate",
    description:
      "Premium real estate agency in Addis Ababa specializing in residential and commercial properties",
    url: process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com",
    telephone: "+251-11-XXX-XXXX",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "CMC, Addis Ababa",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.005401,
      longitude: 38.763611,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2000",
    },
  };
}
