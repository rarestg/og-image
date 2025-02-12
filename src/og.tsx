import { Hono } from 'hono';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import { getLocalFonts } from './getFonts';
import { loadImage } from './loadImage';

const app = new Hono();

interface UserData {
	data?: {
		id: string;
	};
}

interface Challenge {
	challenge_id: string;
	current_step_count: number;
}

interface ChallengeData {
	data?: Challenge[];
}

async function fetchAllocation(handle: string): Promise<number | null> {
	if (!handle) return null;

	const baseUrl = 'https://discoveryprovider.audius.co';

	try {
		const userResponse = await fetch(`${baseUrl}/v1/users/handle/${handle}`);
		const userData: UserData = await userResponse.json();

		if (!userData?.data?.id) return null;

		const challengesResponse = await fetch(`${baseUrl}/v1/users/${userData.data.id}/challenges`);
		const challengeData: ChallengeData = await challengesResponse.json();

		const totalAllocation = challengeData?.data?.find((c) => c.challenge_id === 'o')?.current_step_count ?? 0;

		return totalAllocation;
	} catch (error) {
		console.error('Error fetching user data:', error);
		return null;
	}
}

export default app.on('GET', ['/airdrop/', '/airdrop/:handle?'], async (c) => {
	try {
		const handle = c.req.param('handle');
		const totalAllocation = handle ? await fetchAllocation(handle) : null;

		const firstLine = handle ? `@${handle}` : 'February 2025';
		const secondLine = totalAllocation !== null ? `${Number(totalAllocation).toLocaleString()} $AUDIO` : 'Airdrop';

		const font = await getLocalFonts(c, [
			{ path: 'Inter-Bold.ttf', weight: 700 },
		]);

		async function renderOGImage() {
			const backgroundImage = await loadImage(c, '/images/airdrop.png');

			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
					}}
				>
					<img
						src={backgroundImage || ''}
						alt="Background"
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<div
						style={{
							position: 'relative',
							padding: '48px',
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
						}}
					>
						<div style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'center',
								flex: 1,
								paddingLeft: '300px',
							}}
						>
							<div tw="text-7xl font-bold text-white text-left mb-4">{firstLine}</div>
							<div tw="text-7xl font-bold text-white text-left">{secondLine}</div>
						</div>
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
});
