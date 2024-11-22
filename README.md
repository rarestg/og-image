# Dynamic OG Image Generator with Cloudflare Workers

A high-performance Open Graph image generator built with Cloudflare Workers, Hono, and Vercel OG. Generate beautiful social media cards dynamically with support for multiple font loading strategies and visual styles.

## Features

- 🚀 Built on Cloudflare Workers for edge computing
- ⚡ Multiple pre-designed card styles
- 🎨 Flexible font loading strategies
- 🔄 Built-in caching support
- 📱 Responsive designs
- 🎯 Tailwind CSS styling

## Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Deploy to Cloudflare Workers
bun run deploy
```

## Usage

Generate OG images by making GET requests with query parameters:

```
/og?mainText=Your Title&description=Your Description&footerText=Footer Text&style=1
```

### Query Parameters

- `mainText`: Main heading text
- `description`: Detailed description
- `footerText`: Footer content
- `style`: Visual style (1-4)

## Font Loading Strategies

The project supports multiple font loading methods:

### 1. Google Fonts

```typescript
const font = await googleFont(text, 'Noto Sans JP', 900, 'normal');
```

### 2. GitHub-hosted Fonts

```typescript
const font = await githubFonts();
```

### 3. Direct URL Fonts

```typescript
const font = await directFont('https://example.com/fonts/CustomFont.ttf', 'CustomFont', 400, 'normal');
```

### 4. Local Fonts

```typescript
const font = await getLocalFonts(c, [
	{ path: 'Poppins-Regular.ttf', weight: 400 },
	{ path: 'Poppins-Bold.ttf', weight: 700 },
]);
```

## Visual Styles

The generator includes 4 pre-designed styles:

1. **Style 1**: Modern gradient with glass effect (Blue theme)
2. **Style 2**: Eco/Green technology theme
3. **Style 3**: Cloudflare-inspired design with logo
4. **Style 4**: GitHub profile card style

## Caching

The project includes built-in caching support for both fonts and generated images. Enable caching by uncommenting the cache middleware in `index.ts`.

## Tech Stack

- Cloudflare Workers
- Hono Framework
- Vercel OG
- TypeScript
- Tailwind CSS

## License

MIT

---

For more examples and detailed documentation, visit the [GitHub repository](https://github.com/mohdlatif/og-image-generator-cloudflare-worker).
