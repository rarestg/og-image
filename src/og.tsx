import { Hono } from 'hono';
import { ImageResponse } from 'workers-og';
import { getLocalFonts, googleFont } from './getFonts';
import { loadImage } from './loadImage';
import { OGImageComponent } from './profile-card';
import { generateDocumentationHTML } from './documentation';

const app = new Hono();

/**
 * Render an error message as an image using the eco/green theme
 * @param errorMessage - The error message to display
 * @param context - The Hono context for loading fonts
 * @returns ImageResponse with the error message rendered
 */
async function renderErrorImage(errorMessage: string, context: any): Promise<ImageResponse> {
	try {
		// Load font for error display
		const font = await getLocalFonts(context, [{ path: 'Inter-Bold.ttf', weight: 700 }]);

		// Truncate very long error messages to fit better
		const displayMessage = errorMessage.length > 500 ? errorMessage.substring(0, 500) + '...' : errorMessage;

		const errorImageJsx = (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
						background: 'rgba(255, 255, 255, 0.95)',
						borderRadius: '24px',
						padding: '48px',
						border: '4px solid #dc2626',
					}}
				>
					<h1
						style={{
							fontSize: '72px',
							fontWeight: 'bold',
							color: '#dc2626',
							marginBottom: '32px',
							textAlign: 'center',
						}}
					>
						⚠️ Error
					</h1>
					<p
						style={{
							fontSize: '32px',
							color: '#374151',
							lineHeight: '1.4',
							maxWidth: '1000px',
							textAlign: 'center',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
						}}
					>
						{parseTextWithBreaks(displayMessage)}
					</p>
					<p
						style={{
							fontSize: '24px',
							color: '#6B7280',
							marginTop: '32px',
							textAlign: 'center',
						}}
					>
						Check your parameters and try again
					</p>
				</div>
			</div>
		);

		return new ImageResponse(errorImageJsx, {
			width: 1200,
			height: 630,
			fonts: Array.isArray(font) ? [...font] : [font],
			emoji: 'twemoji',
		});
	} catch (fallbackError: any) {
		// If even the error image fails to render, return a basic error response
		console.error('Failed to render error image:', fallbackError);
		throw new Error(`Original error: ${errorMessage}. Error rendering failed: ${fallbackError.message}`);
	}
}

/**
 * Parse text with line breaks and return JSX elements
 * Supports both \n and <br> tags by creating a flex column layout for multi-line text
 * @param text - The text to parse, may contain \n or <br> tags
 * @returns JSX element with proper line breaks rendered as block elements
 */
function parseTextWithBreaks(text: string): JSX.Element {
	// Handle empty or whitespace-only text
	if (!text || !text.trim()) {
		return <>{text}</>;
	}

	// First replace <br> tags with \n to normalize
	const normalized = text.replace(/<br\s*\/?>/gi, '\n');

	// Split by \n and create JSX elements
	const lines = normalized.split('\n');

	// If no line breaks, return simple text
	if (lines.length === 1) {
		return <>{lines[0]}</>;
	}

	// For multiple lines, create a flex column layout
	// This approach works better than CSS whiteSpace in workers-og environment
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{lines.map((line, index) => (
				<span
					key={index}
					style={{ display: 'block' }}
				>
					{line.trim()}
				</span>
			))}
		</div>
	);
}

