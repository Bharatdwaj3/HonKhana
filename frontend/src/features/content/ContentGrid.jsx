/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';


import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Clock, Tag, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function ContentGrid({ limit = 20, categoryFilter = null }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5001/api/content', { withCredentials: true })
      .then((res) => {
        let data = res.data;
        if (categoryFilter && categoryFilter !== 'all') {
          data = data.filter(item => item.category === categoryFilter);
        }
        setContents(data.slice(0, limit));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [limit, categoryFilter]);

  
  const calculateReadTime = (description) => {
    if (!description) return '3 min';
    const words = description.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="content-card h-[400px] animate-pulse">
            <div className="aspect-[16/10] bg-foreground/5 rounded-t-xl" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-foreground/5 rounded w-1/3" />
              <div className="h-6 bg-foreground/5 rounded w-full" />
              <div className="h-4 bg-foreground/5 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
      >
        {contents.map((content, index) => (
          <motion.article 
            key={content._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="content-card group cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/content/${content._id}`)}
          >
         \
            <div className="relative aspect-[16/10] bg-foreground/5 overflow-hidden rounded-t-xl flex-shrink-0">
              {content.mediaUrl && content.mediaType === 'image' ? (
                <img 
                  src={content.mediaUrl} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  alt={content.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                  <ImageIcon size={48} className="text-foreground/20" strokeWidth={1.5} />
                </div>
              )}
              
        
              {content.category && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur-sm border border-border text-xs font-semibold text-foreground/70">
                    <Tag size={11} />
                    {content.category}
                  </span>
                </div>
              )}
            </div>

          
            <div className="p-5 flex flex-col flex-grow">
             
              <h3 className="text-lg font-bold leading-snug text-foreground mb-2.5 line-clamp-2 group-hover:text-primary transition-colors">
                {content.title || 'Untitled Story'}
              </h3>

             
              <p className="text-sm text-foreground/60 leading-relaxed mb-4 line-clamp-2 flex-grow">
                {content.description || "Discover this story and explore new perspectives..."}
              </p>

              
              <div className="mt-auto space-y-3">
                <div className="pt-3 border-t border-border flex items-center justify-between">
                 
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-background flex-shrink-0">
                      {content.author?.avatar ? (
                        <img 
                          src={content.author.avatar} 
                          alt={content.author.fullName || content.author.userName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={12} className="text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-foreground/70 truncate">
                      {content.author?.fullName || content.author?.userName || 'Anonymous'}
                    </span>
                  </div>

                  
                  <ArrowRight 
                    size={16} 
                    className="text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
                  />
                </div>

              
                <div className="flex items-center gap-3 text-xs text-foreground/40">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>{calculateReadTime(content.description)} read</span>
                  </div>
                  {content.createdAt && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-foreground/20" />
                      <span>{formatDate(content.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}