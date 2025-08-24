"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Video, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  FileText, 
  Star, 
  Trash2, 
  Share2,
  Play,
  Pause,
  Volume2,
  Download,
  Eye,
  Tag,
  Zap,
  TrendingUp,
  User,
  Settings,
  Plus,
  Grid,
  List,
  ChevronDown,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  type: "text" | "audio" | "video";
  transcript: string;
  summary?: string;
  tags: string[];
  created_at: string;
  duration?: string;
  aiConfidence?: number;
  hasAction?: boolean;
}

export default function ModernDashboard() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        setNotes(data.map((note: any) => ({
          ...note,
          duration: "5:30", // Mock duration
          aiConfidence: Math.floor(Math.random() * 10) + 90, // Mock confidence
          hasAction: Math.random() > 0.6, // Mock action items
        })));
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
    
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ title: "", type: "text", transcript: "", summary: "", tags: [] });
        setAudioBlob(null);
        setShowCreateModal(false);
        fetchNotes();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }: {
    icon: any;
    label: string;
    value: string | number;
    trend?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );

  const NoteCard = ({ note }: { note: Note }) => (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              note.type === 'video' ? 'bg-purple-100 text-purple-600' : 
              note.type === 'audio' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {note.type === 'video' ? <Video className="w-5 h-5" /> : 
               note.type === 'audio' ? <Volume2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {note.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4" />
                <span>{note.duration || "5:30"}</span>
                <span>•</span>
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* AI Summary */}
        {note.summary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">AI Summary</span>
              <div className="ml-auto text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                {note.aiConfidence || 95}% confident
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{note.summary}</p>
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Items */}
        {note.hasAction && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-amber-800">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Action Items Detected</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSelectedNote(note)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Transcript</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{note.transcript.split(' ').length} words</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">VoxNote AI</h1>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span>Welcome back,</span>
                  <span className="font-semibold text-gray-900">{session?.user?.name || "User"}</span>
                  <span>👋</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notes, transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Total Notes"
            value={stats.totalNotes}
            trend="+8 this week"
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            label="Hours Recorded"
            value={`${stats.totalHours}h`}
            trend="+2.3h"
            color="bg-green-500"
          />
          <StatCard
            icon={Zap}
            label="This Week"
            value={stats.thisWeek}
            trend="+25%"
            color="bg-purple-500"
          />
          <StatCard
            icon={Sparkles}
            label="AI Accuracy"
            value={`${stats.transcriptionAccuracy}%`}
            color="bg-amber-500"
          />
        </div>

        {/* Filters & Views */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notes</h2>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="audio">Audio Only</option>
                <option value="video">Video Only</option>
                <option value="text">Text Only</option>
                <option value="action">With Actions</option>
              </select>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">This Week</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
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
              note.transcript.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Meeting with Product Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Note Type
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: "text", label: "Text Note", icon: FileText },
                    { value: "audio", label: "Voice Note", icon: Mic },
                    { value: "video", label: "Video Note", icon: Video },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Audio Recording */}
              {formData.type === "audio" && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Voice Recording</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {!isRecording && !audioBlob && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Start Recording</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                          >
                            Stop Recording
                          </button>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                            <span>Recording captured</span>
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
                            className="px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:bg-gray-400"
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
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Or upload an audio file (MP3, WAV, M4A)
                      </button>
                    </div>

                    {isTranscribing && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Transcribing audio...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Recording */}
              {formData.type === "video" && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Video Recording</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {!isRecording && !audioBlob && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Start Video Recording</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                          >
                            Stop Recording
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
                            <span>Video captured</span>
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
                            className="px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                          >
                            {isTranscribing ? "Transcribing..." : "Transcribe Video"}
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
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Or upload a video file (MP4, MOV, AVI)
                      </button>
                    </div>

                    {isTranscribing && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Extracting and transcribing audio from video...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Enter your note content or record audio/video above"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm resize-none"
                />
              </div>

              {/* Summary Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Optional summary (auto-generated for voice/video notes)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
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
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
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
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{selectedNote.title}</h2>
                <button 
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Transcript</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedNote.transcript}</p>
                </div>
                
                {selectedNote.summary && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Summary</h3>
                    <p className="text-blue-800">{selectedNote.summary}</p>
                  </div>
                )}
                
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
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
