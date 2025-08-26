# VoxNote AI - Style Guide

## Code Style and Conventions

### General Principles
- **Consistency**: Maintain consistent patterns across the codebase
- **Readability**: Write self-documenting code with clear naming
- **Modularity**: Keep components and functions focused and reusable
- **Type Safety**: Leverage TypeScript for better code reliability

## File and Folder Structure

### Directory Organization
```
app/
├── (auth)/                  # Route groups for auth pages
│   ├── sign-in/
│   └── sign-up/
├── api/                     # API routes
│   ├── auth/
│   ├── notes/
│   ├── users/
│   └── tags/
├── dashboard/               # Protected dashboard pages
└── globals.css              # Global styles

lib/                         # Shared libraries and utilities
├── auth.ts                  # NextAuth configuration
├── supabaseAdmin.ts         # Server-side Supabase client
└── utils.ts                 # Utility functions

utils/                       # Utility modules
├── supabase/
│   ├── client.ts           # Browser Supabase client
│   ├── server.ts           # Server Supabase client
│   └── middleware.ts       # Supabase middleware

components/                  # Reusable UI components
├── ui/                     # Base UI components
├── forms/                  # Form components
├── media/                  # Video and audio components
└── recording/              # Video/audio recording components

__tests__/                   # Test files
├── api/                    # API route tests
├── components/             # Component tests
└── utils/                  # Utility function tests
```

### File Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Pages**: lowercase with kebab-case (`sign-in/page.tsx`)
- **API Routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase with `.types.ts` suffix (`User.types.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## TypeScript Conventions

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email?: string;
  full_name?: string;
  created_at: string;
}

interface Note {
  id: string;
  user_id: string;
  title?: string;
  type?: string;
  file_url?: string;
  transcript?: string;
  summary?: string;
  media_url?: string;
  created_at: string;
  updated_at?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface NoteTag {
  note_id: string;
  tag_id: string;
}

interface MediaFile {
  id: string;
  file_name: string;
  file_type: 'video' | 'audio';
  file_size: number;
  duration?: number;
  url: string;
}

// Use types for unions and computed types
type UserStatus = 'active' | 'inactive' | 'pending';
type UserWithStatus = User & { status: UserStatus };

// Use enums for constants
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
```

### Function Signatures
```typescript
// Prefer explicit return types for public functions
export async function createUser(userData: Partial<User>): Promise<User> {
  // Implementation
}

// Use proper error handling
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
```

## React Component Conventions

### Component Structure
```typescript
'use client'; // Only when needed for client components

import { useState, useEffect, useRef, RefObject } from 'react';
import { ComponentProps } from './Component.types';

interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
}

export default function Component({ 
  title, 
  isVisible = true, 
  onAction 
}: ComponentProps) {
  const [state, setState] = useState<boolean>(false);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleAction = () => {
    onAction?.();
  };

  if (!isVisible) return null;

  return (
    <div className="component-container">
      <h1>{title}</h1>
      <button onClick={handleAction}>
        Action
      </button>
    </div>
  );
}
```

### Hooks Usage
```typescript
// Custom hooks should start with 'use'
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
}

// Media-specific component example
interface MediaPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'audio';
  transcript?: string;
  onTimeUpdate?: (currentTime: number) => void;
  autoPlay?: boolean;
}

export function MediaPlayer({ 
  mediaUrl, 
  mediaType,
  transcript, 
  onTimeUpdate,
  autoPlay = false 
}: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const time = mediaRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  if (mediaType === 'video') {
    return (
      <div className="video-player-container">
        <video 
          ref={mediaRef as RefObject<HTMLVideoElement>}
          src={mediaUrl}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay={autoPlay}
          controls
          className="w-full h-auto"
        />
        {transcript && (
          <div className="transcript-panel">
            <p>{transcript}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="audio-player-container">
      <audio 
        ref={mediaRef as RefObject<HTMLAudioElement>}
        src={mediaUrl}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={autoPlay}
        controls
        className="w-full"
      />
      {transcript && (
        <div className="transcript-panel">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
```

## API Route Conventions

### Route Handler Structure
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Extract parameters
    const { id } = await context.params;

    // Validation
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      );
    }

    // Business logic
    const data = await fetchData(id);

    // Response
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Error Handling Patterns
```typescript
// Consistent error response format
interface APIError {
  error: string;
  code?: string;
  details?: any;
}

// Standard error responses
const ErrorResponses = {
  UNAUTHORIZED: NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  ),
  NOT_FOUND: NextResponse.json(
    { error: 'Resource not found' },
    { status: 404 }
  ),
  VALIDATION_ERROR: (message: string) => NextResponse.json(
    { error: 'Validation error', details: message },
    { status: 400 }
  ),
  INTERNAL_ERROR: NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  ),
};
```

## Database Conventions

### Supabase Client Usage
```typescript
// Always use server-side client for API routes
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Use browser client for client components
import { createClient } from '@/utils/supabase/client';

// Proper error handling
async function fetchUserNotes(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select(`
      id,
      title,
      content,
      video_url,
      audio_url,
      transcript,
      created_at,
      note_tags(tag_id, tags(name))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  return data;
}
```

### Query Patterns
```typescript
// Use proper filtering and joins
const getUserNotesWithTags = async (userId: string) => {
  return await supabaseAdmin
    .from('notes')
    .select(`
      id,
      title,
      content,
      created_at,
      note_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};
```

## Styling Conventions

### Tailwind CSS Usage
```typescript
// Use consistent spacing and sizing
const buttonClasses = {
  base: 'px-4 py-2 rounded-md font-medium transition-colors',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

// Component with conditional classes
export function Button({ variant = 'primary', ...props }) {
  return (
    <button 
      className={`${buttonClasses.base} ${buttonClasses[variant]}`}
      {...props}
    />
  );
}
```

### CSS Custom Properties
```css
/* globals.css */
:root {
  --color-primary: 59 130 246; /* blue-500 */
  --color-secondary: 107 114 128; /* gray-500 */
  --color-success: 34 197 94; /* green-500 */
  --color-danger: 239 68 68; /* red-500 */
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

## Testing Conventions

### Test File Structure
```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  const defaultProps = {
    title: 'Test Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with title', () => {
    render(<Component {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle action click', () => {
    const mockAction = jest.fn();
    render(<Component {...defaultProps} onAction={mockAction} />);
    
    fireEvent.click(screen.getByText('Action'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

### API Route Testing
```typescript
// api.test.ts
import { GET } from '@/app/api/notes/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth');
jest.mock('@/lib/supabaseAdmin');

describe('/api/notes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});
```

## Git Conventions

### Commit Message Format
```
type(scope): description

feat(auth): add Google OAuth integration
fix(api): resolve user data fetch issue
docs(readme): update setup instructions
style(components): improve button styling
refactor(utils): simplify date formatting
test(api): add user route tests
chore(deps): update dependencies
```

### Branch Naming
```
feature/user-authentication
bugfix/api-response-format
hotfix/security-vulnerability
docs/api-documentation
```

## Documentation Standards

### Code Comments
```typescript
/**
 * Validates and creates a new user in the database
 * @param userData - Partial user data to create
 * @returns Promise resolving to the created user
 * @throws Error if validation fails or user creation fails
 */
export async function createUser(userData: Partial<User>): Promise<User> {
  // Validate required fields
  if (!userData.email || !userData.full_name) {
    throw new Error('Email and full name are required');
  }

  // Create user in database
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
}
```

### README Structure
- Project overview and features
- Prerequisites and installation
- Environment setup
- Usage examples
- API documentation
- Contributing guidelines
- License information
