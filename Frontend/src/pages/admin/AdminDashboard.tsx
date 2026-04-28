import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, LogOut, Trash2, Plus, Edit, Eye, X, Video } from 'lucide-react';
import { apiUrl, resolveMediaUrl } from '@/lib/api';
import AdminLogin from './AdminLogin';

interface GalleryImage {
  id: string;
  url: string;
  type: string;
  date: string;
}

interface BlogMedia {
  url: string;
  type: 'image' | 'video';
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  createdAt?: string;
}

// Sniff media type from URL/base64 when mediaType field isn't set
const sniffMediaType = (mediaUrl?: string, mediaType?: 'image' | 'video'): 'image' | 'video' | null => {
  if (!mediaUrl) return null;
  if (mediaType === 'video') return 'video';
  if (mediaType === 'image') return 'image';
  if (mediaUrl.startsWith('data:video')) return 'video';
  if (mediaUrl.startsWith('data:image')) return 'image';
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(mediaUrl)) return 'video';
  return 'image'; // default
};

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'blog' | 'bookings'>('gallery');

  // ── Gallery ──────────────────────────────────────────────
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);

  // ── Blog ─────────────────────────────────────────────────
  const [blogPostList, setBlogPostList] = useState<BlogPost[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogMedia, setBlogMedia] = useState<BlogMedia | null>(null);
  const [blogSaving, setBlogSaving] = useState(false);
  const blogMediaRef = useRef<HTMLInputElement>(null);

  // ── Bookings ─────────────────────────────────────────────
  const [bookings, setBookings] = useState<Booking[]>([]);

  // ── Fetch on mount ────────────────────────────────────────
  useEffect(() => {
    fetchPortfolio();
    fetchBlogs();
    fetchBookings();
  }, []);

  const fetchPortfolio = () => {
    fetch(apiUrl('/api/portfolio'))
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          url: item.url,
          type: item.type,
          date: item.createdAt?.split('T')[0] || '',
        }));
        setGalleryImages(mapped);
      })
      .catch(err => console.error('Portfolio fetch error:', err));
  };

  const fetchBlogs = () => {
    fetch(apiUrl('/api/blog'))
      .then(res => res.json())
      .then(data => setBlogPostList(Array.isArray(data) ? data : []))
      .catch(err => console.error('Blog fetch error:', err));
  };

  const fetchBookings = () => {
    fetch(apiUrl('/api/bookings'))
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) { setBookings([]); return; }
        // Sort newest first — by createdAt if available, else by date field
        const sorted = [...data].sort((a, b) => {
          const aTime = new Date(a.createdAt || a.date || 0).getTime();
          const bTime = new Date(b.createdAt || b.date || 0).getTime();
          return bTime - aTime; // descending = newest first
        });
        setBookings(sorted);
      })
      .catch(err => console.error('Bookings fetch error:', err));
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  // ── Gallery handlers ──────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
    setUploadType(fileType);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const confirmUpload = async () => {
    if (!previewImage) return;
    setUploading(true);
    try {
      const res = await fetch(apiUrl('/api/portfolio'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: previewImage, type: uploadType }),
      });
      const data = await res.json();
      if (data.error) { alert('Upload failed: ' + data.error); return; }
      setGalleryImages(prev => [{
        id: data.id,
        url: data.url,
        type: data.type,
        date: data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      }, ...prev]);
      setPreviewImage(null);
      alert('Uploaded successfully ✅');
    } catch (err) {
      console.error(err);
      alert('Upload failed — is the server running?');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await fetch(apiUrl(`/api/portfolio/${id}`), { method: 'DELETE' });
      setGalleryImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // ── Blog media handler ────────────────────────────────────
  const handleBlogMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'image';
    const reader = new FileReader();
    reader.onloadend = () => setBlogMedia({ url: reader.result as string, type });
    reader.readAsDataURL(file);
  };

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogContent('');
    setBlogMedia(null);
    setEditingPost(null);
    setShowBlogForm(false);
    if (blogMediaRef.current) blogMediaRef.current.value = '';
  };

  // ── Blog save (create + update) ───────────────────────────
  const saveBlogPost = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and content are required.');
      return;
    }
    setBlogSaving(true);

    const payload = {
      title: blogTitle.trim(),
      content: blogContent.trim(),
      mediaUrl: blogMedia?.url ?? null,
      mediaType: blogMedia?.type ?? null,
    };

    try {
      const url = editingPost
        ? apiUrl(`/api/blog/${editingPost.id}`)
        : apiUrl('/api/blog');
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Server error:', text);
        alert(`Server error ${res.status} — check your backend has the Blog model and /api/blog routes.`);
        return;
      }

      const data = await res.json();
      if (data.error) { alert(data.error); return; }

      fetchBlogs();
      resetBlogForm();
    } catch (err) {
      console.error(err);
      alert('Could not reach server. Make sure the backend is running and has Blog routes.');
    } finally {
      setBlogSaving(false);
    }
  };

  const editPost = (post: BlogPost) => {
    setEditingPost(post);
    setBlogTitle(post.title);
    setBlogContent(post.content);
    if (post.mediaUrl) {
      const type = sniffMediaType(post.mediaUrl, post.mediaType);
      setBlogMedia(type ? { url: post.mediaUrl, type } : null);
    } else {
      setBlogMedia(null);
    }
    setShowBlogForm(true);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(apiUrl(`/api/blog/${id}`), { method: 'DELETE' });
      if (!res.ok) { alert('Delete failed'); return; }
      setBlogPostList(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">

      {/* HEADER */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-semibold">Admin Dashboard</h1>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          {[
            { key: 'gallery' as const, icon: Image, label: 'Portfolio' },
            { key: 'blog' as const, icon: FileText, label: 'Blog' },
            { key: 'bookings' as const, icon: Eye, label: 'Bookings' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition ${
                activeTab === tab.key ? 'bg-black text-white' : 'border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PORTFOLIO TAB ─────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 p-4 border-2 border-dashed rounded-xl">
              <p className="text-sm text-gray-500 mb-3">Upload image or video to Portfolio</p>
              <input type="file" accept="image/*,video/*" onChange={handleImageUpload} className="mb-3" />
              {previewImage && (
                <div className="mt-4">
                  {uploadType === 'image'
                    ? <img src={resolveMediaUrl(previewImage)} className="h-40 rounded object-cover" alt="Preview" />
                    : <video src={resolveMediaUrl(previewImage)} className="h-40 rounded" controls />}
                  <div className="mt-3 flex gap-3">
                    <button onClick={confirmUpload} disabled={uploading}
                      className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
                      {uploading ? 'Uploading...' : 'Save to Portfolio'}
                    </button>
                    <button onClick={() => setPreviewImage(null)} className="px-4 py-2 border rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {galleryImages.length === 0
              ? <p className="text-gray-400 text-sm">No portfolio items yet.</p>
              : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map(img => (
                    <div key={img.id} className="relative group">
                      {img.type === 'video'
                        ? <video src={resolveMediaUrl(img.url)} className="h-40 w-full object-cover rounded" muted />
                        : <img src={resolveMediaUrl(img.url)} className="h-40 w-full object-cover rounded" alt="Portfolio item" />}
                      <button onClick={() => deleteImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={14} />
                      </button>
                      <p className="text-xs text-gray-400 mt-1">{img.type} · {img.date}</p>
                    </div>
                  ))}
                </div>
              )}
          </motion.div>
        )}

        {/* ── BLOG TAB ──────────────────────────────────────── */}
        {activeTab === 'blog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {showBlogForm ? (
              <div className="mb-6 p-5 border rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{editingPost ? 'Edit Post' : 'New Post'}</h3>
                  <button onClick={resetBlogForm}><X size={16} /></button>
                </div>

                <input
                  type="text"
                  placeholder="Post title"
                  value={blogTitle}
                  onChange={e => setBlogTitle(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                />

                <textarea
                  placeholder="Write your post content here..."
                  value={blogContent}
                  onChange={e => setBlogContent(e.target.value)}
                  rows={6}
                  className="w-full border p-2 rounded text-sm"
                />

                {/* Media Upload */}
                <div className="border-2 border-dashed rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Image size={13} /> <Video size={13} /> Attach image or video to this post (optional)
                  </p>
                  <input
                    ref={blogMediaRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleBlogMediaUpload}
                    className="text-sm"
                  />

                  {blogMedia && (
                    <div className="mt-3 relative inline-block">
                      {blogMedia.type === 'image'
                        ? <img src={resolveMediaUrl(blogMedia.url)} className="h-36 rounded object-cover" alt="Blog media" />
                        : <video src={resolveMediaUrl(blogMedia.url)} className="h-36 rounded" controls />}
                      <button
                        onClick={() => { setBlogMedia(null); if (blogMediaRef.current) blogMediaRef.current.value = ''; }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveBlogPost}
                    disabled={blogSaving}
                    className="bg-black text-white px-5 py-2 rounded disabled:opacity-50 text-sm"
                  >
                    {blogSaving ? 'Saving...' : editingPost ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button onClick={resetBlogForm} className="border px-4 py-2 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowBlogForm(true)}
                className="mb-6 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm"
              >
                <Plus size={14} /> New Post
              </button>
            )}

            {blogPostList.length === 0 ? (
              <p className="text-gray-400 text-sm">No blog posts yet.</p>
            ) : (
              blogPostList.map(post => {
                const mediaType = sniffMediaType(post.mediaUrl, post.mediaType);
                const postDate = post.createdAt || post.date;
                return (
                  <div key={post.id} className="border p-4 mb-3 rounded-xl">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-3 items-start">
                        {/* Thumbnail — shows even if mediaType wasn't saved */}
                        {mediaType === 'image' && (
                          <img
                            src={resolveMediaUrl(post.mediaUrl!)}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                            alt=""
                          />
                        )}
                        {mediaType === 'video' && (
                          <video
                            src={resolveMediaUrl(post.mediaUrl!)}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                            muted
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-sm">{post.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {postDate ? new Date(postDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            {mediaType && <span className="ml-2 capitalize text-gray-300">· {mediaType}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => editPost(post)} className="p-1 text-gray-400 hover:text-black">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deletePost(post.id)} className="p-1 text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ── BOOKINGS TAB ──────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {/* Newest first — sorted in fetchBookings() */}
                {bookings.map((b, index) => (
                  <div key={b.id} className="bg-card p-4 rounded-xl shadow border">
                    {/* Most recent badge */}
                    {index === 0 && (
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                        style={{ background: 'hsl(350,40%,95%)', color: 'hsl(350,40%,48%)' }}>
                        Most Recent
                      </span>
                    )}
                    <p><b>Name:</b> {b.name}</p>
                    <p><b>Phone:</b> {b.phone}</p>
                    <p><b>Service:</b> {b.service}</p>
                    <p><b>Date:</b> {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p><b>Time:</b> {b.timeSlot}</p>
                    {b.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Booked: {new Date(b.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;