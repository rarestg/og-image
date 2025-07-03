import { Hono } from 'hono';
import { ImageResponse } from 'workers-og';
import { OGImageComponent } from './profile-card';
import { generateDocumentationHTML } from './documentation';
import { renderErrorImage } from './components/error-image';
import { loadProfileFont } from './services/font-loader';
import { handleOGRoute } from './routes/og-routes';

const app = new Hono();

export default app
	.on('GET', '/', async (c) => {
		const html = generateDocumentationHTML();
		return c.html(html);
	})
	.on('GET', '/og', handleOGRoute)
	.on('GET', ['/profile/', '/profile/:handle?'], async (c) => {
		try {
			const handle = c.req.param('handle');
			const title = c.req.query('title') || handle || 'John Doe';
			const subtitle = c.req.query('subtitle') || 'Software Engineer';
			const description = c.req.query('description') || '';
			const imageUrl = c.req.query('imageUrl') || c.req.query('image') || '';
			const fontParam = c.req.query('font') || 'inter';
			const fontFallback = c.req.query('fontFallback') || 'sans-serif';

			// Font size configuration
			const minSize = c.req.query('minSize');
			const maxSize = c.req.query('maxSize');
			const charWidthRatio = c.req.query('charWidthRatio');
			const scalingExponent = c.req.query('scalingExponent');

			const fontSizeConfig: import('./profile-card').OptimalFontSizeConfig = {};
			if (minSize) fontSizeConfig.minSize = parseInt(minSize, 10);
			if (maxSize) fontSizeConfig.maxSize = parseInt(maxSize, 10);
			if (charWidthRatio) fontSizeConfig.charWidthRatio = parseFloat(charWidthRatio);
			if (scalingExponent) fontSizeConfig.scalingExponent = parseFloat(scalingExponent);

			if (!imageUrl) {
				return await renderErrorImage('imageUrl parameter is required', c);
			}

			// Only accept external images (URLs starting with http/https)
			if (!imageUrl.startsWith('http')) {
				return await renderErrorImage('Only external image URLs are supported (must start with http/https)', c);
			}

			// Pre-fetch the image and convert it to a data URI to handle fetch errors upfront
			let imageFetchResponse;
			try {
				imageFetchResponse = await fetch(imageUrl);
			} catch (fetchError: any) {
				// Network-level errors (DNS, connection, etc.)
				if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
					throw new Error(
						`Cannot access localhost URLs from Cloudflare Workers. Localhost (${imageUrl}) is not accessible from the cloud. Please use a publicly accessible URL instead.`
					);
				}
				throw new Error(
					`Network error fetching image: ${fetchError.message}. Please check if the URL is accessible and try again.`
				);
			}

			if (!imageFetchResponse.ok) {
				const status = imageFetchResponse.status;
				const statusText = imageFetchResponse.statusText;

				// Provide specific error messages based on HTTP status codes
				let errorMessage;
				switch (status) {
					case 403:
						if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
							errorMessage = `Cannot access localhost URLs from Cloudflare Workers. Localhost (${imageUrl}) is not accessible from the cloud. Please use a publicly accessible URL instead.`;
						} else {
							errorMessage = `Access forbidden (403). The server at ${
								new URL(imageUrl).hostname
							} denied access to the image. This could be due to hotlinking protection, authentication requirements, or restricted access policies.`;
						}
						break;
					case 404:
						errorMessage = `Image not found (404). The image at ${imageUrl} does not exist or has been moved. Please check the URL and try again.`;
						break;
					case 500:
						errorMessage = `Server error (500). The server at ${
							new URL(imageUrl).hostname
						} encountered an internal error. Please try again later or use a different image.`;
						break;
					case 502:
					case 503:
					case 504:
						errorMessage = `Service unavailable (${status}). The server at ${
							new URL(imageUrl).hostname
						} is temporarily unavailable. Please try again later.`;
						break;
					case 429:
						errorMessage = `Rate limited (429). Too many requests to ${
							new URL(imageUrl).hostname
						}. Please try again later.`;
						break;
					default:
						errorMessage = `Failed to fetch image (${status} ${statusText}). The server at ${
							new URL(imageUrl).hostname
						} returned an error. Please check the URL and try again.`;
				}
				throw new Error(errorMessage);
			}

			const imageBuffer = await imageFetchResponse.arrayBuffer();
			const imageType = imageFetchResponse.headers.get('content-type');

			if (!imageType || !imageType.startsWith('image/')) {
				throw new Error(
					`Invalid content type. The URL ${imageUrl} returned '${
						imageType || 'unknown'
					}' instead of an image. Please ensure the URL points directly to an image file (PNG, JPEG, GIF, WebP, etc.).`
				);
			}

			const base64 = btoa(new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
			const imageDataUri = `data:${imageType};base64,${base64}`;

			// Load the appropriate font
			const textContent = `${title} ${subtitle} ${description}`;
			let fontFamily: string;
			let font: any;

			try {
				const fontLoadResult = await loadProfileFont(c, fontParam, fontFallback, textContent);
				fontFamily = fontLoadResult.fontFamily;
				font = fontLoadResult.font;
			} catch (error: any) {
				console.error(`Failed to load font '${fontParam}':`, error);
				return await renderErrorImage(error.message, c);
			}

			const ogImageJsx = (
				<OGImageComponent
					title={title}
					subtitle={subtitle}
					description={description}
					imageUrl={imageDataUri}
					fontFamily={fontFamily}
					fontSizeConfig={fontSizeConfig}
				/>
			);

			const response = new ImageResponse(ogImageJsx, {
				width: 1200,
				height: 630,
				fonts: Array.isArray(font) ? [...font] : [font],
				emoji: 'twemoji',
			});

			return response;
		} catch (error: any) {
			console.error('Profile card generation error:', error);
			return await renderErrorImage(`Failed to generate profile card: ${error.message}`, c);
		}
	});
