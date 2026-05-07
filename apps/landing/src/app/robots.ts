import type { MetadataRoute } from 'next';
import { baseUrl } from '~/config/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Block AI training crawlers — keep model training opted out.
      {
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'ClaudeBot',
          'anthropic-ai',
          'cohere-ai',
          'CCBot',
          'Bytespider',
          'Amazonbot',
          'FacebookBot',
        ],
        disallow: '/',
      },
      // Allow AI retrieval / search bots — surface in citations / answers.
      {
        userAgent: [
          'OAI-SearchBot',
          'Claude-User',
          'Claude-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
          'Applebot-Extended',
        ],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
