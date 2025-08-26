# VoxNote AI - Coding Style Guide

## 📋 Development Standards Overview

This guide establishes consistent coding conventions for VoxNote AI, ensuring maintainable, readable, and scalable code across the entire application stack.

---

## 🛠️ Technology Stack Standards

### Frontend Framework
- **Next.js 14+** with App Router architecture
- **React 18+** with TypeScript for type safety
- **Tailwind CSS** for styling with custom design system
- **Lucide React** for consistent iconography

### Backend & Database
- **Next.js API Routes** for backend functionality
- **Supabase** for database, authentication, and storage
- **PostgreSQL** with normalized schema design
- **Server Components** where appropriate for performance

---

## 📁 File Organization & Structure

### Directory Structure
```
app/
├── api/                    # API routes
│   └── [feature]/         # Feature-based API organization
├── (auth)/                # Route groups for organization
├── dashboard/             # Main application pages
├── components/            # Reusable UI components
└── lib/                   # Utility functions and configurations

components/
├── ui/                    # Base UI components
├── forms/                 # Form-specific components
└── [feature]/            # Feature-specific components

lib/
├── supabase.ts           # Supabase client configuration
├── supabaseAdmin.ts      # Admin client for server-side
├── utils.ts              # General utility functions
└── types.ts              # TypeScript type definitions
```

### File Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Pages**: lowercase with hyphens (`user-profile/page.tsx`)
- **API Routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`userHelpers.ts`)
- **Types**: PascalCase with `.types.ts` suffix (`User.types.ts`)

---

## 🔧 TypeScript Standards

### Type Definitions
```typescript
// Define interfaces for all data structures
interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  type?: 'text' | 'audio' | 'video';
  file_url?: string;
  transcript?: string;
  summary?: string;
  media_url?: string;
  tags?: string[];
}

// Use union types for strict value constraints
type NoteType = 'text' | 'audio' | 'video';
type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'error';
```

### Null Safety & Error Handling
```typescript
// Always check for undefined/null before accessing properties
const displayTranscript = note.transcript?.length 
  ? note.transcript.substring(0, 100) + '...'
  : 'No transcript available';

// Use optional chaining for nested objects
const tagName = noteTag.tags?.name || 'Unknown';

// Implement proper error boundaries
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  return null;
}
```

### Function Signatures
```typescript
// Use explicit return types for clarity
async function fetchNotes(userId: string): Promise<Note[]> {
  // Implementation
}

// Use generics for reusable functions
function createResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}
```

---

## ⚛️ React Component Standards

### Component Structure
```tsx
// Component with proper TypeScript interface
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  isLoading?: boolean;
}

export default function UserProfile({ 
  user, 
  onUpdate, 
  isLoading = false 
}: UserProfileProps) {
  // State declarations first
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  
  // Effects and refs
  useEffect(() => {
    setFormData(user);
  }, [user]);
  
  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation
  };
  
  // Early returns for loading/error states
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Main render
  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  );
}
```

### Hooks Best Practices
```tsx
// Custom hooks for reusable logic
function useNotes(userId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  return { notes, loading, error, refetch: fetchNotes };
}
```

---

## 🔌 API Route Standards

### Route Structure
```typescript
// app/api/notes/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" }, 
        { status: 400 }
      );
    }
    
    // Database operations
    const { data, error } = await supabaseAdmin
      .from("notes")
      .select("*")
      .eq("user_id", userId);
    
    if (error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

### Error Handling Patterns
```typescript
// Consistent error response format
interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

function createErrorResponse(
  message: string, 
  status: number, 
  code?: string
): NextResponse {
  return NextResponse.json(
    { error: message, code } as ApiError, 
    { status }
  );
}

// Usage in routes
if (!noteData.title) {
  return createErrorResponse("title is required", 400, "MISSING_TITLE");
}
```

---

## 🗄️ Database Interaction Standards

### Supabase Client Usage
```typescript
// Use appropriate client for context
// Client-side (components)
import { createClient } from '@/lib/supabase';

// Server-side (API routes, Server Components)
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Query patterns with proper error handling
const { data: notes, error } = await supabaseAdmin
  .from("notes")
  .select(`
    *,
    note_tags(
      tags(
        id,
        name
      )
    )
  `)
  .eq("user_id", userId)
  .order('created_at', { ascending: false });

if (error) {
  console.error('Database error:', error);
  throw new Error(error.message);
}
```

### Schema Design Principles
- Use normalized relationships (junction tables for many-to-many)
- Consistent naming: snake_case for database, camelCase for JavaScript
- Always include `created_at` and `updated_at` timestamps
- Use UUIDs for primary keys
- Implement proper foreign key constraints

---

## 🎨 Styling Standards

### Tailwind CSS Usage
```tsx
// Use utility classes with consistent patterns
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  
// Group related utilities
<button className="
  bg-brand-orange text-white 
  px-4 py-2 
  rounded-md 
  hover:bg-orange-600 
  focus:outline-none focus:ring-2 focus:ring-orange-500 
  transition-colors
