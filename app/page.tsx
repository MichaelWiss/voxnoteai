"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mic, Video, FileText, Sparkles, Zap, Clock } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/signin');
    }
  };

  const handleCreateNote = () => {
    if (session) {
      router.push('/dashboard?create=true');
    } else {
      router.push('/api/auth/signin');
    }
  };

  return (
    <div className="min-h-screen landing-page" style={{ backgroundColor: '#e5e5df' }}>
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6" style={{ color: '#333328' }}>
              VoxNote AI
            </h1>
            <p className="text-xl sm:text-2xl mb-4" style={{ color: '#545268' }}>
              Voice notes and transcriptions made easy
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#545268' }}>
              Record, transcribe, and organize your thoughts with AI-powered voice notes. 
              Perfect for meetings, ideas, and quick captures.
            </p>
            
            <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 font-semibold transition-all hover:opacity-90 text-lg"
                style={{ backgroundColor: '#fa6147', color: '#e5e5df' }}
              >
                {session ? 'Go to Dashboard' : 'Get Started'}
              </button>
              <button
                onClick={handleCreateNote}
                className="px-8 py-4 font-semibold border-2 transition-all hover:opacity-90 text-lg"
                style={{ 
                  borderColor: '#fa6147', 
                  color: '#fa6147', 
                  backgroundColor: 'transparent' 
                }}
              >
                {session ? 'Create Note' : 'Try Demo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#333328' }}>
              Powerful Features
            </h2>
            <p className="text-lg" style={{ color: '#545268' }}>
              Everything you need to capture and organize your voice notes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t" style={{ borderColor: '#acaca9' }}>
            <FeatureCard
              icon={Mic}
              title="Voice Recording"
              description="High-quality audio recording with real-time feedback and easy controls."
            />
            <FeatureCard
              icon={Video}
              title="Video Notes"
              description="Record video notes with synchronized audio transcription for complete capture."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Transcription"
              description="Powered by OpenAI Whisper for accurate, fast transcription in multiple languages."
            />
            <FeatureCard
              icon={FileText}
              title="Smart Organization"
              description="Tag and categorize your notes with intelligent search and filtering."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Access"
              description="Quick capture from anywhere with smart navigation and seamless syncing."
            />
            <FeatureCard
              icon={Clock}
              title="Time Stamped"
              description="Every note is timestamped and searchable with full context preservation."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t" style={{ borderColor: '#acaca9' }}>
            <StatCard
              label="Transcription Accuracy"
              value="99%+"
              description="AI-powered accuracy"
            />
            <StatCard
              label="Processing Speed"
              value="< 10s"
              description="Average transcription time"
            />
            <StatCard
              label="Supported Formats"
              value="Audio & Video"
              description="Multiple file types"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#333328' }}>
            Ready to get started?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#545268' }}>
            Join thousands of users who trust VoxNote AI for their voice note needs.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-4 font-semibold transition-all hover:opacity-90 text-xl"
            style={{ backgroundColor: '#fa6147', color: '#e5e5df' }}
          >
            {session ? 'Open Dashboard' : 'Start Recording'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white border-r border-b p-8 hover:opacity-90 transition-opacity" style={{ borderColor: '#acaca9' }}>
      <div className="mb-6">
        <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#333328' }}>
          <Icon className="w-6 h-6" style={{ color: '#e5e5df' }} />
        </div>
        <h3 className="text-xl font-semibold mb-3" style={{ color: '#333328' }}>
          {title}
        </h3>
        <p className="text-base leading-relaxed" style={{ color: '#545268' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  description 
}: { 
  label: string; 
  value: string; 
  description: string; 
}) {
  return (
    <div className="bg-white border-r border-b p-8 text-center hover:opacity-90 transition-opacity" style={{ borderColor: '#acaca9' }}>
      <div className="mb-2">
        <p className="text-4xl font-bold mb-2" style={{ color: '#fa6147' }}>{value}</p>
        <p className="text-lg font-medium mb-1" style={{ color: '#333328' }}>{label}</p>
        <p className="text-sm" style={{ color: '#545268' }}>{description}</p>
      </div>
    </div>
  );
}
