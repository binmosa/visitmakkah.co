import post from './post'
import author from './author'
import category from './category'
import tag from './tag'
import seo from './seo'
import guide from './guide'
import faq from './faq'

export const schemaTypes = [
    // Content types
    post,
    guide,
    faq,
    // Taxonomies
    category,
    tag,
    // People
    author,
    // Objects
    seo,
]
