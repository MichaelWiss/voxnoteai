import { POST } from '@/app/api/transcribe/route'
import { getServerSession } from 'next-auth'
import OpenAI from 'openai'

// Mock dependencies
jest.mock('next-auth')
jest.mock('openai')

describe('/api/transcribe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    // Mock no session
    getServerSession.mockResolvedValue(null)

    const formData = new FormData()
    const request = new Request('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 400 if no file is provided', async () => {
    // Mock authenticated session
    getServerSession.mockResolvedValue({
      user: { id: 'test-user-id', email: 'test@example.com' }
    })

    const formData = new FormData()
    const request = new Request('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('No audio file provided')
  })

  it('should successfully transcribe audio file', async () => {
    // Mock authenticated session
    getServerSession.mockResolvedValue({
      user: { id: 'test-user-id', email: 'test@example.com' }
    })

    // Mock OpenAI response
    const mockTranscription = { text: 'Hello, this is a test transcription.' }
    OpenAI.prototype.audio = {
      transcriptions: {
        create: jest.fn().mockResolvedValue(mockTranscription)
      }
    }

    // Create mock file
    const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mp3' })
    const formData = new FormData()
    formData.append('file', mockFile)

    const request = new Request('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.text).toBe('Hello, this is a test transcription.')
  })
})