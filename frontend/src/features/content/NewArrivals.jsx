import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getNewArrivals } from '../../util/catalogApi';

export default function NewArrivals({ limit = 8 }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getNewArrivals(limit)
      .then((res) => {
        setBooks(res.data);
        setError('');
      })
      .catch((err) => {
        setError(err.response ? 'Something went wrong on our end.' : "Can't reach the server — check your network.");
      })
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="content-card h-[320px] animate-pulse">
            <div className="aspect-[3/4] bg-foreground/5 rounded-t-xl" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-foreground/5 rounded w-1/3" />
              <div className="h-6 bg-foreground/5 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {books.map((book, index) => (
          <motion.article
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="content-card group cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/content/${book.id}`)}
          >
            <div className="relative aspect-[3/4] bg-foreground/5 overflow-hidden rounded-t-xl flex-shrink-0">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={book.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                  <BookOpen size={48} className="text-foreground/20" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold leading-snug text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-foreground/60">{book.author}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
      {error && <p className="text-sm text-primary text-center mt-6">{error}</p>}
    </div>
  );
}
