# Database Schema Strategy

## Overview
The platform currently uses a mock repository pattern `IRepository<T>` abstracting over `localStorage` for development purposes. The target production schema will likely be document-based (NoSQL like MongoDB) or a flexible relational model (PostgreSQL with JSONB) given the deeply nested hierarchy of Book > Season > Episode > Chapter > Section > ContentBlock.

## Collections / Tables

### Books
Stores the top-level educational and publishing metadata.
- **id**: String (Primary Key)
- **title**: String
- **slug**: String
- **seasons**: Array of Season objects or references.
- **frontCoverAssetId**: String (Reference to Assets)
- **backCoverAssetId**: String (Reference to Assets)

### Characters
Stores reusable character entities.
- **id**: String (Primary Key)
- **fullName**: String
- **role**: Enum
- **profileAssetId**: String (Reference to Assets)
- **relationships**: Array of CharacterRelationship (foreign keys to other Characters)

### Assets
Stores references to processed files.
- **id**: String (Primary Key)
- **title**: String
- **mimeType**: String
- **assetType**: Enum
- **originalUrl**: String
- **thumbnailUrl**: String
- **mobileWebpUrl**: String
- **readerWebpUrl**: String

*(Note: Raw image binary data is strictly NOT stored in these records. The records act as metadata pointers to the file storage buckets.)*
