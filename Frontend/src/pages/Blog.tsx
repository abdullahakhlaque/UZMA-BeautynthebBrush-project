import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import salonInterior from '@/assets/salon-interior.jpg';
import { apiUrl, resolveMediaUrl } from '@/lib/api';

interface BlogPost {
  id: string;
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  date?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/blog'))
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Blog fetch error:', err);
        setError('Could not load posts. Make sure the backend server is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img src={salonInterior} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(30,20%,97%)]/92" />
      </div>

      {/* Hero Banner */}
      <div className="relative h-52 md:h-64 flex items-center justify-center overflow-hidden">
        <img src={salonInterior} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4">
          <p className="font-accent text-white/70 tracking-[0.2em] uppercase text-sm mb-2">Latest</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">Our Blog</h1>
          <p className="font-body text-white/70 mt-3 max-w-lg mx-auto">
            Tips, trends, and behind-the-scenes from our studio.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">

          {loading && (
            <div className="text-center py-20 text-muted-foreground font-body">
              Loading posts...
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="font-body text-red-500 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground text-lg">No blog posts yet.</p>
              <p className="font-body text-muted-foreground text-sm mt-2">
                Add posts from the admin panel at <code className="bg-gray-100 px-1 rounded">/admin</code>
              </p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => {
                // support both `id` and `_id` from backend
                const postId = post.id || post._id;
                const postDate = post.createdAt || post.date;

                return (
                  <motion.article
                    key={postId}
                    variants={cardVariants}
                    className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                    style={{ background: 'hsl(var(--card))', boxShadow: 'var(--shadow-soft)' }}
                  >
                    {/* ✅ Entire card is a link */}
                    <Link to={`/blog/${postId}`} className="block h-full">

                      {/* Media */}
                      {post.mediaUrl ? (
                        <div className="h-52 overflow-hidden">
                          {post.mediaType === 'video' ? (
                            <video
                              src={resolveMediaUrl(post.mediaUrl)}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={resolveMediaUrl(post.mediaUrl)}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="h-32 bg-gradient-to-br from-[hsl(350,30%,92%)] to-[hsl(30,20%,90%)]" />
                      )}

                      <div className="p-6">
                        {postDate && (
                          <p className="text-xs text-muted-foreground font-body mb-3 uppercase tracking-wider">
                            {new Date(postDate).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                        )}
                        <h2 className="font-heading text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300 leading-snug">
                          {post.title}
                        </h2>
                        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-4">
                          {post.content}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all duration-300">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Blog;