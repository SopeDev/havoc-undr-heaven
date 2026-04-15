import { formatArticleDate } from '../sanity/articleView'
import { NEWSLETTER_TEMPLATE_VARIANTS } from './constants'

const C = {
  black: '#0A0A0A',
  text: '#1A1A1A',
  muted: '#999999',
  mid: '#555555',
  border: '#E0E0E0',
  white: '#FFFFFF'
}

const escapeHtml = value => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const tagsEyebrowText = article => {
  const tags = Array.isArray(article.tagNames) ? article.tagNames.filter(Boolean) : []
  return tags.join(' · ')
}

const readingTimeLabel = article =>
  typeof article.readingTimeMinutes === 'number' ? `${article.readingTimeMinutes} min de lectura` : '—'

const articleUrl = (baseUrl, slug) => `${baseUrl.replace(/\/+$/, '')}/articulos/${slug}`

const breadcrumbRow = ({ baseUrl, issueTitle }) => {
  const home = escapeHtml(baseUrl.replace(/\/+$/, ''))
  const t = escapeHtml(issueTitle)
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 28px;">
      <tr>
        <td style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: ${C.muted}; letter-spacing: 0.5px;">
          <a href="${home}" style="color: ${C.muted}; text-decoration: none;">Inicio</a>
          <span style="color: ${C.border}; margin: 0 6px;">›</span>
          <a href="${home}/categoria/newsletter" style="color: ${C.muted}; text-decoration: none;">Newsletter</a>
          <span style="color: ${C.border}; margin: 0 6px;">›</span>
          <span style="color: ${C.text}; font-weight: 600;">${t}</span>
        </td>
      </tr>
    </table>
  `
}

const issueHeaderBlock = ({ title, intro, issueDate }) => {
  const d = escapeHtml(issueDate)
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 40px; padding-bottom: 8px; border-bottom: 1px solid ${C.border};">
      <tr>
        <td>
          <div style="font-family: Helvetica, Arial, sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${C.muted}; margin: 0 0 14px;">
            <span style="background: ${C.black}; color: ${C.white}; padding: 3px 10px; font-size: 9px; letter-spacing: 2px; display: inline-block; margin-right: 12px;">Dispatch</span>
            <span>${d}</span>
          </div>
          <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 34px; font-weight: 900; line-height: 1.08; color: ${C.text}; margin: 0 0 18px; letter-spacing: -0.5px;">
            ${escapeHtml(title)}
          </h1>
          <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 400; font-style: italic; color: ${C.mid}; line-height: 1.5; margin: 0; padding-bottom: 20px; border-bottom: 2px solid ${C.black};">
            ${escapeHtml(intro)}
          </p>
        </td>
      </tr>
    </table>
  `
}

