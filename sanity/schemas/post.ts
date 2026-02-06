import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        // Content Group
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            group: 'content',
            description: 'Brief summary for previews and SEO',
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            group: 'content',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                    description: 'Important for SEO and accessibility',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Caption',
                },
            ],
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                            { title: 'Underline', value: 'underline' },
                            { title: 'Highlight', value: 'highlight' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                        validation: (Rule) =>
                                            Rule.uri({
                                                scheme: ['http', 'https', 'mailto', 'tel'],
                                            }),
                                    },
                                    {
                                        name: 'openInNewTab',
                                        type: 'boolean',
                                        title: 'Open in new tab',
                                        initialValue: false,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alt Text',
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                    ],
                },
                {
                    type: 'object',
                    name: 'callout',
                    title: 'Callout Box',
                    fields: [
                        {
                            name: 'type',
                            type: 'string',
                            title: 'Type',
                            options: {
                                list: [
                                    { title: 'Info', value: 'info' },
                                    { title: 'Tip', value: 'tip' },
                                    { title: 'Warning', value: 'warning' },
                                    { title: 'Islamic Note', value: 'islamic' },
                                ],
                            },
                        },
                        {
                            name: 'content',
                            type: 'text',
                            title: 'Content',
                        },
                    ],
                    preview: {
                        select: {
                            title: 'content',
                            subtitle: 'type',
                        },
                    },
                },
                {
                    type: 'object',
                    name: 'youtube',
                    title: 'YouTube Video',
                    fields: [
                        {
                            name: 'url',
                            type: 'url',
                            title: 'YouTube URL',
                        },
                    ],
                    preview: {
                        select: {
                            title: 'url',
                        },
                    },
                },
            ],
        }),

        // Settings Group
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'settings',
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            group: 'settings',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'tag' }] }],
            group: 'settings',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'updatedAt',
            title: 'Last Updated',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'readingTime',
            title: 'Reading Time (minutes)',
            type: 'number',
            group: 'settings',
            description: 'Estimated reading time',
        }),
        defineField({
            name: 'featured',
            title: 'Featured Post',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
        }),

        // SEO Group
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            group: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'featuredImage',
            date: 'publishedAt',
        },
        prepare({ title, author, media, date }) {
            const formattedDate = date
                ? new Date(date).toLocaleDateString()
                : 'Draft'
            return {
                title,
                subtitle: `${author || 'No author'} • ${formattedDate}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Published Date, Old',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
    ],
})
