# Build Log

## Build Number: 1
**Date**: Initial Foundation Setup
*(See commit history for details)*

## Build Number: 2
**Date**: Professional Book Builder Integration

### Scope
Implement the first functional Professional Book Builder inside the Publishing Console, including deep domain metadata support, hierarchical structural editing, block-based content management, and robust local persistence.

### Files Changed
- `@eot/shared-types/src/types.ts`: Extended with educational metadata and full Book/Season/Episode/Chapter fields.
- `@eot/validation/src/schemas.ts`: Added deep Zod validation and hierarchy duplicate checks.
- `@eot/validation/tests/builder.test.ts`: Added testing suite for book building validations.
- `apps/publishing-console/src/lib/repositories.ts`: Introduced `IRepository` abstraction with an in-memory `localStorage` implementation for local development persistence.
- `apps/publishing-console/src/App.tsx`: Added routing.
- `apps/publishing-console/src/pages/BooksTable.tsx`: Added library management UI.
- `apps/publishing-console/src/pages/BookBuilder.tsx`: Added structural navigator and metadata editor.
- `apps/publishing-console/src/components/ContentBlockEditor.tsx`: Implemented native block editor for rich content types.

### Technical Decisions
- **Local Persistence Abstraction**: The console relies entirely on `bookRepository.save()` which hides the browser `localStorage` mechanics behind an asynchronous interface, allowing trivial replacement with an API client in the next build.
- **State Management**: The builder relies on complex local React state that is synced via the Repository pattern on "Save Book" rather than mutating the data store on every keystroke, improving performance and enabling draft rollback capabilities in the future.
- **Routing**: Introduced `react-router-dom` to handle the transition from Dashboard to Workspace seamlessly.

### Known Limitations
- The Book Editor currently requires saving explicitly using the "Save Book" button.
- Preview models are statically styled blocks rather than true responsive iframes.
- Character/Vendor Card integrations are UI stubs as those domains are not fully scaffolded yet.

### Recommended Next Build
- Introduce the API Gateway in `services/api` to transition away from local storage.
- Implement the Reader Shell ingestion engine to consume Data Packs exported from this builder.
