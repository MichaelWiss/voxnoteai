# VoxNote AI - Project Discipline Guide

## Overview

This document establishes standards and protocols for maintaining consistency across the VoxNote AI project, ensuring all development aligns with our four foundational documents: Requirements.md, Styleguide.md, Tasks.md, and Style.md.

## Core Principle

**All decisions must reference and align with the established documentation.** Any deviations must be explicitly noted and documented.

## Documentation Discipline

### Document Change Management

Each documentation file should include version tracking:

```markdown
## Document Version Control
- Last Updated: [Date]
- Updated By: [Name] 
- Changes: [Brief description]
- Next Review: [Date]
```

### Cross-Reference Validation

Before making any changes, verify consistency across all four documents:

- **Schema Changes** → Update Requirements.md, Styleguide.md (interfaces), and Tasks.md
- **Color/Design Changes** → Update Style.md and verify against existing components
- **Feature Additions** → Update Tasks.md status and Requirements.md if scope changes
- **Component Changes** → Update Styleguide.md patterns and Style.md if visual impact

### Documentation Integrity Checks

**Weekly Review Cycle:**
- Verify Tasks.md reflects actual progress
- Check if new components follow Styleguide.md patterns
- Ensure Style.md matches implemented designs
- Validate Requirements.md against current codebase

**Monthly Architecture Review:**
- Assess if current schema still optimal
- Review color palette effectiveness  
- Evaluate component reusability
- Consider performance optimizations

## Development Discipline

### Pre-Implementation Checklist

Before coding any feature, verify:

```markdown
□ Feature exists in Tasks.md roadmap
□ Technical requirements documented in Requirements.md  
□ Component patterns defined in Styleguide.md
□ Visual specifications in Style.md
□ Database changes align with current schema
□ Video AND voice functionality considered
□ TypeScript interfaces defined and current
```

### Code Review Standards

Every pull request must verify:

```markdown
□ Follows Styleguide.md naming conventions
□ Uses documented TypeScript interfaces
□ Implements Style.md color palette (#e5e5df, #fa6147, etc.)
□ Maintains video/voice parity where applicable
□ Updates relevant documentation if needed
□ Meets Requirements.md performance benchmarks
□ Follows established file organization structure
```

### Implementation Standards

**Color Usage:**
- Background: `#e5e5df` (warm beige)
- Primary Text: `#333328` (dark brown)
- Accent: `#fa6147` (orange-red)
- Borders: `#acaca9` (light gray)
- Always reference Style.md for complete palette

**Layout Consistency:**
- Full-width header + main content (no sidebar)
- Max-width containers: `max-w-7xl mx-auto`
- Consistent padding: `px-6` for containers
- Follow Style.md responsive patterns

**Component Development:**
- Use established TypeScript interfaces from Styleguide.md
- Follow PascalCase for components, camelCase for utilities
- Ensure video AND audio support where applicable
- Implement accessibility patterns from Style.md

## File Organization Discipline

### Directory Structure

Follow Styleguide.md organization:

```
components/
├── ui/           # Base components (Button, Input, Card)
├── media/        # Video/audio players, waveforms  
├── recording/    # Recording controls, indicators
└── forms/        # Note forms, tag inputs

lib/
├── [domain].ts   # Single responsibility utilities
└── types/        # Centralized type definitions

app/
├── api/          # API routes following REST patterns
├── dashboard/    # Protected dashboard pages
└── auth/         # Authentication pages
```

### File Naming Standards

Based on Styleguide.md conventions:

- **Components**: PascalCase (`MediaPlayer.tsx`)
- **Pages**: lowercase with kebab-case (`sign-in/page.tsx`)
- **API Routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`formatDuration.ts`)
- **Types**: Match database schema (`Note`, `User`, `Tag`)
- **Props Interfaces**: ComponentNameProps (`MediaPlayerProps`)

### New File Creation Protocol

1. Determine appropriate directory based on Styleguide.md structure
2. Follow established naming conventions
3. Include proper TypeScript types
4. Implement Style.md design patterns
5. Consider video/audio functionality requirements
6. Update relevant documentation if adding new patterns

## Schema Discipline

### Database Change Protocol

For any schema modifications:

1. **Requirements.md**: Update database section with new fields/tables
2. **types/index.d.ts**: Update TypeScript interfaces to match schema
3. **API Routes**: Modify affected endpoints to handle new fields
4. **Testing**: Verify with both video AND audio data
5. **Tasks.md**: Update if new features are enabled by schema changes
6. **Migration**: Document any required data migrations

### API Consistency Standards

All endpoints must:

- Follow `/api/[resource]/[id]` pattern from Requirements.md
- Handle both video and audio file types appropriately
- Use documented error response formats
- Maintain authentication requirements as specified
- Return data matching TypeScript interfaces
- Meet performance benchmarks (< 500ms for CRUD operations)

### Data Integrity Rules

- Always use UUID primary keys as documented
- Maintain foreign key relationships per schema
- Ensure video and audio files use appropriate fields (`file_url`, `media_url`, `type`)
- Validate file types and sizes according to Requirements.md limits
- Implement proper user data isolation

## Testing Discipline

### Feature Testing Requirements

Every feature must be tested with:

