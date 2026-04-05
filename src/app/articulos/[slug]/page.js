import { notFound } from 'next/navigation'
import ArticleBodyPortableText from '../../../components/ArticleBodyPortableText/ArticleBodyPortableText'
import ArticlePageClient from '../ArticlePageClient'
import { fetchArticleBySlug, fetchRelatedArticles } from '../../../lib/sanity/articles'
import { isArticleWithheldFromWeb } from '../../../lib/sanity/articleVisibility'
import { buildArticleViewFromSanity } from '../../../lib/sanity/articleView'

export async function generateMetadata({ params }) {
  const { slug } = await params

  const doc = await fetchArticleBySlug(slug)
  if (isArticleWithheldFromWeb(doc)) {
    return { title: 'HAVOC UNDR HEAVEN' }
  }
  if (doc?.title) {
    return {
      title: `${doc.title} — HAVOC UNDR HEAVEN`,
      description: doc.deck || undefined
    }
  }

  return { title: 'Artículo — HAVOC UNDR HEAVEN' }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params

  const doc = await fetchArticleBySlug(slug)
  if (isArticleWithheldFromWeb(doc)) {
    notFound()
  }
  if (!doc) {
    notFound()
  }

  const related = await fetchRelatedArticles(slug)
  const view = buildArticleViewFromSanity(doc, related)
  const body = <ArticleBodyPortableText value={doc.body} />
  return <ArticlePageClient view={view} body={body} />
}
