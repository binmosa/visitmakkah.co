// @ts-nocheck
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Title for search engines (50-60 characters recommended)',
            validation: (Rule) => Rule.max(70).warning('Keep under 60 characters for best results'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Description for search engines (150-160 characters recommended)',
            validation: (Rule) => Rule.max(170).warning('Keep under 160 characters for best results'),
        }),
        defineField({
            name: 'keywords',
            title: 'Focus Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Primary keywords for this content',
        }),
        defineField({
            name: 'ogImage',
            title: 'Social Share Image',
            type: 'image',
            description: 'Image for social media sharing (1200x630 recommended)',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'canonicalUrl',
            title: 'Canonical URL',
            type: 'url',
            description: 'Set if this content exists elsewhere (leave empty for default)',
        }),
        defineField({
            name: 'noIndex',
            title: 'Hide from Search Engines',
            type: 'boolean',
            description: 'Enable to prevent this page from being indexed',
            initialValue: false,
        }),
    ],
})