export default app
	.on('GET', '/', async (c) => {
		const html = generateDocumentationHTML();
		return c.html(html);
	})
	.on('GET', '/og', async (c) => {
		try {
			const mainText = c.req.query('mainText') || 'Default Title';
			const description = c.req.query('description') || 'Default Description';
			const footerText = c.req.query('footerText') || 'Footer Text';
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
								{/* All text elements support line breaks via \n or <br> tags */}
								<h1 tw="text-9xl font-bold text-white mb-6">{parseTextWithBreaks(mainText)}</h1>
								<p tw="text-6xl text-white/90 mb-8">{parseTextWithBreaks(description)}</p>
								<p tw="text-4xl text-white/70">{parseTextWithBreaks(footerText)}</p>
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
								{/* All text elements support line breaks via \n or <br> tags */}
								<h1 tw="text-9xl font-bold text-gray-900 mb-8">{parseTextWithBreaks(mainText)}</h1>
								<p tw="text-7xl text-gray-800 mb-8 max-w-4xl">{parseTextWithBreaks(description)}</p>
								<p tw="text-5xl text-gray-700">{parseTextWithBreaks(footerText)}</p>
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
									{/* All text elements support line breaks via \n or <br> tags */}
									<h1 tw="text-9xl font-bold text-white mb-6">{parseTextWithBreaks(mainText)}</h1>
									<p tw="text-6xl text-white/90 mb-8">{parseTextWithBreaks(description)}</p>
									<p tw="text-4xl text-white/80">{parseTextWithBreaks(footerText)}</p>
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
							{/* All text elements support line breaks via \n or <br> tags */}
							<h1 tw="text-9xl font-bold text-white mb-6">{parseTextWithBreaks(mainText)}</h1>
							<p tw="text-6xl text-gray-300 mb-8">{parseTextWithBreaks(description)}</p>
							<p tw="text-4xl text-gray-400">{parseTextWithBreaks(footerText)}</p>
						</div>
					</div>
				);
			}

			return new ImageResponse(await renderOGImage(), {
				width: 1200,
				height: 630,
				fonts: Array.isArray(font) ? [...font] : [font],
				emoji: 'twemoji',
			});
		} catch (error: any) {
			console.error('OG Image generation error:', error);
			return await renderErrorImage(`Failed to generate image: ${error.message}`, c);
		}
	})
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
			const imageFetchResponse = await fetch(imageUrl);
			if (!imageFetchResponse.ok) {
				throw new Error(`Failed to fetch image. Status: ${imageFetchResponse.status} ${imageFetchResponse.statusText}`);
			}

			const imageBuffer = await imageFetchResponse.arrayBuffer();
			const imageType = imageFetchResponse.headers.get('content-type');

			if (!imageType || !imageType.startsWith('image/')) {
				throw new Error(`Invalid content-type. URL did not return an image: ${imageType || 'unknown'}`);
			}

			const base64 = btoa(new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
			const imageDataUri = `data:${imageType};base64,${base64}`;

			// Load the appropriate font based on the parameter
			let fontFamily;
			let font;

			if (fontParam.toLowerCase() === 'inter') {
				fontFamily = 'Inter, -apple-system, sans-serif';
				font = await getLocalFonts(c, [{ path: 'Inter-Bold.ttf', weight: 700 as const }]);
			} else {
				try {
					// Use Google Fonts for any other font name
					const fallback = fontFallback.toLowerCase() === 'serif' ? 'serif' : 'sans-serif';
					fontFamily = `'${fontParam}', ${fallback}`;
					const allText = `${title} ${subtitle} ${description}`;

					// Try to load the required font weights: 700 (bold), 600 (semi-bold), 500 (medium)
					const requiredWeights = [700, 600, 500] as const;
					const fontPromises = requiredWeights.map(async (weight) => {
						try {
							return await googleFont(allText, fontParam, weight, 'normal');
						} catch (error) {
							// Return null for weights that fail to load
							console.warn(`Failed to load weight ${weight} for font '${fontParam}':`, error);
							return null;
						}
					});

					const fontResults = await Promise.all(fontPromises);
					const successfulFonts = fontResults.filter((font): font is NonNullable<typeof font> => font !== null);

					if (successfulFonts.length === 0) {
						return await renderErrorImage(
							`Font '${fontParam}' could not be loaded from Google Fonts. Please ensure it's a valid Google Font name.`,
							c
						);
					}

					// Check if we have the minimum required weights
					const loadedWeights = successfulFonts.map((font) => font.weight);
					const hasMinimumWeights = loadedWeights.includes(700); // At least need bold for title

					if (!hasMinimumWeights) {
						return await renderErrorImage(
							`Font '${fontParam}' doesn't support the required font weights. This component needs at least weight 700 (bold) for proper visual hierarchy. Available weights for ${fontParam}: check Google Fonts documentation.`,
							c
						);
					}

					// If we're missing some weights, inform but continue
					const missingWeights = requiredWeights.filter((weight) => !loadedWeights.includes(weight));
					if (missingWeights.length > 0) {
						console.warn(
							`Font '${fontParam}' is missing weights: ${missingWeights.join(
								', '
							)}. The component will use available weights and may fall back to browser defaults for missing weights.`
						);
					}

					font = successfulFonts;
				} catch (e: any) {
					console.error(`Failed to load Google Font '${fontParam}':`, e);
					return await renderErrorImage(`Failed to load font '${fontParam}'. Ensure it's a valid Google Font name.`, c);
				}
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
