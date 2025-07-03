import { getLocalFonts, googleFont } from '../getFonts';

export interface FontLoadResult {
	font: any;
	fontFamily: string;
}

/**
 * Load fonts for profile card generation
 * @param context - Hono context
 * @param fontParam - Font parameter (either 'inter' or a Google Font name)
 * @param fontFallback - Fallback font family ('serif' or 'sans-serif')
 * @param textContent - Text content to load fonts for
 * @returns Font configuration and font family string
 */
export async function loadProfileFont(
	context: any,
	fontParam: string,
	fontFallback: string,
	textContent: string
): Promise<FontLoadResult> {
	let fontFamily: string;
	let font: any;

	if (fontParam.toLowerCase() === 'inter') {
		fontFamily = 'Inter, -apple-system, sans-serif';
		font = await getLocalFonts(context, [{ path: 'Inter-Bold.ttf', weight: 700 as const }]);
	} else {
		// Use Google Fonts for any other font name
		const fallback = fontFallback.toLowerCase() === 'serif' ? 'serif' : 'sans-serif';
		fontFamily = `'${fontParam}', ${fallback}`;

		// Try to load the required font weights: 700 (bold), 600 (semi-bold), 500 (medium)
		const requiredWeights = [700, 600, 500] as const;
		const fontPromises = requiredWeights.map(async (weight) => {
			try {
				return await googleFont(textContent, fontParam, weight, 'normal');
			} catch (error) {
				// Return null for weights that fail to load
				console.warn(`Failed to load weight ${weight} for font '${fontParam}':`, error);
				return null;
			}
		});

		const fontResults = await Promise.all(fontPromises);
		const successfulFonts = fontResults.filter((font): font is NonNullable<typeof font> => font !== null);

		if (successfulFonts.length === 0) {
			throw new Error(
				`Font '${fontParam}' could not be loaded from Google Fonts. Please ensure it's a valid Google Font name.`
			);
		}

		// Check if we have the minimum required weights
		const loadedWeights = successfulFonts.map((font) => font.weight);
		const hasMinimumWeights = loadedWeights.includes(700); // At least need bold for title

		if (!hasMinimumWeights) {
			throw new Error(
				`Font '${fontParam}' doesn't support the required font weights. This component needs at least weight 700 (bold) for proper visual hierarchy. Available weights for ${fontParam}: check Google Fonts documentation.`
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
	}

	return { font, fontFamily };
}

/**
 * Load fonts for basic OG image generation
 * @param context - Hono context
 * @returns Font configuration
 */
export async function loadBasicFont(context: any): Promise<any> {
	return await getLocalFonts(context, [{ path: 'Inter-Bold.ttf', weight: 700 }]);
}