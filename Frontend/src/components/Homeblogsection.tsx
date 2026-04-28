import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiUrl, resolveMediaUrl } from '@/lib/api';

interface BlogPost {
  id?: string;
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

// Same media-type sniffing as BlogDetail so images always show
const sniffMediaType = (post: BlogPost): 'image' | 'video' | null => {
  if (!post.mediaUrl) return null;
  if (post.mediaType === 'video') return 'video';
  if (post.mediaType === 'image') return 'image';
  if (post.mediaUrl.startsWith('data:video')) return 'video';
  if (post.mediaUrl.startsWith('data:image')) return 'image';
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(post.mediaUrl)) return 'video';
  return 'image';
};

const HomeBlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/api/blog'))
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPosts(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="section-padding bg-[hsl(30,20%,97%)]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="font-accent text-primary/70 tracking-[0.25em] uppercase text-xs mb-3">
            From Our Studio
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            Latest from the Blog
          </h2>
          <div className="mt-4 mx-auto w-16 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, hsl(350,45%,62%), hsl(35,55%,58%))' }} />
        </div>

        {/* 4-card grid — matches portfolio layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {posts.map((post) => {
            const postId = post.id || post._id;
            const postDate = post.createdAt || post.date;
            const mediaType = sniffMediaType(post);

            return (
              <motion.article
                key={postId}
                variants={cardVariants}
                className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  background: 'hsl(var(--card))',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                <Link to={`/blog/${postId}`} className="flex flex-col h-full">

                  {/* Thumbnail */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {mediaType === 'image' && (
                      <img
                        src={resolveMediaUrl(post.mediaUrl!)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        style={{ transform: 'scale(1)', transition: 'transform 700ms ease' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.08)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
                        loading="lazy"
                      />
                    )}
                    {mediaType === 'video' && (
                      <video
                        src={resolveMediaUrl(post.mediaUrl!)}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                    {!mediaType && (
                      <div
                        className="w-full h-full"
                        style={{ background: 'linear-gradient(135deg, hsl(350,30%,92%), hsl(30,25%,88%))' }}
                      />
                    )}

                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {postDate && (
                      <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest mb-2">
                        {new Date(postDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    )}
                    <h3 className="font-heading text-base font-semibold leading-snug mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.content}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-4 group-hover:gap-2.5 transition-all duration-300 uppercase tracking-wide">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            style={{
              border: '1.5px solid hsl(350,40%,62%)',
              color: 'hsl(350,40%,52%)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'hsl(350,45%,58%)';
              el.style.color = 'white';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = 'hsl(350,40%,52%)';
            }}
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeBlogSection;