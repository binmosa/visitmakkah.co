export const metadata = {
    title: 'Visit Makkah CMS',
    description: 'Content Management System',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
