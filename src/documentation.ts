import htmlContent from './documentation.html';
// Documentation route
export function generateDocumentationHTML() {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<title>OG Image Generator API</title>
		<style>
			* {
				box-sizing: border-box;
			}
			body {
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
				line-height: 1.6;
				color: #333;
				margin: 0;
				padding: 0;
				background: #f8f9fa;
			}
			.container {
				max-width: 1200px;
				margin: 0 auto;
				padding: 20px;
			}
			.header {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				padding: 40px 0;
				text-align: center;
				margin-bottom: 40px;
				border-radius: 12px;
			}
			.header h1 {
				margin: 0;
				font-size: 2.5em;
				font-weight: 700;
			}
			.header p {
				margin: 10px 0 0;
				font-size: 1.2em;
				opacity: 0.9;
			}
			.section {
				background: white;
				border-radius: 12px;
				padding: 30px;
				margin-bottom: 30px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			}
			.section h2 {
				color: #667eea;
				margin-top: 0;
				border-bottom: 2px solid #667eea;
				padding-bottom: 10px;
			}
			.route {
				background: #f8f9fb;
				border: 1px solid #e1e8ed;
				border-radius: 8px;
				padding: 20px;
				margin: 20px 0;
			}
			.route-header {
				display: flex;
				align-items: center;
				margin-bottom: 15px;
			}
			.method {
				background: #28a745;
				color: white;
				padding: 6px 12px;
				border-radius: 4px;
				font-weight: bold;
				margin-right: 15px;
				font-size: 0.9em;
			}
			.path {
				font-family: 'Monaco', 'Menlo', monospace;
				font-size: 1.1em;
				font-weight: 600;
				color: #333;
			}
			.description {
				color: #666;
				margin-bottom: 20px;
				font-style: italic;
			}
			.params {
				margin-top: 15px;
			}
			.params h4 {
				margin: 15px 0 10px;
				color: #333;
			}
			.param {
				background: white;
				border: 1px solid #ddd;
				border-radius: 6px;
				padding: 12px;
				margin: 8px 0;
			}
			.param-name {
				font-weight: 600;
				color: #d63384;
				font-family: 'Monaco', 'Menlo', monospace;
			}
			.param-type {
				color: #6f42c1;
				font-size: 0.9em;
				margin-left: 10px;
			}
			.param-required {
				color: #dc3545;
				font-size: 0.8em;
				margin-left: 10px;
			}
			.param-description {
				color: #666;
				margin-top: 5px;
			}
			.example {
				background: #f8f9fa;
				border: 1px solid #e9ecef;
				border-radius: 6px;
				padding: 15px;
				margin: 15px 0;
			}
			.example h5 {
				margin: 0 0 10px;
				color: #495057;
			}
			.example code {
				background: #e9ecef;
				padding: 2px 6px;
				border-radius: 4px;
				font-family: 'Monaco', 'Menlo', monospace;
				font-size: 0.9em;
			}
			.example a {
				color: #667eea;
				text-decoration: none;
				word-break: break-all;
			}
			.example a:hover {
				text-decoration: underline;
			}
			.version-info {
				background: #e7f3ff;
				border: 1px solid #b8d4f0;
				border-radius: 6px;
				padding: 15px;
				margin-bottom: 20px;
			}
			.version-info h4 {
				margin: 0 0 10px;
				color: #0066cc;
			}
			.version-info p {
				margin: 5px 0;
				color: #0066cc;
			}
			.footer {
				text-align: center;
				color: #666;
				margin-top: 40px;
				padding-top: 20px;
				border-top: 1px solid #ddd;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h1>🎨 OG Image Generator API</h1>
				<p>Generate beautiful Open Graph images and profile cards</p>
			</div>

			<div class="section">
				<h2>📊 Deployment Information</h2>
				<div class="version-info">
					<h4>Current Deployment</h4>
					<p>
						<strong>Version:</strong> ${
							process.env.WORKERS_CI_COMMIT_SHA?.substring(0, 7) || process.env.GITHUB_SHA?.substring(0, 7) || 'unknown'
						}
					</p>
					<p><strong>Branch:</strong> ${process.env.WORKERS_CI_BRANCH || process.env.GITHUB_REF_NAME || 'unknown'}</p>
					<p><strong>Deployed:</strong> ${new Date().toISOString()}</p>
					<p><strong>Environment:</strong> Cloudflare Workers</p>
				</div>
			</div>

			<div class="section">
				<h2>🚀 API Endpoints</h2>

				<div class="route">
					<div class="route-header">
						<span class="method">GET</span>
						<span class="path">/og</span>
					</div>
					<div class="description">Generate customizable Open Graph images with different styles</div>

					<div class="params">
						<h4>Query Parameters:</h4>
						<div class="param">
							<span class="param-name">mainText</span>
							<span class="param-type">string</span>
							<div class="param-description">Main title text (default: "Default Title")</div>
						</div>
						<div class="param">
							<span class="param-name">description</span>
							<span class="param-type">string</span>
							<div class="param-description">Description text (default: "Default Description")</div>
						</div>
						<div class="param">
							<span class="param-name">footerText</span>
							<span class="param-type">string</span>
							<div class="param-description">Footer text (default: "Footer Text")</div>
						</div>
						<div class="param">
							<span class="param-name">style</span>
							<span class="param-type">string</span>
							<div class="param-description">
								Style variant: "1" (gradient), "2" (eco), "3" (cloudflare), "4" (github) (default: "1")
							</div>
						</div>
					</div>

					<div class="example">
						<h5>Example:</h5>
						<a
							href="/og?mainText=Hello%20World&description=This%20is%20a%20test&footerText=Made%20with%20❤️&style=1"
							target="_blank"
						>
							<code
								>/og?mainText=Hello%20World&description=This%20is%20a%20test&footerText=Made%20with%20❤️&style=1</code
							>
						</a>
					</div>
				</div>

				<div class="route">
					<div class="route-header">
						<span class="method">GET</span>
						<span class="path">/profile/</span>
					</div>
					<div class="description">Generate profile cards with custom images and text</div>

					<div class="params">
						<h4>Query Parameters:</h4>
						<div class="param">
							<span class="param-name">imageUrl</span>
							<span class="param-type">string</span>
							<span class="param-required">required</span>
							<div class="param-description">External image URL (must start with http/https)</div>
						</div>
						<div class="param">
							<span class="param-name">title</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile title/name (default: "John Doe")</div>
						</div>
						<div class="param">
							<span class="param-name">subtitle</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile subtitle/role (default: "Software Engineer")</div>
						</div>
						<div class="param">
							<span class="param-name">description</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile description (optional)</div>
						</div>
						<div class="param">
							<span class="param-name">font</span>
							<span class="param-type">string</span>
							<div class="param-description">
								Font family: "inter", "avenir", "geist", "fraunces" (default: "inter")
							</div>
						</div>
					</div>

					<div class="example">
						<h5>Example:</h5>
						<a
							href="/profile/?title=Jane%20Doe&subtitle=Full%20Stack%20Developer&imageUrl=https://avatars.githubusercontent.com/u/1?v=4&font=inter"
							target="_blank"
						>
							<code
								>/profile/?title=Jane%20Doe&subtitle=Full%20Stack%20Developer&imageUrl=https://avatars.githubusercontent.com/u/1?v=4&font=inter</code
							>
						</a>
					</div>
				</div>

				<div class="route">
					<div class="route-header">
						<span class="method">GET</span>
						<span class="path">/profile/:handle</span>
					</div>
					<div class="description">Generate profile cards with handle in URL path</div>

					<div class="params">
						<h4>Path Parameters:</h4>
						<div class="param">
							<span class="param-name">handle</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile handle (used as default title)</div>
						</div>
						<h4>Query Parameters:</h4>
						<div class="param">
							<span class="param-name">imageUrl</span>
							<span class="param-type">string</span>
							<span class="param-required">required</span>
							<div class="param-description">External image URL (must start with http/https)</div>
						</div>
						<div class="param">
							<span class="param-name">title</span>
							<span class="param-type">string</span>
							<div class="param-description">Override profile title (default: handle)</div>
						</div>
						<div class="param">
							<span class="param-name">subtitle</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile subtitle/role (default: "Software Engineer")</div>
						</div>
						<div class="param">
							<span class="param-name">description</span>
							<span class="param-type">string</span>
							<div class="param-description">Profile description (optional)</div>
						</div>
						<div class="param">
							<span class="param-name">font</span>
							<span class="param-type">string</span>
							<div class="param-description">
								Font family: "inter", "avenir", "geist", "fraunces" (default: "inter")
							</div>
						</div>
					</div>

					<div class="example">
						<h5>Example:</h5>
						<a
							href="/profile/johndoe?subtitle=DevOps%20Engineer&imageUrl=https://avatars.githubusercontent.com/u/1?v=4&font=geist"
							target="_blank"
						>
							<code
								>/profile/johndoe?subtitle=DevOps%20Engineer&imageUrl=https://avatars.githubusercontent.com/u/1?v=4&font=geist</code
							>
						</a>
					</div>
				</div>
			</div>

			<div class="section">
				<h2>💡 Usage Tips</h2>
				<ul>
					<li>
						<strong>Image Dimensions:</strong> All generated images are 1200x630 pixels (optimal for social media)
					</li>
					<li><strong>External Images:</strong> Profile routes only accept external URLs starting with http/https</li>
					<li><strong>URL Encoding:</strong> Remember to URL encode special characters in query parameters</li>
					<li><strong>Caching:</strong> Images are cached for better performance</li>
					<li><strong>Fonts:</strong> Choose from Inter, Avenir, Geist, or Fraunces for different visual styles</li>
				</ul>
			</div>

			<div class="footer">
				<p>🚀 Powered by Cloudflare Workers | Built with Hono & workers-og</p>
			</div>
		</div>
	</body>
</html>
`;
}
