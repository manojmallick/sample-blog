# Sample Blog

A small self-hosted blog CMS prototype with editable pages, Markdown posts, image uploads, rich content blocks, and a React admin interface backed by an Express API. Content and uploads are stored locally as JSON and files.

## Develop

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`. The local development admin password is `admin`. This default is disabled in production.

## Features

- Draft and published posts with tags, translations, and Markdown preview
- Editable pages, home page, navigation, and site settings
- Image uploads and video, chart, and card content blocks
- Server-rendered SEO metadata, sitemap, robots file, and RSS feed

## Build

```bash
pnpm typecheck
pnpm build
pnpm start
```

The admin URL is `/admin`. For production, set both `ADMIN_PASSWORD` and a high-entropy `SESSION_SECRET`; startup refuses to run without them. Serve behind HTTPS and a trusted reverse proxy. Mount a persistent volume at `/app/data` when using Docker.

## Storage and security limitations

This is a prototype intended for a single self-hosted instance. It uses a local JSON file rather than a database and does not include login throttling or multi-user roles. Back up `data/`, restrict network access to the admin, and review the upload and authentication code before storing sensitive content or exposing the service publicly.

Docker image publishing requires manual workflow dispatch.

## License

Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). This source-available license restricts commercial use; it is not an OSI-approved open-source license. See the license for terms and exceptions. Third-party dependencies retain their own licenses.