const articleBlock = (article, baseUrl, index, variant) => {
  const slug = typeof article.slug === 'string' ? article.slug.trim() : ''
  if (!slug) return ''

  const href = escapeHtml(articleUrl(baseUrl, slug))
  const category = typeof article.categoryName === 'string' ? article.categoryName.trim() : 'Artículo'
  const tagsLine = tagsEyebrowText(article)
  const dateLabel = formatArticleDate(article.publishedAt)
  const readLabel = readingTimeLabel(article)
  const coverUrl = typeof article.coverUrl === 'string' && article.coverUrl.trim() ? article.coverUrl.trim() : ''
  const alt = escapeHtml(article.coverImage?.alt || article.title || '')

  const topRule =
    index > 0
      ? `padding-top: 40px; margin-top: 8px; border-top: 1px solid ${C.border};`
      : ''

  const eyebrowTags = tagsLine
    ? `<span style="font-family: Helvetica, Arial, sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${C.muted};">${escapeHtml(tagsLine)}</span>`
    : ''

  const imageRow = coverUrl
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 28px;">
      <tr>
        <td style="border: 1px solid ${C.border}; line-height: 0;">
          <a href="${href}" style="display: block; text-decoration: none;">
            <img src="${escapeHtml(coverUrl)}" alt="${alt}" width="748" style="width: 100%; max-width: 748px; height: auto; display: block; border: 0;" />
          </a>
        </td>
      </tr>
    </table>
  `
    : ''

  if (variant === NEWSLETTER_TEMPLATE_VARIANTS.COMPACT) {
    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${topRule} margin-bottom: 0;">
      <tr>
        <td style="padding-bottom: 18px;">
          <div style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: ${C.muted}; margin: 0 0 8px;">
            ${escapeHtml(category)}${tagsLine ? ` · ${escapeHtml(tagsLine)}` : ''}
          </div>
          <a href="${href}" style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 900; line-height: 1.1; color: ${C.text}; text-decoration: none;">
            ${escapeHtml(article.title || 'Artículo')}
          </a>
          ${
            article.deck
              ? `<p style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-style: italic; line-height: 1.5; color: ${C.mid}; margin: 10px 0 0;">${escapeHtml(article.deck)}</p>`
              : ''
          }
          <p style="font-family: Helvetica, Arial, sans-serif; margin: 10px 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${C.muted};">
            ${escapeHtml(dateLabel)} · ${escapeHtml(readLabel)}
          </p>
        </td>
      </tr>
    </table>
  `
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${topRule} margin-bottom: 0;">
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 14px;">
            <tr>
              <td style="background: ${C.black}; color: ${C.white}; padding: 3px 10px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; vertical-align: middle;">
                ${escapeHtml(category)}
              </td>
              <td style="padding-left: 12px; vertical-align: middle;">
                ${eyebrowTags}
              </td>
            </tr>
          </table>

          <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 900; line-height: 1.08; color: ${C.text}; margin: 0 0 18px; letter-spacing: -0.5px;">
            <a href="${href}" style="color: ${C.text}; text-decoration: none;">${escapeHtml(article.title || 'Artículo')}</a>
          </h2>

          ${
            article.deck
              ? `<p style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 400; font-style: italic; color: ${C.mid}; line-height: 1.5; margin: 0 0 24px; padding-bottom: 24px; border-bottom: 2px solid ${C.black};">
            ${escapeHtml(article.deck)}
          </p>`
              : `<div style="margin: 0 0 24px; padding-bottom: 24px; border-bottom: 2px solid ${C.black};"></div>`
          }

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 32px; padding: 14px 0; border-bottom: 1px solid ${C.border};">
            <tr>
              <td style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${C.muted};">
                ${escapeHtml(dateLabel)}
                <span style="margin: 0 10px; color: ${C.border};">·</span>
                ${escapeHtml(readLabel)}
              </td>
              <td align="right" style="font-family: Helvetica, Arial, sans-serif;">
                <a href="${href}" style="display: inline-block; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.white}; background: ${C.black}; border: 1px solid ${C.black}; padding: 8px 18px; text-decoration: none; font-weight: 600;">
                  Leer artículo
                </a>
              </td>
            </tr>
          </table>

          ${imageRow}
        </td>
      </tr>
    </table>
  `
}

const footerBlock = ({ baseUrl }) => {
  const home = escapeHtml(baseUrl.replace(/\/+$/, ''))
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 48px; padding-top: 28px; border-top: 2px solid ${C.black};">
      <tr>
        <td style="font-family: Helvetica, Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${C.muted}; text-align: center;">
          <a href="${home}" style="color: ${C.text}; text-decoration: none; font-weight: 700;">HAVOC UNDR HEAVEN</a>
          <div style="margin-top: 10px; line-height: 1.6;">
            <a href="${home}/categoria/newsletter" style="color: ${C.muted}; text-decoration: underline;">Ver archivo del newsletter</a>
          </div>
        </td>
      </tr>
    </table>
  `
}

export const buildDispatchEmailHtml = ({ issue, baseUrl, variant = NEWSLETTER_TEMPLATE_VARIANTS.ARTICLE }) => {
  const title = issue?.title?.trim() || 'HAVOC DISPATCH'
  const intro =
    issue?.intro?.trim() || 'Resumen semanal de geopolítica y del tablero internacional.'
  const articles = Array.isArray(issue?.articles) ? issue.articles : []
  const issueDate = formatArticleDate(issue?.issuedAt)

  const articlesHtml = articles
    .map((a, i) => articleBlock(a, baseUrl, i, variant))
    .filter(Boolean)
    .join('')

  const emptyMsg = `
    <p style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: ${C.mid}; margin: 0;">
      Esta edición todavía no tiene artículos listados.
    </p>
  `

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background: ${C.white};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: ${C.white};">
    <tr>
      <td align="center" style="padding: 32px 16px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 820px; margin: 0 auto;">
          <tr>
            <td style="padding: 0 8px;">
              ${breadcrumbRow({ baseUrl, issueTitle: title })}
              ${issueHeaderBlock({ title, intro, issueDate })}
              ${articlesHtml || emptyMsg}
              ${footerBlock({ baseUrl })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
