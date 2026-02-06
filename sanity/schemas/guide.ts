// @ts-nocheck
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'guide',
    title: 'Pilgrimage Guide',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
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
            name: 'guideType',
            title: 'Guide Type',
            type: 'string',
            group: 'content',
            options: {
                list: [
                    { title: 'Hajj Guide', value: 'hajj' },
                    { title: 'Umrah Guide', value: 'umrah' },
                    { title: 'Ritual Guide', value: 'ritual' },
                    { title: 'Preparation Guide', value: 'preparation' },
                    { title: 'Travel Guide', value: 'travel' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'difficulty',
            title: 'Difficulty Level',
            type: 'string',
            group: 'content',
            options: {
                list: [
                    { title: 'Beginner', value: 'beginner' },
                    { title: 'Intermediate', value: 'intermediate' },
                    { title: 'Advanced', value: 'advanced' },
                ],
            },
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            group: 'content',
            description: 'Brief summary for previews',
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            fields: [
                { name: 'alt', type: 'string', title: 'Alt Text' },
            ],
        }),
        defineField({
            name: 'introduction',
            title: 'Introduction',
            type: 'array',
            group: 'content',
            of: [{ type: 'block' }],
            description: 'Opening content before the steps',
        }),
        defineField({
            name: 'steps',
            title: 'Guide Steps',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'object',
                    name: 'step',
                    title: 'Step',
                    fields: [
                        {
                            name: 'stepNumber',
                            type: 'number',
                            title: 'Step Number',
                        },
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Step Title',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'arabicTitle',
                            type: 'string',
                            title: 'Arabic Title',
                            description: 'Arabic name of the ritual (if applicable)',
                        },
                        {
                            name: 'duration',
                            type: 'string',
                            title: 'Duration',
                            description: 'e.g., "15-30 minutes"',
                        },
                        {
                            name: 'content',
                            type: 'array',
                            title: 'Step Content',
                            of: [
                                { type: 'block' },
                                {
                                    type: 'image',
                                    options: { hotspot: true },
                                    fields: [
                                        { name: 'alt', type: 'string', title: 'Alt Text' },
                                        { name: 'caption', type: 'string', title: 'Caption' },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'duas',
                            type: 'array',
                            title: 'Duas/Prayers',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'arabic', type: 'text', title: 'Arabic Text' },
                                        { name: 'transliteration', type: 'text', title: 'Transliteration' },
                                        { name: 'translation', type: 'text', title: 'English Translation' },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'tips',
                            type: 'array',
                            title: 'Tips',
                            of: [{ type: 'string' }],
                        },
                        {
                            name: 'warnings',
                            type: 'array',
                            title: 'Common Mistakes to Avoid',
                            of: [{ type: 'string' }],
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            stepNumber: 'stepNumber',
                        },
                        prepare({ title, stepNumber }) {
                            return {
                                title: `Step ${stepNumber || '?'}: ${title}`,
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'conclusion',
            title: 'Conclusion',
            type: 'array',
            group: 'content',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string', title: 'Question' },
                        { name: 'answer', type: 'text', title: 'Answer' },
                    ],
                    preview: {
                        select: { title: 'question' },
                    },
                },
            ],
        }),

        // Settings
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'settings',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'updatedAt',
            title: 'Last Updated',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'estimatedTime',
            title: 'Estimated Time to Complete',
            type: 'string',
            group: 'settings',
            description: 'e.g., "2-3 hours" or "Full day"',
        }),

        // SEO
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
            type: 'guideType',
            media: 'featuredImage',
        },
        prepare({ title, type, media }) {
            return {
                title,
                subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) + ' Guide' : 'Guide',
                media,
            }
        },
    },
})
