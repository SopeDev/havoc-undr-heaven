import article from './article'
import author from './author'
import blockContent from './blockContent'
import category from './category'
import foco from './foco'
import newsletterIssue from './newsletterIssue'
import redesSettings from './redesSettings'
import tag from './tag'

export const schemaTypes = [blockContent, author, category, tag, foco, newsletterIssue, article, redesSettings]

export const singletonTypes = new Set(['redesSettings'])