```markdown
□ Video file upload/playback functionality
□ Audio file upload/playback functionality  
□ Mobile responsive design (Style.md breakpoints)
□ Keyboard navigation accessibility
□ Screen reader compatibility
□ Performance benchmarks from Requirements.md
□ Cross-browser compatibility (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
```

### Performance Monitoring

Track against Requirements.md benchmarks:

- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms for CRUD operations
- **Video/Audio Transcription**: < 30 seconds for files under 10MB
- **Video Playback**: < 3 seconds initial load time

### Test Coverage Requirements

- **Unit Tests**: All utility functions and components
- **Integration Tests**: API routes and database operations
- **E2E Tests**: Complete user workflows for video and audio notes
- **Accessibility Tests**: WCAG 2.1 AA compliance verification

## Communication Discipline

### Issue Documentation Standards

Bug reports should include:

```markdown
## Bug Report Template
- **Affected Component/Feature**: [Reference Styleguide.md section]
- **Documentation Reference**: [Which doc section applies]
- **Media Type**: [Video/Audio/Both/Text]
- **Steps to Reproduce**: [Detailed steps]
- **Expected Behavior**: [Reference Requirements.md if applicable]
- **Actual Behavior**: [What happened instead]
- **Environment**: [Browser, device, etc.]
- **Screenshots/Videos**: [If applicable]
```

### Feature Request Protocol

New feature requests must:

```markdown
## Feature Request Template
- **Tasks.md Priority**: [Where does this fit in current roadmap?]
- **Requirements Impact**: [Does this change technical requirements?]
- **Video/Audio Considerations**: [How does this apply to both media types?]
- **UI/UX Requirements**: [Reference Style.md design system]
- **Database Impact**: [Any schema changes needed?]
- **Development Effort**: [Estimate based on Styleguide.md patterns]
- **User Value**: [Why is this important?]
```

### Code Review Communication

- Reference specific documentation sections when suggesting changes
- Explain deviations from established patterns
- Ensure video/audio parity is maintained
- Verify accessibility considerations are addressed
- Check performance impact against benchmarks

## Automation and Tooling

### Git Hooks

Implement pre-commit hooks to enforce:

```bash
# Pre-commit checks
- TypeScript type checking
- ESLint rules from Styleguide.md
- Color value validation against Style.md palette
- Video/audio parity verification in new features
- Documentation link validation
```

### Documentation Linting

Regular automated checks for:

- Broken cross-references between documents
- Outdated schema information in Requirements.md
- Inconsistent terminology (video vs. voice vs. audio)
- Missing TypeScript interfaces for new components
- Style.md compliance in component implementations

### Continuous Integration

CI pipeline should verify:

- All tests pass (unit, integration, E2E)
- Performance benchmarks are met
- Accessibility standards are maintained
- Documentation is up to date
- TypeScript interfaces match database schema

## Quick Reference Standards

### Essential Project Constants

```typescript
// Colors (from Style.md)
const COLORS = {
  background: '#e5e5df',
  primaryText: '#333328', 
  secondaryText: '#545268',
  accent: '#fa6147',
  accentHover: '#e5533a',
  border: '#acaca9',
  cardBg: '#ffffff'
};

// Breakpoints (from Style.md)
const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Performance Targets (from Requirements.md)
const PERFORMANCE = {
  pageLoad: 2000, // ms
  apiResponse: 500, // ms
  transcription: 30000, // ms
  videoPlayback: 3000 // ms
};
```

### Development Workflow

1. **Plan**: Check Tasks.md for feature priority and scope
2. **Design**: Reference Style.md for visual patterns and colors
3. **Architect**: Use Requirements.md for technical constraints and schema
4. **Code**: Follow Styleguide.md patterns and conventions
5. **Test**: Verify video AND audio functionality
6. **Review**: Ensure all documentation standards are met
7. **Deploy**: Validate performance benchmarks
8. **Document**: Update relevant docs with any changes

### Common Patterns

**Component Creation:**
```typescript
// Follow Styleguide.md interface patterns
interface MediaPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'audio';
  transcript?: string;
}

// Use Style.md color constants
const styles = {
  container: { backgroundColor: COLORS.background },
  accent: { color: COLORS.accent }
};
```

**API Route Development:**
```typescript
// Follow Requirements.md endpoint patterns
// Support both video and audio
// Use documented error handling
// Maintain authentication
// Return typed responses
```

## Enforcement and Accountability

### Review Requirements

- **All PRs** must pass documentation compliance checks
- **New features** require documentation updates
- **Schema changes** need cross-document validation
- **Design changes** must update Style.md

### Team Responsibilities

**Developers:**
- Reference all four documents before coding
- Maintain video/audio parity in features
- Follow established patterns and conventions
- Update documentation when making changes

**Reviewers:**
- Verify documentation compliance
- Check cross-reference consistency
- Ensure accessibility standards are met
- Validate performance considerations

**Project Leads:**
- Maintain documentation currency
- Resolve documentation conflicts
- Approve deviations from established standards
- Coordinate cross-document updates

## Continuous Improvement

This discipline guide should be:

- **Reviewed monthly** for effectiveness
- **Updated** when new patterns emerge
- **Simplified** if processes become burdensome
- **Enhanced** based on team feedback and project evolution

The goal is to maintain consistency and quality while enabling productive development of VoxNote AI's video and voice note management capabilities.
