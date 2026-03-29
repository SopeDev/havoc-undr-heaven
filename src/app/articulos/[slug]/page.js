import { notFound } from 'next/navigation'
import ArticleBodyPortableText from '../../../components/ArticleBodyPortableText/ArticleBodyPortableText'
import ArticlePageClient from '../ArticlePageClient'
import { MOCK_ARTICLES } from '../articleMockData'
import MockArticleBody from '../MockArticleBody'
import { fetchArticleBySlug, fetchRelatedArticles } from '../../../lib/sanity/articles'
import { isSanityConfigured } from '../../../lib/sanity/client'
import { buildArticleViewFromSanity, buildMockArticleView } from '../../../lib/sanity/articleView'

export async function generateMetadata({ params }) {
  const { slug } = await params

  if (isSanityConfigured()) {
    const doc = await fetchArticleBySlug(slug)
    if (doc?.title) {
      return {
        title: `${doc.title} — HAVOC UNDR HEAVEN`,
        description: doc.deck || undefined
      }
    }
  }

  const mock = MOCK_ARTICLES.find(a => a.slug === slug)
  if (mock) {
    return {
      title: `${mock.title} — HAVOC UNDR HEAVEN`,
      description: mock.deck
    }
  }

  return { title: 'Artículo — HAVOC UNDR HEAVEN' }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params

  if (isSanityConfigured()) {
    const doc = await fetchArticleBySlug(slug)
    if (doc) {
      const related = await fetchRelatedArticles(slug)
      const view = buildArticleViewFromSanity(doc, related)
      const body = <ArticleBodyPortableText value={doc.body} />
      return <ArticlePageClient view={view} body={body} />
    }
  }

  const mock = MOCK_ARTICLES.find(a => a.slug === slug)
  if (!mock) notFound()

  const view = buildMockArticleView(mock)
  const body = <MockArticleBody blocks={mock.body} />
  return <ArticlePageClient view={view} body={body} />
}
