import type { Context } from 'hono';

// Define font weights and styles (matching types from getFonts.ts)
type Style = 'normal' | 'italic';
type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type FontConfig = {
	path: string;
	weight: Weight;
	style?: Style;
};

/**
 * Fetches fonts from GitHub repository
 * Used for accessing fonts stored in Google Fonts' GitHub repository
 * Currently configured for Inria Sans Regular and Bold variants
 * Returns an array of font objects with data, name, style and weight
 */
export const githubFonts = async () => {
	const base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/inriasans/';

	// Define font files to fetch with their properties
	const list = [
		['InriaSans-Regular.ttf', 'Inria Sans', 500, 'normal' as Style] as const,
		['InriaSans-Bold.ttf', 'Inria Sans', 700, 'normal' as Style] as const,
	];

	// Map each font definition to a fetch promise with caching
	const fonts = list.map(async ([file, name, weight, style]) => {
		const url = `${base}${file}`;
		const cache = caches.default;
		const cacheKey = url;
		const res = await cache.match(cacheKey);
		if (res) {
			const data = await res.arrayBuffer();
			return { data, name, style, weight };
		} else {
			const res = await fetch(url);
			const data = await res.arrayBuffer();
			await cache.put(cacheKey, new Response(data, { status: 200 }));
			return { data, name, style, weight };
		}
	});

	return Promise.all(fonts);
};

/**
 * Fetches a font from Google Fonts API with specific text, weight, and style
 *
 * This function:
 * 1. Constructs a Google Fonts API URL with the specified parameters
 * 2. Fetches the CSS containing the font URL
 * 3. Extracts and fetches the actual font file
 * 4. Returns the font data in a format compatible with Vercel OG Image
 *
 * @param text - The text to be rendered (affects font subset optimization)
 * @param font - The name of the font family (e.g., "Roboto", "Open Sans")
 * @param weight - Font weight (100-900), defaults to 400
 * @param style - Font style ('normal' or 'italic'), defaults to 'normal'
 * @returns Promise containing font data, name, style, and weight
 */
export async function googleFont(
	text: string,
	font: string,
	weight: Weight = 400,
	style: Style = 'normal'
): Promise<{ data: ArrayBuffer; name: string; style: Style; weight: Weight }> {
	const fontFamilyFetchName = font.replace(/ /g, '+');
	const API = `https://fonts.googleapis.com/css2?family=${fontFamilyFetchName}:ital,wght@${
		style === 'italic' ? '1' : '0'
	},${weight}&text=${encodeURIComponent(text)}`;

	const css = await (
		await fetch(API, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
			},
		})
	).text();
	console.log(API, css);
	const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
	console.log('resource', resource);
	if (!resource) {
		throw new Error('Failed to fetch font');
	}

	const res = await fetch(resource[1]);
	const data = await res.arrayBuffer();

	return {
		data,
		name: font,
		style,
		weight: weight as Weight,
	};
}

// -------------------------------- Direct Access Font -------------------------------- //

/**
 * Fetches a font directly from a URL
 * @param url - Direct URL to the font file
 * @param name - Font family name
 * @param weight - Font weight (100-900)
 * @param style - Font style ('normal' or 'italic')
 */
export const directFont = async (
	url: string,
	name: string,
	weight: Weight = 400,
	style: Style = 'normal'
): Promise<{ data: ArrayBuffer; name: string; style: Style; weight: Weight }> => {
	try {
		const cache = caches.default;
		const cacheKey = url;

		// console.log(`[Font] Attempting to fetch: ${name} from ${url}`);

		const cachedRes = await cache.match(cacheKey);
		if (cachedRes) {
			// console.log(`[Font] Cache HIT: ${name}`);
			const data = await cachedRes.arrayBuffer();
			return { data, name, style, weight };
		}

		// console.log(`[Font] Cache MISS: ${name}`);
		const res = await fetch(new URL(url));
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.arrayBuffer();
		await cache.put(cacheKey, new Response(data, { status: 200 }));
		// console.log(`[Font] Cached new font: ${name}`);

		return { data, name, style, weight };
	} catch (error) {
		// console.error(`[Font] Error loading ${name}:`, error);
		throw error;
	}
};

// -------------------------------- Local Font -------------------------------- //

/**
 * Loads multiple local font files and returns font data with metadata
 * @param c - Hono context for getting domain URL
 * @param fonts - Array of font configurations
 */
export const getLocalFonts = async (
	c: Context,
	fonts: FontConfig[]
): Promise<Array<{ data: ArrayBuffer; name: string; style: Style; weight: Weight }>> => {
	try {
		const fontPromises = fonts.map(async ({ path, weight, style = 'normal' }) => {
			// Use a consistent font family name for all weights
			const name = 'font-family'; // any name will do as long as it's consistent

			const url = new URL(c.req.url);
			const fontUrl = `${url.origin}/fonts/${path}`;

			const res = await fetch(fontUrl);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const data = await res.arrayBuffer();

			return {
				data,
				name, // All variants will have the same font-family name
				style,
				weight,
			};
		});

		return Promise.all(fontPromises);
	} catch (error: unknown) {
		throw new Error(`Failed to load fonts: ${error instanceof Error ? error.message : String(error)}`);
	}
};

// Keep the original getLocalFont for backward compatibility
export const getLocalFont = async (c: Context, fontPath: string, weight: Weight = 400, style: Style = 'normal') => {
	const fonts = await getLocalFonts(c, [{ path: fontPath, weight, style }]);
	return fonts[0];
};
