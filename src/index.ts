import { Hono } from 'hono';
import og from './og';
import { logger } from 'hono/logger';
import { cache } from 'hono/cache';

const app = new Hono()
	.use('*', logger())
	.route('/', og);

export default app;
