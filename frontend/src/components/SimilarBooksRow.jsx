import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function SimilarBooksRow({ title, books, emptyMessage }) {
  const navigate = useNavigate();

  if (!books || books.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="mt-12">
        <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
        <div className="rounded-2xl border border-border bg-card/50 px-6 py-8 text-center text-sm text-foreground/50">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
        {books.map((book, index) => (
          <motion.article
            key={book.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="content-card group cursor-pointer flex-shrink-0 w-36"
            onClick={() => navigate(`/content/${book.id}`)}
          >
            <div className="relative aspect-[2/3] bg-foreground/5 overflow-hidden rounded-t-xl">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={book.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                  <BookOpen size={32} className="text-foreground/20" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-foreground/60 mt-1">{book.author}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
