# System Architecture

## Core Principles
- **Offline-First**: Driven by data-packs installed locally on the mobile device.
- **Domain-Driven Design**: Shared types and validations dictate the structure of all apps.
- **Reusable Assets**: Assets and Characters are global and associated via references, avoiding duplication.

## Components
1. **Reader Shell (PWA)**: Consumes data-packs, renders books.
2. **Publishing Console (React)**: Admin interface for structuring books, characters, and assets.
3. **Image Processor (Node/Express)**: Local service using `multer` and `sharp`. 
   - **Pipeline**: Receives uploads -> Validates MIME -> Generates 150px WebP thumb, 480px WebP mobile, 1200px WebP reader -> Saves to `.data/assets/processed`.
4. **Validation Layer**: `@eot/validation` handles Zod schemas and deterministic continuity checks.

## Asset Storage Strategy
- **Development**: Files are stored in `.data/assets/` at the monorepo root. The Image Processor serves them statically.
- **Production**: (Target) Files will be uploaded directly to S3/Cloud Storage, and the Asset records in the DB will point to CDN URLs. Raw binary data is never stored in the primary database.

## Character Continuity
Continuity logic runs on the client/validation layer before saving. It checks for:
- Missing required profile assets.
- Logically conflicting relationship types (e.g. A marks B as enemy, B marks A as friend).
- Inconsistent spelling between existing characters.
