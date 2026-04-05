import { groq } from 'next-sanity'
import { groqArticleVisibleOnWeb } from './articleVisibility'

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    includeInWeeklyNewsletter,
    releasedToWebAt,
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
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb}]{"slug": slug.current}
`

export const recentArticlesQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc)[0...$limit]{
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

/** Homepage feed: category name + tag names for eyebrow lines */
export const homePageArticlesQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc)[0...$limit] {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "tagNames": tags[]->name
  }
`

export const relatedArticlesQuery = groq`
  *[_type == "article" && slug.current != $slug && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    publishedAt,
    "tagLine": coalesce(tags[0]->name, category->name, "HUH")
  }
`

/** Full list for /buscar: filter & sort on the client (good until the archive is very large). */
export const searchArticlesQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc) {
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
  *[_type == "article" && category->slug.current == $categorySlug && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc) {
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
  *[_type == "article" && category->slug.current == $categorySlug && defined(slug.current) && ${groqArticleVisibleOnWeb} && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "tagNames": tags[]->name
  }
`

/** Latest N articles in a category (no tema filter). $limit must be a small integer (e.g. 3). */
export const articlesByCategorySlugLimitedQuery = groq`
  *[_type == "article" && category->slug.current == $categorySlug && defined(slug.current) && ${groqArticleVisibleOnWeb}] | order(publishedAt desc)[0...$limit] {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "tagNames": tags[]->name
  }
`

/** Focos ordered by last updated (editor field, else Sanity system _updatedAt). */
export const focosLatestByUpdatedQuery = groq`
  *[_type == "foco" && defined(slug.current)] | order(coalesce(updatedAt, _updatedAt) desc)[0...$limit] {
    title,
    "slug": slug.current,
    titleLines,
    status,
    regionLineOverride,
    "tagNames": tags[]->name
  }
`

export const focosIndexListQuery = groq`
  *[_type == "foco" && defined(slug.current)] {
    title,
    "slug": slug.current,
    titleLines,
    status,
    statusLabel,
    regionLineOverride,
    summary,
    updatedAt,
    featured,
    sortOrder,
    "tagNames": tags[]->name,
    "tagIds": tags[]._ref
  } | order(featured desc, sortOrder asc, title asc)
`

/** Minimal rows to count articles per foco tag set on the client */
export const articlesTagRefsQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb}] {
    "tagRefs": tags[]._ref
  }
`

export const focoBySlugQuery = groq`
  *[_type == "foco" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    titleLines,
    status,
    statusLabel,
    regionLineOverride,
    summary,
    updatedAt,
    "tagIds": tags[]._ref,
    "tagNames": tags[]->name,
    actors,
    tensionIndicators,
    keyFigures,
    signalQuote,
    timeline,
    "contextPortable": context,
    contextReadings,
    "relatedFocos": relatedFocos[]->{
      title,
      "slug": slug.current,
      titleLines,
      status,
      regionLineOverride,
      summary,
      "tagNames": tags[]->name
    }
  }
`

export const tagBySlugQuery = groq`
  *[_type == "tag" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description
  }
`

export const articlesByTagSlugQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb} && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    "tagNames": tags[]->name,
    "tagList": tags[]->{ name, "slug": slug.current }
  }
`

export const focosByTagSlugQuery = groq`
  *[_type == "foco" && defined(slug.current) && $tagSlug in tags[]->slug.current] | order(sortOrder asc, title asc) {
    title,
    "slug": slug.current,
    titleLines,
    status,
    regionLineOverride,
    "tagNames": tags[]->name
  }
`

export const allCategoriesQuery = groq`
  *[_type == "category" && defined(slug.current)] | order(name asc) {
    name,
    "slug": slug.current
  }
`

export const allTagsQuery = groq`
  *[_type == "tag" && defined(slug.current)] | order(name asc) {
    name,
    "slug": slug.current
  }
`

/** Articles that share at least one tag with the foco ($tagRefs = array of tag document _id) */
export const articlesForFocoTagsQuery = groq`
  *[_type == "article" && defined(slug.current) && ${groqArticleVisibleOnWeb} && defined(tags[@._ref in $tagRefs][0])] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    deck,
    publishedAt,
    readingTimeMinutes,
    isNewsletterEdition,
    "categoryName": category->name
  }
`

/**
 * Dispatch editions visible on the web (email already sent).
 * Do NOT use `articles[]->[_type == "article" && …]` — in GROQ the `[]` filter after `->` can be
 * evaluated in the *parent* (newsletterIssue) scope, so `_type == "article"` is always false and
 * every article is dropped. Expand with `articles[]->{ … }` and filter in JS (see newsletterIssues.js).
 */
export const newsletterIssuesForWebQuery = groq`
  *[_type == "newsletterIssue" && defined(emailSentAt) && emailSentAt <= now()] | order(issuedAt desc) {
    _id,
    title,
    issuedAt,
    intro,
    "articles": articles[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      deck,
      publishedAt,
      readingTimeMinutes,
      includeInWeeklyNewsletter,
      releasedToWebAt,
      "categoryName": category->name,
      "tagNames": tags[]->name,
      "tagSlugs": tags[]->slug.current
    }
  }
`

/** Homepage “Despachos recientes”: last 3 sent issues, no article expansion */
export const newsletterIssuesHomeDispatchesQuery = groq`
  *[_type == "newsletterIssue" && defined(emailSentAt) && emailSentAt <= now()] | order(issuedAt desc)[0..2] {
    _id,
    title,
    issuedAt,
    intro,
    "slug": slug.current
  }
`
