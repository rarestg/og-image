import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { loadImage } from '../loadImage';
import { loadBasicFont } from '../services/font-loader';
import { renderErrorImage } from '../components/error-image';
import {
	ModernGradientStyle,
	EcoGreenStyle,
	CloudflareStyle,
	GitHubStyle
} from '../components/og-styles';

/**
 * Handle the /og route for generating OG images with different styles
 */
export async function handleOGRoute(c: Context) {
	try {
		const mainText = c.req.query('mainText') || 'Default Title';
		const description = c.req.query('description') || 'Default Description';
		const footerText = c.req.query('footerText') || 'Footer Text';
		const style = c.req.query('style') || '1';

		const font = await loadBasicFont(c);

		let ogImageContent: JSX.Element;

		switch (style) {
			case '1':
				ogImageContent = (
					<ModernGradientStyle
						mainText={mainText}
						description={description}
						footerText={footerText}
					/>
				);
				break;
			
			case '2':
				ogImageContent = (
					<EcoGreenStyle
						mainText={mainText}
						description={description}
						footerText={footerText}
					/>
				);
				break;
			
			case '3':
				const logoImage = await loadImage(c, '/images/cf-logo-v-rgb.png');
				ogImageContent = (
					<CloudflareStyle
						mainText={mainText}
						description={description}
						footerText={footerText}
						logoImage={logoImage || undefined}
					/>
				);
				break;
			
			default:
				ogImageContent = (
					<GitHubStyle
						mainText={mainText}
						description={description}
						footerText={footerText}
					/>
				);
		}

		return new ImageResponse(ogImageContent, {
			width: 1200,
			height: 630,
			fonts: Array.isArray(font) ? [...font] : [font],
			emoji: 'twemoji',
		});
	} catch (error: any) {
		console.error('OG Image generation error:', error);
		return await renderErrorImage(`Failed to generate image: ${error.message}`, c);
	}
}