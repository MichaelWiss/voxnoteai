"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { 
  Mic, 
  Video, 
  Clock, 
  FileText, 
  Volume2,
  Eye,
  Zap,
  Grid,
  List,
  Sparkles,
  X
} from 'lucide-react';

interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  type?: string;
  file_url?: string;
  transcript?: string;
  summary?: string;
  media_url?: string;
  tags?: string[];
}

export default function ModernDashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const { searchQuery, showCreateModal, setShowCreateModal } = useDashboard();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: "",
    type: "text" as "text" | "audio" | "video",
    transcript: "",
    summary: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock stats for demonstration
  const stats = {
    totalNotes: notes.length || 127,
    totalHours: "45.2",
    thisWeek: 12,
    transcriptionAccuracy: 94
  };

  // Fetch notes on component mount
  useEffect(() => {
    if (session?.user) {
      fetchNotes();
    }
  }, [session]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/api/auth/sign-in");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const startRecording = async () => {
    try {
      const isVideoMode = formData.type === "video";
      const constraints = isVideoMode 
        ? { audio: true, video: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const mimeType = isVideoMode ? "video/webm" : "audio/wav";
        const recordingBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(recordingBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (file: Blob) => {
    setIsTranscribing(true);
    const formDataToSend = new FormData();
    formDataToSend.append("file", file, "recording.wav");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          transcript: data.text,
          summary: data.text.substring(0, 200) + (data.text.length > 200 ? "..." : "")
        }));
      }
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        setFormData(prev => ({ ...prev, type: "audio" }));
        await transcribeAudio(file);
      } else if (file.type.startsWith("video/")) {
        setFormData(prev => ({ ...prev, type: "video" }));
        await transcribeAudio(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      console.error("No user session found or user ID missing");
      return;
    }
    
    try {
      const noteData = {
        ...formData,
        user_id: session.user.id, // Use UUID from session, not email
      };
      
      console.log("Sending note data:", noteData); // Debug log
      
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      console.log("Response status:", response.status); // Debug log

      if (response.ok) {
        const responseData = await response.json();
        console.log("Note created successfully:", responseData);
        setFormData({ title: "", type: "text", transcript: "", summary: "", tags: [] });
        setNewTag("");
        setAudioBlob(null);
        setShowCreateModal(false);
        fetchNotes();
      } else {
        const errorText = await response.text();
        console.error("Error response status:", response.status);
        console.error("Error response text:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error("Error creating note (parsed):", errorData);
        } catch (parseError) {
          console.error("Could not parse error response as JSON:", parseError);
          console.error("Raw error response:", errorText);
        }
      }
    } catch (error) {
      console.error("Network or other error creating note:", error);
    }
  };

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="bg-white border-r border-b p-8 hover:opacity-90 transition-opacity" style={{ borderColor: '#acaca9' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: '#545268' }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: '#333328' }}>{value}</p>
        </div>
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8" style={{ color: '#fa6147' }} />
        </div>
      </div>
    </div>
  );
}  const NoteCard = ({ note }: { note: Note }) => (
    <div className="bg-white border hover:opacity-90 transition-opacity group" style={{ borderColor: '#acaca9' }}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#333328' }}>
              {note.type === 'video' ? <Video className="w-4 h-4" style={{ color: '#e5e5df' }} /> : 
               note.type === 'audio' ? <Volume2 className="w-4 h-4" style={{ color: '#e5e5df' }} /> : <FileText className="w-4 h-4" style={{ color: '#e5e5df' }} />}
            </div>
            <div>
              <h3 className="font-normal group-hover:opacity-80 transition-opacity" style={{ color: '#333328' }}>{note.title}</h3>
              <div className="flex items-center space-x-2 text-xs mt-1" style={{ color: '#545268' }}>
                <Clock className="w-3 h-3" />
                <span>5:30</span>
                <span>•</span>
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedNote(note)}
            className="opacity-0 group-hover:opacity-100 p-2 hover:opacity-80 transition-all"
          >
            <Eye className="w-4 h-4" style={{ color: '#545268' }} />
          </button>
        </div>

        {/* Content Preview */}
        <div className="mb-6">
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#545268' }}>
            {note.summary || (note.transcript ? note.transcript.substring(0, 120) + (note.transcript.length > 120 ? "..." : "") : "")}
          </p>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-normal"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-normal">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
          <button 
            onClick={() => setSelectedNote(note)}
            className="text-xs font-normal text-black hover:text-neutral-700 transition-colors"
          >
            View Details
          </button>
          <div className="flex items-center space-x-1 text-neutral-400">
            <Eye className="w-3 h-3" />
            <span className="text-xs">{note.transcript ? note.transcript.split(' ').length : 0} words</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e5e5df' }}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid - Exact Sunrise Robotics style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-20 border" style={{ borderColor: '#acaca9' }}>
          <StatCard
            icon={FileText}
            label="Total Notes"
            value={stats.totalNotes}
          />
          <StatCard
            icon={Clock}
            label="Hours Recorded"
            value={`${stats.totalHours}h`}
          />
          <StatCard
            icon={Zap}
            label="This Week"
            value={stats.thisWeek}
          />
          <StatCard
            icon={Sparkles}
            label="AI Accuracy"
            value={`${stats.transcriptionAccuracy}%`}
          />
        </div>

        {/* Content Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-8">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: '#333328' }}>Notes</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm"
              >
                <option value="all">All Types</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}>
          {notes
            .filter(note => selectedFilter === 'all' || note.type === selectedFilter)
            .filter(note => 
              searchQuery === '' || 
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">Create your first note to get started</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Note
            </button>
          </div>
        )}

        {/* Load More */}
        {notes.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Notes
            </button>
          </div>
        )}
      </main>

      {/* Create Note Modal - Exact Sunrise Robotics colors */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(51, 51, 40, 0.2)' }}>
          <div className="bg-white border max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: '#acaca9' }}>
            <div className="p-6 border-b" style={{ borderColor: '#acaca9' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#333328' }}>Create Note</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 transition-colors"
                  style={{ color: '#545268' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#333328'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#545268'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333328' }}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Meeting notes, project ideas..."
                  className="w-full px-4 py-3 border bg-white transition-all"
                  style={{ 
                    borderColor: '#acaca9',
                    color: '#333328'
                  }}
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#333328' }}>
                  Type
                </label>
                <div className="flex space-x-6">
                  {[
                    { value: "text", label: "Text", icon: FileText },
                    { value: "audio", label: "Audio", icon: Mic },
                    { value: "video", label: "Video", icon: Video },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                        style={{ accentColor: '#fa6147' }}
                      />
                      <type.icon className="w-5 h-5 group-hover:opacity-80 transition-opacity" style={{ color: '#545268' }} />
                      <span className="text-sm font-medium group-hover:opacity-80 transition-opacity" style={{ color: '#545268' }}>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Audio Recording */}
              {formData.type === "audio" && (
                <div className="bg-neutral-50 border border-neutral-200 p-6">
                  <h3 className="text-sm font-medium text-neutral-800 mb-4">Audio Recording</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {!isRecording && !audioBlob && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span>Record</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Stop
                          </button>
                          <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Recording...</span>
                          </div>
                        </div>
                      )}

                      {audioBlob && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-sm text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Recorded</span>
                          </div>
                          <button
                              type="button"
                            onClick={() => {
                              setAudioBlob(null);
                              setFormData(prev => ({ ...prev, transcript: "", summary: "" }));
                            }}
                            className="text-sm text-neutral-500 hover:text-neutral-700"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => transcribeAudio(audioBlob)}
                            disabled={isTranscribing}
                            className="px-3 py-1 bg-neutral-700 text-white text-sm hover:bg-neutral-600 disabled:bg-neutral-400"
                          >
                            {isTranscribing ? "Transcribing..." : "Transcribe"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 border border-dashed border-neutral-300 text-sm text-neutral-600 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        Upload audio file (MP3, WAV, M4A)
                      </button>
                    </div>

                    {isTranscribing && (
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600"></div>
                        <span>Transcribing...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Recording */}
              {formData.type === "video" && (
                <div className="bg-gray-50 rounded-sm p-6 border border-gray-100">
                  <h3 className="text-sm font-medium text-neutral-800 mb-4">Video Recording</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {!isRecording && !audioBlob && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 text-white text-sm font-medium hover:bg-neutral-600 transition-colors"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Record Video</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700 transition-colors"
                          >
                            Stop
                          </button>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Recording video...</span>
                          </div>
                        </div>
                      )}

                      {audioBlob && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-sm text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Video recorded</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAudioBlob(null);
                              setFormData(prev => ({ ...prev, transcript: "", summary: "" }));
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => transcribeAudio(audioBlob)}
                            disabled={isTranscribing}
                            className="px-3 py-1 bg-neutral-700 text-white text-sm hover:bg-neutral-600 disabled:bg-neutral-400"
                          >
                            {isTranscribing ? "Transcribing..." : "Transcribe"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-sm text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Upload video file (MP4, MOV, AVI)
                      </button>
                    </div>

                    {isTranscribing && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>Extracting and transcribing audio...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Field */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Content
                </label>
                <textarea
                  name="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Enter your note content or record audio/video above"
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm text-black placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black transition-all text-sm resize-none"
                />
              </div>

              {/* Summary Field */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Optional summary"
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm text-black placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black transition-all text-sm resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-sm text-black placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                >
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Viewer Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedNote.title}</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Created: {new Date(selectedNote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedNote(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {selectedNote.transcript && (
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Transcript</h3>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedNote.transcript}</p>
                  </div>
                )}
                
                {selectedNote.summary && (
                  <div className="bg-brand-50 rounded-lg p-6 border border-brand-100">
                    <h3 className="text-sm font-semibold text-brand-900 mb-3">Summary</h3>
                    <p className="text-sm text-brand-800 leading-relaxed">{selectedNote.summary}</p>
                  </div>
                )}
                
                {(selectedNote.file_url || selectedNote.media_url) && (
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <h3 className="text-sm font-semibold text-purple-900 mb-3">
                      {selectedNote.type === 'video' ? 'Video' : 'Audio'} File
                    </h3>
                    <p className="text-sm text-purple-700">
                      File: {selectedNote.file_url || selectedNote.media_url}
                    </p>
                  </div>
                )}
                
                {(selectedNote.file_url || selectedNote.media_url) && (
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <h3 className="text-sm font-semibold text-purple-900 mb-3">
                      {selectedNote.type === 'video' ? 'Video' : 'Audio'} File
                    </h3>
                    <p className="text-sm text-purple-700">
                      File: {selectedNote.file_url || selectedNote.media_url}
                    </p>
                  </div>
                )}
                
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm border border-slate-200 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}
