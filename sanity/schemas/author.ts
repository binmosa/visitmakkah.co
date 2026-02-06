// @ts-nocheck
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            description: 'e.g., Islamic Scholar, Travel Expert, Local Guide',
        }),
        defineField({
            name: 'credentials',
            title: 'Credentials',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Qualifications, certifications, expertise',
        }),
        defineField({
            name: 'social',
            title: 'Social Links',
            type: 'object',
            fields: [
                { name: 'twitter', type: 'url', title: 'Twitter' },
                { name: 'linkedin', type: 'url', title: 'LinkedIn' },
                { name: 'website', type: 'url', title: 'Website' },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
            media: 'image',
        },
    },
})
