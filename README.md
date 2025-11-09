# SnapWeb - Website Screenshot Generator

A powerful, fast, and easy-to-use website screenshot generator built with Next.js and Puppeteer. Generate high-quality screenshots of any website in seconds with multiple resolution and format options.

## ✨ Features

- 🚀 **Fast Screenshot Generation** - Screenshots in seconds
- 📱 **Multiple Resolutions** - Desktop, tablet, and mobile viewports
- 🎨 **Format Options** - PNG, JPEG, and WebP support
- 🔧 **Professional UI** - Clean, modern interface with CDN icons
- 🌐 **Full-Stack Solution** - Complete Next.js application with API
- ⚡ **One-Click Deploy** - Ready for Vercel deployment
- 📚 **API Documentation** - RESTful API for integration
- 🎯 **Developer Friendly** - TypeScript, Tailwind CSS, and modern tooling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd snapweb-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

This application is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click!

The application includes:
- Optimized Vercel configuration
- API routes with proper timeout settings
- Static asset optimization
- Professional production build

## 🔧 API Usage

### Generate Screenshot

```bash
POST /api/screenshot
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "fullPage": true,
  "format": "png",
  "quality": 90,
  "timeout": 30000,
  "waitForNetworkIdle": false
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "/screenshots/screenshot_123456789_abc123.png",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "fileSize": 245760,
    "format": "png",
    "captureTime": 2340
  }
}
```

### Health Check

```bash
GET /api/health
```

Returns server status, uptime, and memory usage.

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Screenshots:** Puppeteer
- **Icons:** Lucide React (CDN-based vectors)
- **Deployment:** Vercel-optimized

## 📁 Project Structure

```
snapweb-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── screenshot/    # Screenshot generation
│   │   │   ├── health/        # Health check
│   │   │   └── test/          # API testing
│   │   ├── api-docs/          # API documentation page
│   │   ├── docs/              # User documentation
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   └── screenshot-generator.tsx
│   └── lib/                   # Utilities and types
├── public/
│   └── screenshots/           # Generated screenshots
├── tailwind.config.ts         # Tailwind configuration
├── vercel.json               # Vercel deployment config
└── package.json
```

## 🎯 Use Cases

- **Developers:** Document applications, visual regression testing, portfolio previews
- **Designers:** Capture inspiration, create mood boards, document design systems
- **Marketers:** Social media content, competitor analysis, marketing materials

## 🔒 Security Features

- URL validation and sanitization
- Request timeout protection
- File type restrictions
- Secure file serving
- Rate limiting ready

## 📝 Environment Variables

No environment variables required for basic functionality. The application works out of the box.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🆘 Support

- Check the [Documentation](/docs) for usage guides
- Review [API Documentation](/api-docs) for integration
- Open an issue for bug reports or feature requests

---

**Ready to deploy?** This is a complete, production-ready Next.js application that can be deployed to Vercel with a single click!
