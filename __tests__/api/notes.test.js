import { GET, POST } from '@/app/api/notes/route'
import { getServerSession } from 'next-auth'

// Mock Supabase admin
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          // Mock successful response
          data: [{ id: '1', title: 'Test Note', user_id: 'test-user' }],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: '1', title: 'New Note', user_id: 'test-user' },
            error: null
          }))
        }))
      }))
    }))
  }
}))

describe('/api/notes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      getServerSession.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return user notes when authenticated', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'test-user-id', email: 'test@example.com' }
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('POST', () => {
    it('should create a new note', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'test-user-id', email: 'test@example.com' }
      })

      const request = new Request('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Note',
          type: 'text',
          transcript: 'Test transcript'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('New Note')
    })
  })
})