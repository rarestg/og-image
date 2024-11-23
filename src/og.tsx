import { Hono, Context } from 'hono';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import { githubFonts, googleFont, directFont, getLocalFont, getLocalFonts } from './getFonts';
import { loadImage } from './loadImage';

const app = new Hono();

export default app.get('/', async (c) => {
	try {
		const { mainText, description, footerText } = c.req.query();

		// Add input validation
		if (!mainText || !description || !footerText) {
			throw new Error('Missing required query parameters');
		}

		const SocialCardTemplate = await (async () => {
			const style = c.req.query('style');
			console.log('Selected style:', style);

			switch (style) {
				case '2':
					return Style2();
				case '3':
					return await Style3();
				case '4':
					return Style4();
				default:
					return Style1();
			}
		})();

		// ---------------------------------------- //
		// Font Configuration

		// ********************** Google Fonts ********************** //
		// const font = await googleFont(
		// 	`${mainText ?? ''}${description ?? ''}${footerText ?? ''}`,
		// 	'Noto Sans JP',
		// 	900,
		// 	'normal'
		// );

		// ********************** Github Fonts ********************** //
		// const font = await githubFonts();

		// ********************** Direct Font ********************** //
		// const font = await directFont(
		// 	'https://github.com/Synesthesias/PLATEAU-SDK-for-Unity-GameSample/raw/refs/heads/main/Assets/Font/DotGothic16-Regular.ttf',
		// 	'DotGothic16',
		// 	400,
		// 	'normal'
		// );

		// ********************** Local Font ********************** //
		// const font = await getLocalFont(c, 'Poppins-Regular.ttf', 400, 'normal');

		// ********************** Local Fonts ********************** //
		const font = await getLocalFonts(c, [
			{ path: 'Poppins-Regular.ttf', weight: 400 },
			{ path: 'Poppins-Medium.ttf', weight: 500 },
			{ path: 'Poppins-SemiBold.ttf', weight: 600 },
			{ path: 'Poppins-Bold.ttf', weight: 700 },
			{ path: 'Poppins-Black.ttf', weight: 900 },
		]);

		// END Font Configuration

		// console.log(font);
		// -----------------------------------------

		function Style1() {
			//http://127.0.0.1:8787/og?mainText=Building%20the%20Future%20of%20Web%20Development&description=Explore%20modern%20frameworks,%20serverless%20architecture,%20and%20cutting-edge%20tools%20that%20power%20the%20next%20generationof%20web%20applications&footerText=%F0%9F%9A%80%20Powered%20by%20Next.js%20%E2%80%A2%20TypeScript%20%E2%80%A2%20Tailwind%20CSS&style=1
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						padding: '48px',
						backgroundImage: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(67, 56, 202) 100%)',
					}}
				>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							padding: '48px',
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							borderRadius: '24px',
							border: '1px solid rgba(255, 255, 255, 0.2)',
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
							<div tw="text-6xl font-black text-white text-center">{mainText}</div>
							<div
								style={{ marginTop: '24px' }}
								tw="text-2xl text-blue-100 text-center max-w-4xl"
							>
								{description}
							</div>
						</div>
						<div
							style={{
								marginTop: 'auto',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderTop: '1px solid rgba(255, 255, 255, 0.2)',
								paddingTop: '32px',
							}}
							tw="text-xl text-blue-200"
						>
							{footerText}
						</div>
					</div>
				</div>
			);
		}

		function Style2() {
			//http://127.0.0.1:8787/og?mainText=Green%20Technology%20Summit%202024&description=Join%20industry%20leaders%20in%20sustainable%20tech%20for%20three%20days%20of%20innovation,%20collaboration,%20and%20impact&footerText=%F0%9F%8C%B1%20December%2015-17%20%E2%80%A2%20Virtual%20and%20In-Person%20%E2%80%A2%20Register%20Now&style=2
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						padding: '48px',
						backgroundImage: 'linear-gradient(90deg, rgb(6, 95, 70) 0%, rgb(13, 148, 136) 50%, rgb(6, 95, 70) 100%)',
					}}
				>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							padding: '48px',
							backgroundColor: 'rgba(0, 0, 0, 0.2)',
							borderRadius: '24px',
							border: '1px solid rgba(52, 211, 153, 0.3)',
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
							<div
								style={{
									background: 'linear-gradient(90deg, rgba(167, 243, 208, 0.5) 0%, rgba(204, 251, 241, 0.5) 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
								tw="text-7xl font-black text-center p-4"
							>
								{mainText}
							</div>
						</div>
						<div
							style={{
								marginTop: '32px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<div tw="text-2xl text-emerald-100 text-center">{description}</div>
							<div
								style={{
									marginTop: 'auto',
									borderTop: '1px solid rgba(52, 211, 153, 0.3)',
									paddingTop: '32px',
								}}
								tw="font-medium text-xl text-emerald-200"
							>
								{footerText}
							</div>
						</div>
					</div>
				</div>
			);
		}
		//http://127.0.0.1:8787/og?mainText=A%20Seamless%20Approach%20Using%20Cloudflare%20Hono,%20Vercel%20OG,%20and%20Tailwind%20CSS&description=Discover%20the%20future%20of%20Open%20Graph%20image%20generation%20with%20a%20seamless%20integration%20of%20Cloudflare%20Workers,%20Hono,%20Vercel%20OG,%20and%20Tailwind%20CSS.%20This%20demo%20highlights%20a%20lightning-fast,%20serverless%20approach%20to%20crafting%20dynamic,%20beautifully%20styled%20OG%20images.%20Perfect%20for%20boosting%20social%20media%20engagement%20and%20standing%20out%20online.&footerText=%F0%9F%9A%80%20Built%20with%20Cloudflare%20Workers,%20Hono,%20Vercel%20OG,%20and%20Tailwind%20CSS%20|%20%E2%9A%A1%20Fast,%20Scalable,%20and%20Stylish&style=3
		async function Style3() {
			try {
				const logoImage = await loadImage(c, '/images/cf-logo-v-rgb.png');

				return (
					<span
						tw="relative w-full h-full flex flex-col justify-between items-start"
						style={{
							display: 'flex',
							backgroundImage: 'linear-gradient(0deg, rgba(247,108,86,1) 0%, rgba(167,194,195,1) 70%)',
						}}
					>
						{logoImage && (
							<span tw="my-3 px-5 flex items-center">
								<img
									src={logoImage}
									height="60"
									alt="Cloudflare"
								/>
							</span>
						)}
						<span tw="flex flex-col px-8 max-w-5xl">
							<h1 tw="text-black text-6xl font-bold"> {mainText} </h1>
							<p tw="text-gray-900 text-2xl font-medium"> {description} </p>
						</span>

						<span tw="flex flex-col px-8 pb-8">
							<p tw="text-gray-900 text-xl font-extrabold">{footerText}</p>
						</span>
					</span>
				);
			} catch (error) {
				console.error('Style3 rendering error:', error);
				throw error;
			}
		}
		function Style4() {
			return (
				<div
					style={{
						display: 'flex',
						fontSize: 60,
						color: 'black',
						background: '#f6f6f6',
						width: '100%',
						height: '100%',
						paddingTop: 50,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<p tw="font-bold text-red-800">https://github.com/mohdlatif</p>
					<img
						width="256"
						height="256"
						src={`https://github.com/mohdlatif.png`}
						style={{
							borderRadius: 128,
						}}
					/>
				</div>
			);
		}

		return new ImageResponse(SocialCardTemplate, {
			width: 1200,
			height: 630,
			fonts: Array.isArray(font) ? [...font] : [font],
		});
	} catch (error: any) {
		console.error('OG Image generation error:', error);
		return c.json({ error: 'Failed to generate image', details: error.message }, 500);
	}
});
