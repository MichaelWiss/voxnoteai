# VoxNote AI - Requirements Documentation

## Project Overview
VoxNote AI is a video and voice-to-note application built with Next.js 14+ App Router, Supabase, and NextAuth.js. The application allows users to record video and voice notes, transcribe them using OpenAI's Whisper API, and manage them through a modern web interface.

## Performance Requirements

### Response Times
- API responses: < 500ms for CRUD operations
- Page load times: < 2 seconds
- Video/audio transcription: < 30 seconds for files under 10MB
- Video playback: < 3 seconds initial load time

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **State Management**: React hooks and server components

### Backend
- **API Routes**: Next.js App Router API routes (`app/api/`)
- **Authentication**: NextAuth.js with Google OAuth provider
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage (for video and audio files)
- **Video/Audio Transcription**: OpenAI Whisper API

### Infrastructure
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication Provider**: Google OAuth 2.0
- **Deployment**: Vercel (recommended)
- **Environment**: Node.js

## Core Features

### Authentication System
- Google OAuth integration via NextAuth.js
- Automatic user registration in Supabase on first sign-in
- Session management with JWT tokens
- Protected routes and API endpoints
- Custom sign-in/sign-up pages

### Video & Voice Recording & Transcription
- Browser-based video and audio recording
- Video and audio file upload to Supabase Storage
- OpenAI Whisper API integration for transcription
- Support for multiple video and audio formats
- Video playback with synchronized transcripts
- Files stored via `file_url` and `media_url` fields
- Media type differentiation through `type` field
- Transcript storage in dedicated `transcript` field
- AI-generated summaries in `summary` field

### Note Management
- CRUD operations for notes (Create, Read, Update, Delete)
- User-specific note isolation
- Rich text support for note content
- Tagging system for note organization
- Search and filtering capabilities

### User Management
- User profile management
- User data privacy and isolation
- Admin-level user operations (when authorized)

## Database Schema

### Users Table
```sql
- id: UUID (Primary Key) DEFAULT gen_random_uuid()
- email: String (Unique)
- full_name: Text
- created_at: Timestamp with time zone DEFAULT now()
```

### Notes Table
```sql
- id: UUID (Primary Key) DEFAULT gen_random_uuid()
- user_id: UUID (Foreign Key to users.id) DEFAULT gen_random_uuid()
- title: String (character varying)
- type: Text
- file_url: String (character varying)
- transcript: Text
- summary: Text
- media_url: Text
- created_at: Timestamp with time zone DEFAULT now()
- updated_at: Timestamp with time zone DEFAULT now()
```

### Tags Table
```sql
- id: UUID (Primary Key) DEFAULT gen_random_uuid()
- name: String (character varying, UNIQUE)
```

### Note_Tags Junction Table
```sql
- note_id: UUID (Primary Key, Foreign Key to notes.id) DEFAULT gen_random_uuid()
- tag_id: UUID (Foreign Key to tags.id) DEFAULT gen_random_uuid()
```

**Note**: The current schema has a PRIMARY KEY constraint only on `note_id`, but for a proper junction table, it should have a composite PRIMARY KEY on both `(note_id, tag_id)` to allow multiple tags per note.

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handler
- `GET /api/auth/sign-in` - Custom sign-in page
- `GET /api/auth/sign-up` - Custom sign-up page

### Users
- `GET /api/users` - List all users (authenticated)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Notes
- `GET /api/notes` - List user's notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Tags
- `GET /api/tags` - List user's tags
- `POST /api/tags` - Create new tag
- `GET /api/tags/[id]` - Get specific tag
- `PUT /api/tags/[id]` - Update tag
- `DELETE /api/tags/[id]` - Delete tag

### Transcription
- `POST /api/transcribe` - Transcribe video or audio file

## Environment Variables

### Required
```env
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

## Security Requirements

### Authentication
- All API routes require authentication except public endpoints
- JWT token validation on each request
- Session timeout and refresh handling
- Secure cookie configuration

### Data Privacy
- User data isolation (users can only access their own data)
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- XSS protection through proper escaping

### API Security
- Rate limiting on API endpoints
- CORS configuration
- Request validation and error handling
- Secure file upload handling

## Performance Requirements

### Response Times
- API responses: < 500ms for CRUD operations
- Page load times: < 2 seconds
- Video/audio transcription: < 30 seconds for files under 10MB

### Scalability
- Support for concurrent users
- Efficient database queries with proper indexing
- Optimized bundle sizes and code splitting
- CDN usage for static assets

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- High contrast mode support

## Testing Requirements

### Unit Testing
- Jest for JavaScript/TypeScript testing
- React Testing Library for component testing
- API route testing with mocked dependencies

### Integration Testing
- Database integration tests
- Authentication flow testing
- API endpoint testing

### E2E Testing
- User journey testing
- Cross-browser testing
- Mobile responsiveness testing

## Deployment Requirements

### Production Environment
- HTTPS enforcement
- Environment variable security
- Database connection pooling
- Monitoring and logging
- Backup and recovery procedures

### Development Environment
- Hot reloading and fast refresh
- Development database setup
- Local environment configuration
- Debug mode capabilities
