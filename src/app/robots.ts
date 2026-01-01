import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://drive.io';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example of blocking private routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
