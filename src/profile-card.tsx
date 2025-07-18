import { parseTextWithBreaks } from './utils/text';

export interface OGImageProps {
	title: string;
	subtitle: string;
	description: string;
	imageUrl: string;
	fontFamily?: string;
}

// Modern gradient combinations for backgrounds
const backgroundGradients = [
	// Soft pastel gradients
	'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
	'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
	'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
	'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
	'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
	'linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)',
	'linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)',
	'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
];

// Text gradient combinations - using the original working format
const textGradients = [
	'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
	'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
	'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
	'linear-gradient(90deg, #667eea, #764ba2)',
	'linear-gradient(90deg, #f093fb, #f5576c)',
	'linear-gradient(90deg, #4facfe, #00f2fe)',
	'linear-gradient(90deg, #43e97b, #38f9d7)',
	'linear-gradient(90deg, #fa709a, #fee140)',
];

// Function to get random gradients
function getRandomGradients() {
	const bgGradient = backgroundGradients[Math.floor(Math.random() * backgroundGradients.length)];
	const textGradient = textGradients[Math.floor(Math.random() * textGradients.length)];
	return { bgGradient, textGradient };
}

export interface OptimalFontSizeConfig {
	minSize?: number;
	maxSize?: number;
	charWidthRatio?: number;
	scalingExponent?: number;
}

// Function to calculate optimal font size based on text length and container width
function calculateOptimalFontSize(
	text: string,
	maxWidth: number,
	fontFamily: string,
	config: OptimalFontSizeConfig = {}
): number {
	const { minSize = 64, maxSize = 105, charWidthRatio: configCharWidthRatio, scalingExponent = 1.015 } = config;

	// Character width ratios for different fonts
	// These are rough estimates for bold fonts based on their typical character widths
	const fontWidthRatios: { [key: string]: number } = {
		Fraunces: 0.52, // Adjusted for wider characters in this font
		default: 0.48, // Slightly increased for better default sizing
	};

	// Extract the primary font name from the fontFamily string
	const primaryFont = fontFamily.split(',')[0].trim().replace(/['"]/g, '');

	// Get the appropriate ratio for this font
	const charWidthRatio = configCharWidthRatio || fontWidthRatios[primaryFont] || fontWidthRatios['default'];

	// Non-linear scaling: Apply a power to the text length to account for character width variations.
	// An exponent of 1.015 gives a gentle scaling that prevents large jumps between similar-length names.
	const effectiveLength = Math.pow(text.length, scalingExponent);

	// Calculate the font size that would fit the text in the available width
	const calculatedSize = maxWidth / (effectiveLength * charWidthRatio);

	// Clamp between min and max sizes
	const finalSize = Math.floor(Math.min(maxSize, Math.max(minSize, calculatedSize)));

	// Debug logging - enhanced for charWidthRatio debugging
	console.log(`=== FONT SIZE CALCULATION FOR "${text}" ===`);
	console.log('Input config:', config);
	console.log('Font family:', fontFamily);
	console.log('Primary font extracted:', primaryFont);
	console.log('Config charWidthRatio:', configCharWidthRatio);
	console.log('Font width ratios available:', fontWidthRatios);
	console.log('Final charWidthRatio used:', charWidthRatio);
	console.log('Source of charWidthRatio:', configCharWidthRatio ? 'CONFIG' : (fontWidthRatios[primaryFont] ? 'FONT_SPECIFIC' : 'DEFAULT'));
	console.log('Calculation details:', {
		textLength: text.length,
		maxWidth: maxWidth,
		charWidthRatio: charWidthRatio,
		scalingExponent: scalingExponent,
		effectiveLength: effectiveLength,
		calculatedSize: calculatedSize,
		finalSize: finalSize,
		clampedTo: finalSize === minSize ? 'MIN' : finalSize === maxSize ? 'MAX' : 'CALCULATED',
	});

	return finalSize;
}

export function OGImageComponent({
	title,
	subtitle,
	description,
	imageUrl,
	fontFamily = 'Inter, -apple-system, sans-serif',
	fontSizeConfig,
}: OGImageProps & { fontSizeConfig?: OptimalFontSizeConfig }) {
	const { bgGradient, textGradient } = getRandomGradients();

	// Check if title contains line breaks (for nowrap styling decision)
	const titleHasLineBreaks = title.includes('\n') || /<br\s*\/?>/i.test(title);

	// Calculate optimal font size for title (accounting for padding)
	// More accurate calculation: total width (1200) - outer padding (96) - left section (420) - content padding (128)
	const titleMaxWidth = 550; // More accurate available width
	
	// Development logging for component-level debugging
	if (process.env.NODE_ENV === 'development') {
		console.log('=== OG IMAGE COMPONENT RENDER ===');
		console.log('Title:', title);
		console.log('FontFamily:', fontFamily);
		console.log('FontSizeConfig received:', fontSizeConfig);
		console.log('About to calculate font size with titleMaxWidth:', titleMaxWidth);
	}
	
	const titleFontSize = calculateOptimalFontSize(title, titleMaxWidth, fontFamily, fontSizeConfig);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '48px',
				background: bgGradient,
				fontFamily: fontFamily,
				width: '1200px',
				height: '630px',
			}}
		>
			{/* Main card container */}
			<div
				style={{
					display: 'flex',
					borderRadius: '24px',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
				}}
			>
				{/* Left side - Image */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '420px',
						background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), ${bgGradient}`,
						padding: '16px',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							height: '100%',
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={imageUrl}
							alt=""
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
								objectFit: 'contain', // Preserve aspect ratio
							}}
						/>
					</div>
				</div>

				{/* Right side - Content */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'flex-start',
						paddingLeft: '64px',
						paddingRight: '64px',
						flex: 1,
						backgroundColor: '#fafafa',
					}}
				>
					{/* Title with gradient - supports line breaks via \n or <br> tags */}
					<h1
						style={{
							fontSize: `${titleFontSize}px`,
							fontWeight: 'bold',
							letterSpacing: '-2px',
							lineHeight: '1.25',
							marginBottom: '12px',
							backgroundImage: textGradient,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							color: 'transparent',
							WebkitTextFillColor: 'transparent',
							// Only prevent wrapping for single-line titles to maintain design
							whiteSpace: titleHasLineBreaks ? 'normal' : 'nowrap',
						}}
					>
						{parseTextWithBreaks(title)}
					</h1>

					{/* Subtitle - supports line breaks via \n or <br> tags */}
					<h2
						style={{
							fontSize: '42px',
							fontWeight: '600', // Falls back to bold (700) or normal (400) if 600 isn't available
							letterSpacing: '-0.5px',
							color: '#374151',
							marginBottom: description ? '16px' : '0px',
							lineHeight: '1.3',
						}}
					>
						{parseTextWithBreaks(subtitle)}
					</h2>

					{/* Separator line - only show if description exists */}
					{description && (
						<div
							style={{
								display: 'flex',
								width: '80px',
								height: '4px',
								background: textGradient,
								borderRadius: '2px',
								marginBottom: '28px',
							}}
						/>
					)}

					{/* Description - supports line breaks via \n or <br> tags */}
					{description && (
						<p
							style={{
								fontSize: '28px',
								fontWeight: '500', // Falls back to normal (400) or bold (700) if 500 isn't available
								color: '#6B7280',
								lineHeight: '1.4',
								maxWidth: '500px',
							}}
						>
							{parseTextWithBreaks(description.length > 100 ? description.substring(0, 100) + '...' : description)}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export const ogImageOptions = {
	width: 1200,
	height: 630,
};
