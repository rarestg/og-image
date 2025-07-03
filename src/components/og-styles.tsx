import { parseTextWithBreaks } from '../utils/text';

interface OGStyleProps {
	mainText: string;
	description: string;
	footerText: string;
	logoImage?: string;
}

/**
 * Style 1: Modern gradient with glass effect (Blue theme)
 */
export function ModernGradientStyle({ mainText, description, footerText }: OGStyleProps) {
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

/**
 * Style 2: Eco/Green technology theme
 */
export function EcoGreenStyle({ mainText, description, footerText }: OGStyleProps) {
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

/**
 * Style 3: Cloudflare-inspired design
 */
export function CloudflareStyle({ mainText, description, footerText, logoImage }: OGStyleProps) {
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

/**
 * Style 4: GitHub profile card style (default)
 */
export function GitHubStyle({ mainText, description, footerText }: OGStyleProps) {
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