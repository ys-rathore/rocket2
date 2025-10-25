import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Upload, FileText, Download, MessageCircle, Send, X, BookOpen, Filter, User, Calendar, Eye, ArrowLeft, Plus, FileUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Navigation } from './Navigation';

interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  views?: number;
}

interface Comment {
  id: string;
  noteId: string;
  userName: string;
  userEmail?: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  userName: string;
  content: string;
  isOwner: boolean;
  createdAt: string;
}

export function StudyPage({ isDark, onThemeToggle }: { isDark: boolean; onThemeToggle: () => void }) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-uploads' | 'create'>('browse');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Create form state
  const [createMode, setCreateMode] = useState<'document' | 'pdf'>('document');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [uploaderName, setUploaderName] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Comment state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isOwnerReply, setIsOwnerReply] = useState(false);

  const categories = ['All', 'Programming', 'Mathematics', 'Data Science', 'Web Development', 'AI/ML', 'General'];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (selectedNote) {
      fetchComments(selectedNote.id);
    }
  }, [selectedNote]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  const fetchComments = async (noteId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes/${noteId}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !uploaderName) return;
    if (createMode === 'pdf' && !uploadFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      if (uploadFile) formData.append('file', uploadFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('uploadedBy', uploaderName);
      formData.append('type', createMode);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );

      if (response.ok) {
        setUploadFile(null);
        setTitle('');
        setDescription('');
        setContent('');
        setCategory('General');
        setUploaderName('');
        setActiveTab('browse');
        fetchNotes();
      }
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !commentName || !commentContent) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes/${selectedNote.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: commentName,
            userEmail: commentEmail,
            content: commentContent
          })
        }
      );

      if (response.ok) {
        setCommentName('');
        setCommentEmail('');
        setCommentContent('');
        fetchComments(selectedNote.id);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyContent) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/comments/${commentId}/reply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: isOwnerReply ? 'Yuvraj Singh Rathore' : commentName,
            content: replyContent,
            isOwner: isOwnerReply
          })
        }
      );

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        setIsOwnerReply(false);
        if (selectedNote) fetchComments(selectedNote.id);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300`}>
      <Navigation isDark={isDark} onThemeToggle={onThemeToggle} />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.location.href = '/'}
            className={`inline-flex items-center gap-2 mb-6 ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
            } transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${
              isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'
            } flex items-center justify-center`}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Study Hub</h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Share knowledge, collaborate, and learn together
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {[
            { id: 'browse', label: 'Browse Notes', icon: BookOpen },
            { id: 'create', label: 'Create Note', icon: Plus }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? `${isDark ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                  : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? `${isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`
                      : `${isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-black/5 text-slate-600 hover:bg-black/10'}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedNote(note)}
                  className={`group p-6 rounded-2xl border ${
                    isDark 
                      ? 'border-white/10 bg-white/5 hover:border-blue-500/50' 
                      : 'border-black/10 bg-black/5 hover:border-blue-600/50'
                  } cursor-pointer transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${
                      isDark ? 'bg-blue-500/10' : 'bg-blue-600/10'
                    } flex items-center justify-center`}>
                      <FileText className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-600/20 text-blue-700'
                    }`}>
                      {note.category}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl mb-2 ${
                    isDark ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'
                  } transition-colors`}>
                    {note.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {note.description}
                  </p>
                  
                  <div className={`flex items-center justify-between text-sm ${
                    isDark ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{note.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(note.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No notes available in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto">
            <div className={`p-8 rounded-2xl border ${
              isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
            }`}>
              <h2 className="text-2xl mb-6">Create New Note</h2>
              
              {/* Type Selector */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setCreateMode('document')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    createMode === 'document'
                      ? `${isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-600 bg-blue-600/10'}`
                      : `${isDark ? 'border-white/10 hover:border-white/20' : 'border-black/10 hover:border-black/20'}`
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Document Notes</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Write content directly
                  </div>
                </button>
                <button
                  onClick={() => setCreateMode('pdf')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    createMode === 'pdf'
                      ? `${isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-600 bg-blue-600/10'}`
                      : `${isDark ? 'border-white/10 hover:border-white/20' : 'border-black/10 hover:border-black/20'}`
                  }`}
                >
                  <FileUp className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">PDF Upload</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Upload PDF files
                  </div>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                    rows={3}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {createMode === 'document' && (
                  <div>
                    <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Content *
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                          : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                      } focus:outline-none font-mono`}
                      rows={12}
                      placeholder="Write your notes here..."
                      required
                    />
                  </div>
                )}

                {createMode === 'pdf' && (
                  <div>
                    <label className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Upload PDF *
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                          : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                      } focus:outline-none`}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full px-6 py-3 rounded-full ${
                    isDark 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-all disabled:opacity-50`}
                >
                  {uploading ? 'Creating...' : 'Create Note'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedNote(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`${
              isDark ? 'bg-slate-900' : 'bg-white'
            } rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-3xl mb-2">{selectedNote.title}</h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {selectedNote.description}
                  </p>
                  <div className={`flex items-center gap-4 mt-4 text-sm ${
                    isDark ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedNote.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedNote.uploadedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedNote.content && (
                <div className={`mt-6 p-4 rounded-lg ${
                  isDark ? 'bg-white/5' : 'bg-black/5'
                } max-h-96 overflow-y-auto`}>
                  <pre className="whitespace-pre-wrap font-sans">{selectedNote.content}</pre>
                </div>
              )}

              {selectedNote.fileUrl && (
                <div className="mt-4">
                  <a
                    href={selectedNote.fileUrl}
                    download
                    className={`inline-flex items-center gap-2 px-4 py-2 ${
                      isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white rounded-full transition-all`}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="p-6">
              <h4 className="text-xl mb-6">Discussion ({comments.length})</h4>
              
              <form onSubmit={handleAddComment} className={`mb-8 p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                        : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                    } focus:outline-none`}
                  />
                </div>
                <textarea
                  placeholder="Join the discussion..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                      : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                  } focus:outline-none mb-4`}
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 px-4 py-2 ${
                    isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white rounded-full transition-all`}
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </form>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-xl ${
                    isDark ? 'bg-white/5' : 'bg-black/5'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={isDark ? 'text-white' : 'text-black'}>
                          {comment.userName}
                        </span>
                        <span className={`text-sm ml-2 ${
                          isDark ? 'text-slate-500' : 'text-slate-600'
                        }`}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {comment.content}
                    </p>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 space-y-3 mb-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className={`p-3 rounded-lg ${
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm ${
                                reply.isOwner 
                                  ? (isDark ? 'text-blue-400' : 'text-blue-600')
                                  : (isDark ? 'text-white' : 'text-black')
                              }`}>
                                {reply.userName}
                                {reply.isOwner && (
                                  <span className={`ml-2 text-xs ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}>
                                    (Owner)
                                  </span>
                                )}
                              </span>
                              <span className={`text-xs ${
                                isDark ? 'text-slate-500' : 'text-slate-600'
                              }`}>
                                {new Date(reply.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === comment.id ? (
                      <div className="ml-6 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`owner-${comment.id}`}
                            checked={isOwnerReply}
                            onChange={(e) => setIsOwnerReply(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <label 
                            htmlFor={`owner-${comment.id}`} 
                            className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                          >
                            Reply as Owner
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              isDark 
                                ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                                : 'bg-black/5 border-black/10 text-black focus:border-blue-600'
                            } focus:outline-none`}
                          />
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className={`px-4 py-2 ${
                              isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white rounded-lg`}
                          >
                            Send
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                              setIsOwnerReply(false);
                            }}
                            className={`px-4 py-2 ${
                              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
                            } rounded-lg`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className={`text-sm ml-6 ${
                          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {comments.length === 0 && (
                <div className={`text-center py-10 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No comments yet. Start the discussion!</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