">
  
// Use semantic spacing
<div className="space-y-4"> {/* Vertical spacing */}
  <div className="flex items-center space-x-2"> {/* Horizontal spacing */}
```

### Custom Styles
```css
/* Use CSS custom properties for brand colors */
:root {
  --brand-orange: #fa6147;
  --dark-gray: #333328;
  --medium-gray: #acaca9;
}

/* Component-specific styles when Tailwind isn't sufficient */
.note-card {
  @apply bg-white border border-gray-200 rounded-lg p-6;
  transition: all 0.2s ease;
}

.note-card:hover {
  @apply shadow-md border-brand-orange;
}
```

---

## 📝 Code Documentation Standards

### JSDoc Comments
```typescript
/**
 * Fetches and processes note data for a specific user
 * @param userId - The unique identifier for the user
 * @param includeDeleted - Whether to include soft-deleted notes
 * @returns Promise resolving to an array of processed notes
 * @throws {Error} When user is not found or database error occurs
 */
async function fetchUserNotes(
  userId: string, 
  includeDeleted: boolean = false
): Promise<ProcessedNote[]> {
  // Implementation
}
```

### Inline Comments
```typescript
// Normalize tags data structure for frontend consumption
const notesWithTags = data?.map(note => ({
  ...note,
  // Extract tag names from junction table relationship
  tags: note.note_tags?.map((nt: NoteTag) => nt.tags?.name).filter(Boolean) || []
})) || [];
```

### README Standards
- Clear installation and setup instructions
- Environment variable documentation
- API endpoint documentation
- Deployment procedures

---

## ✅ Testing Standards

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import NoteCard from './NoteCard';

test('displays note title and creation date', () => {
  const mockNote = {
    id: '1',
    title: 'Test Note',
    created_at: '2025-01-01T00:00:00Z',
    // ... other required fields
  };
  
  render(<NoteCard note={mockNote} />);
  
  expect(screen.getByText('Test Note')).toBeInTheDocument();
  expect(screen.getByText(/Jan 1, 2025/)).toBeInTheDocument();
});
```

### API Testing
```typescript
// API route testing
import { GET } from '@/app/api/notes/route';
import { NextRequest } from 'next/server';

test('GET /api/notes returns user notes', async () => {
  const request = new NextRequest('http://localhost:3000/api/notes?userId=123');
  const response = await GET(request);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(Array.isArray(data)).toBe(true);
});
```

---

## 🔒 Security Standards

### Input Validation
```typescript
// Validate and sanitize all inputs
function validateNoteInput(data: unknown): Note | null {
  if (!data || typeof data !== 'object') return null;
  
  const note = data as Partial<Note>;
  
  if (!note.title?.trim() || note.title.length > 200) return null;
  if (!note.user_id?.match(/^[a-zA-Z0-9@._-]+$/)) return null;
  
  return {
    title: note.title.trim(),
    user_id: note.user_id,
    type: note.type || 'text',
    // ... other fields
  } as Note;
}
```

### Authentication Patterns
```typescript
// Consistent auth checking in API routes
async function requireAuth(request: Request): Promise<string | NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required" }, 
      { status: 401 }
    );
  }
  
  return session.user.email;
}
```

---

## 📊 Performance Standards

### Code Optimization
- Use `React.memo()` for expensive components
- Implement proper `useCallback()` and `useMemo()` for optimization
- Lazy load components with `React.lazy()` where appropriate
- Optimize database queries with proper indexing

### Bundle Optimization
- Dynamic imports for large dependencies
- Proper code splitting at route level
- Image optimization with Next.js Image component
- Minimize third-party dependencies

---

## � Git & Version Control

### Commit Standards
```bash
# Use conventional commit format
feat(api): add note creation endpoint
fix(ui): resolve dashboard loading state
docs(readme): update installation instructions
refactor(db): normalize tags schema
test(api): add note validation tests
```

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/description` - Feature development
- `fix/description` - Bug fixes
- `hotfix/description` - Critical production fixes

### Pull Request Requirements
- All tests must pass
- TypeScript compilation without errors
- Code review by at least one team member
- Documentation updated if needed

---

*Last Updated: August 26, 2025*  
*Coding Standards Version: 1.0*  
*Enforcement: Required for all development work*
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

### Type Scale
```css
/* Heading Sizes */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* H1 */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* H2 */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* H3 */
.text-xl  { font-size: 1.25rem; line-height: 1.75rem; }   /* H4 */
.text-lg  { font-size: 1.125rem; line-height: 1.75rem; }  /* Large */

