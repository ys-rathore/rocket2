import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Upload, FileText, Download, MessageCircle, Send, Trash2, BookOpen, Filter } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
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

export function StudySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('General');
  const [uploading, setUploading] = useState(false);
  
  // Comment form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isOwnerReply, setIsOwnerReply] = useState(false);

  const categories = ['All', 'Programming', 'Mathematics', 'Data Science', 'Web Development', 'General'];

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
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes`;
      console.log('Fetching notes from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notes data:', data);
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Set empty array so UI can still render
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDescription);
      formData.append('category', uploadCategory);

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
        setUploadTitle('');
        setUploadDescription('');
        setUploadCategory('General');
        setShowUpload(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error uploading note:', error);
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

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b378ac23/notes/${noteId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        fetchNotes();
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  return (
    <section id="study" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm mb-6">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">Study Resources</span>
          </div>
          <h2 className="text-5xl md:text-6xl text-white mb-4">Study Notes</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Access shared notes, documents, and resources. Join the discussion!
          </p>
        </motion.div>

        {/* Upload Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Note
          </button>
        </motion.div>

        {/* Upload Form */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm"
          >
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Description</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">File (PDF or Document)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                  {note.category}
                </span>
              </div>
              <h3 className="text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                {note.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {note.description}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{new Date(note.uploadedAt).toLocaleDateString()}</span>
                <MessageCircle className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No notes available in this category yet.</p>
          </div>
        )}

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
              className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Note Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-3xl text-white mb-2">{selectedNote.title}</h3>
                    <p className="text-slate-400">{selectedNote.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-4">
                  <a
                    href={selectedNote.fileUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-6">
                <h4 className="text-xl text-white mb-6">Comments ({comments.length})</h4>
                
                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="mb-8 p-4 rounded-xl bg-white/5">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none mb-4"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-white">{comment.userName}</span>
                          <span className="text-slate-500 text-sm ml-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-4">{comment.content}</p>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-6 space-y-3 mb-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="p-3 rounded-lg bg-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm ${reply.isOwner ? 'text-blue-400' : 'text-white'}`}>
                                  {reply.userName}
                                  {reply.isOwner && <span className="ml-2 text-xs text-blue-400">(Owner)</span>}
                                </span>
                                <span className="text-slate-500 text-xs">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
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
                            <label htmlFor={`owner-${comment.id}`} className="text-sm text-slate-400">
                              Reply as Owner
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                                setIsOwnerReply(false);
                              }}
                              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-sm text-blue-400 hover:text-blue-300 ml-6"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}