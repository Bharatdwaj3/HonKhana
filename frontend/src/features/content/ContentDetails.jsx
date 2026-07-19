import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Clock,
  Share2,
  Bookmark,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { toggleBookmark, markAsVisited } from "../../store/contentSlice";
import { toggleFollow } from "../../store/followSlice";

const ContentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.content.bookmarks);
  const isBookmarked = bookmarks.includes(id);
  const isFollowing = useSelector((state) =>
  content?.author?._id ? state.follow.following.includes(content.author._id) : false
);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/content/${id}`, {
          withCredentials: true,
        });
        setContent(res.data);
        setLoading(false);
        dispatch(markAsVisited(id));
      } catch (err) {
        console.error(err);
        navigate("/content", { replace: true });
      }
    };
    fetchContent();
  }, [id, navigate, dispatch]);

  const calculateReadTime = (description) => {
    if (!description) return "3 min";
    const words = description.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-[50vh] min-h-100 bg-linear-to-br from-secondary/10 to-accent/10 overflow-hidden">
        {content.mediaType === "image" && content.mediaUrl ? (
          <img
            src={content.mediaUrl}
            className="w-full h-full object-cover opacity-90"
            alt={content.title}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg text-sm font-semibold text-foreground/70 hover:text-primary hover:border-primary transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12 border-b border-border">
            {content.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Tag size={12} />
                {content.category}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-card">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {content.author?.fullName || "Anonymous"}
                  </p>
                  <p className="text-xs text-foreground/40">
                    @{content.author?.userName || "anonymous"}
                  </p>
                </div>
              </div>

              <div className="w-px h-8 bg-border" />

              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {new Date(content.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{calculateReadTime(content.description)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => dispatch(toggleBookmark(id))}
                className={`
      flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all
      ${
        isBookmarked
          ? "bg-primary/20 border-primary text-primary hover:bg-primary/30"
          : "border-border hover:border-primary hover:text-primary bg-card/50"
      }
    `}
              >
                <Bookmark
                  size={17}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                {isBookmarked ? "Saved" : "Save"}
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          <div className="reading-container py-12">
            <div className="article-text prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-foreground/80 font-light mb-8">
                {content.description}
              </p>

              <div className="mt-8 p-6 bg-secondary/5 border-l-4 border-secondary rounded-r-lg">
                <p className="text-sm text-foreground/60 italic">
                  This is the article content. In a real application, you would
                  display the full article content here with proper formatting,
                  images, and rich media.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 border-t border-border bg-foreground/2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground/40 uppercase tracking-wider mb-1">
                    Written by
                  </p>
                  <p className="font-bold text-foreground">
                    {content.author?.fullName || "Anonymous Writer"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(toggleFollow(content.author?._id))}
                className={`px-6 py-3 rounded-lg transition-colors font-semibold text-sm ${
                  isFollowing
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {isFollowing ? "Following" : "Follow Author"}
              </button>
            </div>
          </div>
        </motion.article>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            More from {content.author?.fullName || "this author"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ContentDetails;
