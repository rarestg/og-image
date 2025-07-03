import { Hono } from 'hono';
import { ImageResponse } from 'workers-og';
import { getLocalFonts, googleFont } from './getFonts';
import { loadImage } from './loadImage';
import { OGImageComponent } from './profile-card';
import { generateDocumentationHTML } from './documentation';

const app = new Hono();

/**
 * Clean Unicode variation selectors and other invisible characters from text
 * This prevents emoji variation selectors (like U+FE0F) from rendering as visible glyphs
 */
function cleanUnicodeText(text: string): string {
	return text
		.normalize('NFC') // Normalize the Unicode
		.replace(/[\uFE0F\uFE0E]/g, '') // Remove variation selectors
		.replace(/[\u200D\u200C]/g, ''); // Remove zero-width joiners
}

export default app
	.on('GET', '/', async (c) => {
		const html = generateDocumentationHTML();
		return c.html(html);
	})
	.on('GET', '/og', async (c) => {
		try {
			const mainText = cleanUnicodeText(c.req.query('mainText') || 'Default Title');
			const description = cleanUnicodeText(c.req.query('description') || 'Default Description');
			const footerText = cleanUnicodeText(c.req.query('footerText') || 'Footer Text');
			const style = c.req.query('style') || '1';

			const font = await getLocalFonts(c, [{ path: 'Inter-Bold.ttf', weight: 700 }]);

			async function renderOGImage() {
				// Style 1: Modern gradient with glass effect (Blue theme)
				if (style === '1') {
					return (
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								padding: '48px',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									flex: 1,
									justifyContent: 'center',
									background: 'rgba(255, 255, 255, 0.1)',
									borderRadius: '24px',
									padding: '48px',
									backdropFilter: 'blur(10px)',
									border: '1px solid rgba(255, 255, 255, 0.2)',
								}}
							>
								<h1 tw="text-9xl font-bold text-white mb-6">{mainText}</h1>
								<p tw="text-6xl text-white/90 mb-8">{description}</p>
								<p tw="text-4xl text-white/70">{footerText}</p>
							</div>
						</div>
					);
				}

				// Style 2: Eco/Green technology theme
				if (style === '2') {
					return (
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
								padding: '48px',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
								}}
							>
								<h1 tw="text-9xl font-bold text-gray-900 mb-8">{mainText}</h1>
								<p tw="text-7xl text-gray-800 mb-8 max-w-4xl">{description}</p>
								<p tw="text-5xl text-gray-700">{footerText}</p>
							</div>
						</div>
					);
				}

				// Style 3: Cloudflare-inspired design
				if (style === '3') {
					const logoImage = await loadImage(c, '/images/cf-logo-v-rgb.png');
					return (
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								background: '#f38020',
								padding: '48px',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									flex: 1,
									justifyContent: 'space-between',
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
									{logoImage && (
										<img
											src={logoImage}
											alt="Logo"
											style={{
												width: '300px',
												maxHeight: '300px',
												objectFit: 'contain',
											}}
										/>
									)}
								</div>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<h1 tw="text-9xl font-bold text-white mb-6">{mainText}</h1>
									<p tw="text-6xl text-white/90 mb-8">{description}</p>
									<p tw="text-4xl text-white/80">{footerText}</p>
								</div>
							</div>
						</div>
					);
				}

				// Style 4: GitHub profile card style (default)
				return (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							background: '#0d1117',
							padding: '48px',
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								flex: 1,
								justifyContent: 'center',
								border: '1px solid #30363d',
								borderRadius: '16px',
								padding: '48px',
								background: '#161b22',
							}}
						>
							<h1 tw="text-9xl font-bold text-white mb-6">{mainText}</h1>
							<p tw="text-6xl text-gray-300 mb-8">{description}</p>
							<p tw="text-4xl text-gray-400">{footerText}</p>
						</div>
					</div>
				);
			}

			return new ImageResponse(await renderOGImage(), {
				width: 1200,
				height: 630,
				fonts: Array.isArray(font) ? [...font] : [font],
			});
		} catch (error: any) {
			console.error('OG Image generation error:', error);
			return c.json({ error: 'Failed to generate image', details: error.message }, 500);
		}
	})
	.on('GET', ['/profile/', '/profile/:handle?'], async (c) => {
		try {
			const handle = c.req.param('handle');
			const title = cleanUnicodeText(c.req.query('title') || handle || 'John Doe');
			const subtitle = cleanUnicodeText(c.req.query('subtitle') || 'Software Engineer');
			const description = cleanUnicodeText(c.req.query('description') || '');
			const imageUrl = c.req.query('imageUrl') || c.req.query('image') || '';
			const fontParam = c.req.query('font') || 'inter';

			if (!imageUrl) {
				return c.json({ error: 'imageUrl parameter is required' }, 400);
			}

			// Only accept external images (URLs starting with http/https)
			if (!imageUrl.startsWith('http')) {
				return c.json({ error: 'Only external image URLs are supported (must start with http/https)' }, 400);
			}

			// Load the appropriate font based on the parameter
			let fontConfig;
			let fontFamily;
			let font;

			if (fontParam === 'avenir') {
				fontConfig = [{ path: 'AvenirNextLTPro-Bold.ttf', weight: 700 as const }];
				fontFamily = 'AvenirNextLTPro-Bold, -apple-system, sans-serif';
				font = await getLocalFonts(c, fontConfig);
			} else if (fontParam === 'geist') {
				fontFamily = 'Geist, sans-serif';
				// Load from Google Fonts - include all text that will be rendered
				const allText = `${title} ${subtitle} ${description}`;
				// Load multiple weights since component uses 700 (title), 600 (subtitle), 500 (description)
				const fonts = await Promise.all([
					googleFont(allText, 'Geist', 700, 'normal'),
					googleFont(allText, 'Geist', 600, 'normal'),
					googleFont(allText, 'Geist', 500, 'normal'),
				]);
				font = fonts.flat();
			} else if (fontParam === 'fraunces') {
				fontFamily = 'Fraunces, serif';
				// Load from Google Fonts - include all text that will be rendered
				const allText = `${title} ${subtitle} ${description}`;
				// Load multiple weights since component uses 700 (title), 600 (subtitle), 500 (description)
				const fonts = await Promise.all([
					googleFont(allText, 'Fraunces', 700, 'normal'),
					googleFont(allText, 'Fraunces', 600, 'normal'),
					googleFont(allText, 'Fraunces', 500, 'normal'),
				]);
				font = fonts.flat();
			} else {
				fontConfig = [{ path: 'Inter-Bold.ttf', weight: 700 as const }];
				fontFamily = 'Inter, -apple-system, sans-serif';
				font = await getLocalFonts(c, fontConfig);
			}

			const ogImageJsx = (
				<OGImageComponent
					title={title}
					subtitle={subtitle}
					description={description}
					imageUrl={imageUrl}
					fontFamily={fontFamily}
				/>
			);

			const response = new ImageResponse(ogImageJsx, {
				width: 1200,
				height: 630,
				fonts: Array.isArray(font) ? [...font] : [font],
			});

			return response;
		} catch (error: any) {
			console.error('Profile card generation error:', error);
			return c.json({ error: 'Failed to generate profile card', details: error.message }, 500);
		}
	});