/* Body Sizes */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* Body */
.text-sm   { font-size: 0.875rem; line-height: 1.25rem; } /* Small */
.text-xs   { font-size: 0.75rem; line-height: 1rem; }     /* Extra Small */
```

### Font Weights
- **Regular**: `font-weight: 400` - Body text
- **Medium**: `font-weight: 500` - Labels, navigation
- **Semibold**: `font-weight: 600` - Headings, emphasis
- **Bold**: `font-weight: 700` - Strong emphasis (use sparingly)

### Typography Usage
```css
/* Headers */
h1, h2, h3, h4 {
  color: #333328;
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Body Text */
p, span {
  color: #333328;
  font-weight: 400;
  line-height: 1.6;
}

/* Secondary Text */
.text-secondary {
  color: #545268;
  font-size: 0.875rem;
}
```

---

## 🧱 Component Patterns

### Cards
```css
.card {
  background: white;
  border: 1px solid #acaca9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #fa6147;
  color: #e5e5df;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #e55541;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: #333328;
  border: 1px solid #acaca9;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
```

### Form Elements
```css
/* Input Fields */
.input {
  background: white;
  border: 1px solid #acaca9;
  border-radius: 0.375rem;
  padding: 0.75rem;
  color: #333328;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #fa6147;
  box-shadow: 0 0 0 2px rgba(250, 97, 71, 0.2);
}
```

### Modal/Dialog
```css
.modal-overlay {
  background: rgba(51, 51, 40, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
```

---

## 🔧 Spacing System

### Spacing Scale (Tailwind-based)
```css
/* Spacing Units (rem) */
0.25rem  /* 1 - 4px */
0.5rem   /* 2 - 8px */
0.75rem  /* 3 - 12px */
1rem     /* 4 - 16px */
1.25rem  /* 5 - 20px */
1.5rem   /* 6 - 24px */
2rem     /* 8 - 32px */
3rem     /* 12 - 48px */
4rem     /* 16 - 64px */
```

### Layout Guidelines
- **Page Margins**: `2rem` (32px) on desktop, `1rem` (16px) on mobile
- **Card Padding**: `1.5rem` (24px)
- **Button Padding**: `0.75rem 1.5rem` (12px 24px)
- **Input Padding**: `0.75rem` (12px)
- **Grid Gaps**: `1.5rem` (24px) between cards

---

## 🎯 Icon System

### Lucide React Icons
```jsx
// Core Icons Used
import { 
  Mic,          // Audio recording, microphone
  Video,        // Video recording
  FileText,     // Text notes
  Volume2,      // Audio content
  Clock,        // Duration, time
  Eye,          // View, visibility
  Search,       // Search functionality
  Zap,          // Performance, activity
  Sparkles,     // AI features
  Grid,         // Grid view
  List,         // List view
  X             // Close, cancel
} from 'lucide-react';
```

### Icon Guidelines
- **Size**: `w-4 h-4` (16px) for inline icons, `w-5 h-5` (20px) for buttons
- **Color**: Match surrounding text color
- **Stroke Width**: Default (2px) for consistency
- **Usage**: Always pair with accessible labels

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Layout Patterns
```css
/* Grid Layouts */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;           /* Mobile: 1 column */
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

---

## 🌟 Animation & Transitions

### Transition Standards
```css
/* Standard Transitions */
.transition-standard {
  transition: all 0.2s ease;
}

.transition-slow {
  transition: all 0.3s ease;
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

### Loading States
```css
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## ♿ Accessibility Guidelines

### Focus Management
- Clear focus indicators on all interactive elements
- Logical tab order throughout the application
- Focus trapping in modals and dialogs

### Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels and descriptions
- Alt text for all images and icons

### Keyboard Navigation
- All functionality accessible via keyboard
- Escape key closes modals
- Enter key activates primary actions

---

## 🔍 Component Naming Conventions

### CSS Classes
```css
/* Component Naming Pattern */
.component-name          /* Base component */
.component-name--variant /* Component variant */
.component-name__element /* Component element */
.component-name--variant__element /* Variant element */

/* Examples */
.btn                    /* Base button */
.btn--primary          /* Primary button variant */
.btn__icon             /* Button icon element */
.btn--primary__icon    /* Primary button icon */
```

### React Components
```tsx
// Component Structure
const ComponentName = () => {
  return (
    <div className="component-name">
      <div className="component-name__header">
        <h2 className="component-name__title">Title</h2>
      </div>
    </div>
  );
};
```

---

## 📋 Design Checklist

### Before Implementation
- [ ] Color contrast meets WCAG AA standards
- [ ] Typography scale is consistent
- [ ] Spacing follows the defined system
- [ ] Icons are properly sized and colored
- [ ] Focus states are clearly visible

### During Development
- [ ] Components are responsive across breakpoints
- [ ] Animations are smooth and purposeful
- [ ] Loading states provide clear feedback
- [ ] Error states are user-friendly

### Before Deployment
- [ ] Cross-browser compatibility tested
- [ ] Accessibility features verified
- [ ] Performance impact assessed
- [ ] Mobile experience optimized

---

*Last Updated: August 26, 2025*  
*Design System Version: 1.0*
