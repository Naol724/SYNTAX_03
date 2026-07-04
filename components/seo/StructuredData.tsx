import Script from "next/script"

interface OrganizationProps {
  name: string
  url: string
  logo: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    email: string
    contactType: string
  }
  sameAs: string[]
}

export function OrganizationStructuredData({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  sameAs,
}: OrganizationProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      ...contactPoint,
    },
    sameAs,
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface WebSiteProps {
  name: string
  url: string
  description: string
  potentialAction: {
    target: string
    queryInput: string
  }
}

export function WebSiteStructuredData({ name, url, description, potentialAction }: WebSiteProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: potentialAction.target,
      "query-input": potentialAction.queryInput,
    },
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbProps {
  items: {
    name: string
    item: string
  }[]
}

export function BreadcrumbStructuredData({ items }: BreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface ArticleProps {
  headline: string
  image: string
  author: string
  datePublished: string
  dateModified: string
  description: string
}

export function ArticleStructuredData({
  headline,
  image,
  author,
  datePublished,
  dateModified,
  description,
}: ArticleProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    image,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished,
    dateModified,
    description,
  }

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface ServiceProps {
  name: string
  description: string
  provider: string
}

export function ServiceStructuredData({ name, description, provider }: ServiceProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
  }

  return (
    <Script
      id="service-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
