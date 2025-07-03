/**
 * Parse text with line breaks and return JSX elements
 * Supports both \n and <br> tags by creating a flex column layout for multi-line text
 * @param text - The text to parse, may contain \n or <br> tags
 * @returns JSX element with proper line breaks rendered as block elements
 */
export function parseTextWithBreaks(text: string): JSX.Element {
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