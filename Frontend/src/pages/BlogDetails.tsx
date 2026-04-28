import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import salonInterior from '@/assets/salon-interior.jpg';
import { apiUrl, resolveMediaUrl } from '@/lib/api';

interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  date?: string;
  createdAt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

// Sniff media type from base64 or URL when mediaType field isn't saved
const getMediaType = (p: BlogPost): 'image' | 'video' | null => {
  if (!p.mediaUrl) return null;
  if (p.mediaType === 'video') return 'video';
  if (p.mediaType === 'image') return 'image';
  if (p.mediaUrl.startsWith('data:video')) return 'video';
  if (p.mediaUrl.startsWith('data:image')) return 'image';
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(p.mediaUrl)) return 'video';
  return 'image';
};

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return; }

    fetch(apiUrl('/api/blog'))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((allPosts: BlogPost[]) => {
        console.log('[BlogDetail] fetched posts count:', allPosts.length);
        console.log('[BlogDetail] looking for id:', id);
        const found = allPosts.find(p => {
          const postId = p.id || p._id;
          console.log('[BlogDetail] comparing:', postId, '===', id, '->', postId === id);
          return postId === id;
        });
        if (found) setPost(found);
        else { console.warn('[BlogDetail] no matching post found'); setError(true); }
        setLoading(false);
      })
      .catch(err => {
        console.error('[BlogDetail] fetch failed:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const displayDate = post?.date || post?.createdAt;

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <img src={salonInterior} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(30,20%,97%)]/90" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {loading && (
          <div className="text-center py-20 text-muted-foreground font-body">Loading...</div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-foreground mb-2">Post not found</p>
            <p className="font-body text-muted-foreground text-sm">
              It may have been removed or the link is incorrect.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to all posts
            </Link>
          </div>
        )}

        {post && (() => {
          const mediaType = getMediaType(post);
          return (
            <article
              className="rounded-2xl overflow-hidden"
              style={{ background: 'hsl(var(--card))', boxShadow: 'var(--shadow-soft)' }}
            >
              {/* Image — fixed black bar issue: use object-fit contain inside a
                  neutral bg so we see the full image without letterboxing */}
              {mediaType === 'image' && (
                <div
                  className="w-full overflow-hidden flex items-center justify-center"
                  style={{
                    maxHeight: '520px',
                    minHeight: '280px',
                    background: 'hsl(30,15%,12%)', // dark neutral — hides any leftover padding elegantly
                  }}
                >
                  <img
                    src={resolveMediaUrl(post.mediaUrl!)}
                    alt={post.title}
                    className="w-full"
                    style={{
                      maxHeight: '520px',
                      objectFit: 'contain',   // show full image, no cropping
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              {mediaType === 'video' && (
                <div className="w-full bg-black">
                  <video
                    src={resolveMediaUrl(post.mediaUrl!)}
                    controls
                    className="w-full max-h-[520px] object-contain"
                  />
                </div>
              )}

              <div className="p-8 md:p-12">
                {displayDate && (
                  <p className="text-xs text-muted-foreground font-body mb-4 uppercase tracking-wider">
                    {new Date(displayDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                )}
                <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-6 leading-snug">
                  {post.title}
                </h1>
                <div className="font-body text-foreground/80 leading-relaxed whitespace-pre-line text-base">
                  {post.content}
                </div>
              </div>
            </article>
          );
        })()}
      </div>
    </div>
  );
};

export default BlogDetail;