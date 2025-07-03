import { ImageResponse } from 'workers-og';
import { getLocalFonts } from '../getFonts';
import { parseTextWithBreaks } from '../utils/text';

/**
 * Render an error message as an image using the eco/green theme
 * @param errorMessage - The error message to display
 * @param context - The Hono context for loading fonts
 * @returns ImageResponse with the error message rendered
 */
export async function renderErrorImage(errorMessage: string, context: any): Promise<ImageResponse> {
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