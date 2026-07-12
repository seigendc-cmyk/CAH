# Empire of Trust (EOT) - Source of Truth

## Product Purpose
The Empire of Trust App is a digital publishing, interactive reading, vendor discovery, and commerce platform. It allows users to consume serialized books offline, discover vendors, and interact with structured digital content seamlessly across network boundaries.

## Platform Layers
1. **Reader Shell**: The mobile-first PWA for end-users to read content and interact with vendors.
2. **Publishing Console**: The web-based admin interface for authors and publishers to manage books, characters, data packs, and storefronts.
3. **Public Website**: The primary landing, marketing, and distribution channel for the app.

## Core Principles
- **Offline-First Rule**: The Reader Shell must function fully offline. Network access is considered an enhancement, not a requirement, for the reading and library experience.
- **Data-Pack Rule**: Content is distributed as standalone, verifiable Data Packs. The app ingests these packs rather than constantly streaming content from a server.
- **Commerce Integration Rule**: Vendor storefronts and product interactions seamlessly integrate within the reading experience, primarily functioning via queued offline actions (like WhatsApp product enquiries) that sync when online.
