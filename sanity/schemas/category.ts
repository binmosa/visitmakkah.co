// @ts-nocheck
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
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
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            description: 'Icon name (e.g., mosque, book, map)',
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'string',
            description: 'Brand color for this category',
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description',
        },
    },
})
