import { groq } from 'next-sanity'

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    isNewsletterEdition,
    coverImage{
      asset,
      alt
    },
    body,
    "category": category->{ name, "slug": slug.current },
    "tags": tags[]->{ name, "slug": slug.current },
    "authors": authors[]->{ name, "slug": slug.current, bio, avatar }
  }
`

export const articleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current)]{"slug": slug.current}
`

export const recentArticlesQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    coverImage,
    "category": category->{ name, "slug": slug.current }
  }
`

export const relatedArticlesQuery = groq`
  *[_type == "article" && slug.current != $slug && defined(slug.current)] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    publishedAt,
    "tagLine": coalesce(tags[0]->name, category->name, "HUH")
  }
`

/** Full list for /buscar: filter & sort on the client (good until the archive is very large). */
export const searchArticlesQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "cat": coalesce(category->name, "Análisis"),
    "tagNames": tags[]->name
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    name,
    description,
    "slug": slug.current
  }
`

export const articlesByCategorySlugQuery = groq`
  *[_type == "article" && category->slug.current == $categorySlug && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "tagNames": tags[]->name
  }
`

/** Same shape as articlesByCategorySlugQuery; $tagSlug must match tag document slug.current */
export const articlesByCategorySlugAndTagSlugQuery = groq`
  *[_type == "article" && category->slug.current == $categorySlug && defined(slug.current) && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "tagNames": tags[]->name
  }
`
