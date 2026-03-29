'use client'

import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '../../lib/sanity/image'

const components = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3 className='article-body-h3'>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>
  },
  list: {
    bullet: ({ children }) => <ul className='article-body-list'>{children}</ul>,
    number: ({ children }) => <ol className='article-body-list article-body-ol'>{children}</ol>
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = /^https?:\/\//.test(href)
      if (isExternal) {
        return (
          <a href={href} target='_blank' rel='noopener noreferrer' className='article-body-link'>
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className='article-body-link'>
          {children}
        </Link>
      )
    }
  },
  types: {
    image: ({ value }) => {
      const src = urlForImage(value)
      if (!src) return null
      const alt = value?.alt || ''
      return (
        <figure className='article-body-figure'>
          <Image src={src} alt={alt} width={1200} height={675} className='article-body-inline-img' sizes='(max-width: 900px) 100vw, 820px' />
          {alt ? <figcaption className='image-caption'>{alt}</figcaption> : null}
        </figure>
      )
    }
  }
}

export default function ArticleBodyPortableText({ value }) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <p className='article-body-empty'>Este artículo aún no tiene cuerpo en el CMS.</p>
  }
  return <PortableText value={value} components={components} />
}
