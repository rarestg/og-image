import { Hono } from 'hono';
import og from './og';
import { logger } from 'hono/logger';
import { cache } from 'hono/cache';

const app = new Hono()
	.use('*', logger())
	// .use(
	// 	'*',
	// 	cache({
	// 		cacheName: async (c) => {
	// 			const url = new URL(c.req.url);
	// 			const params = url.searchParams.toString();
	// 			return `${c.req.method} ${url.pathname}${params}`;
	// 		},
	// 		cacheControl: 'max-age=86400', // 24 hour
	// 	})
	// )
	.get('/', (c) => {
		return c.text('Hello from OG Image Generator on Cloudflare Worker!');
	})
	.route('og', og);

export default app;
