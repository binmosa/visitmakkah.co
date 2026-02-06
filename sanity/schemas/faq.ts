// @ts-nocheck
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'faq',
    title: 'FAQ Collection',
    type: 'document',
    description: 'FAQ pages for SEO-rich structured data',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            description: 'Introduction text for the FAQ page',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Hajj', value: 'hajj' },
                    { title: 'Umrah', value: 'umrah' },
                    { title: 'Visa & Travel', value: 'visa-travel' },
                    { title: 'Accommodation', value: 'accommodation' },
                    { title: 'Rituals', value: 'rituals' },
                    { title: 'Health & Safety', value: 'health-safety' },
                    { title: 'General', value: 'general' },
                ],
            },
        }),
        defineField({
            name: 'questions',
            title: 'Questions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'faqItem',
                    title: 'FAQ Item',
                    fields: [
                        {
                            name: 'question',
                            type: 'string',
                            title: 'Question',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'answer',
                            type: 'array',
                            title: 'Answer',
                            of: [
                                { type: 'block' },
                                {
                                    type: 'image',
                                    options: { hotspot: true },
                                    fields: [
                                        { name: 'alt', type: 'string', title: 'Alt Text' },
                                    ],
                                },
                            ],
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'relatedLinks',
                            type: 'array',
                            title: 'Related Links',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'title', type: 'string', title: 'Link Text' },
                                        { name: 'url', type: 'string', title: 'URL' },
                                    ],
                                },
                            ],
                        },
                    ],
                    preview: {
                        select: {
                            title: 'question',
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            questions: 'questions',
        },
        prepare({ title, category, questions }) {
            return {
                title,
                subtitle: `${category || 'General'} • ${questions?.length || 0} questions`,
            }
        },
    },
})
