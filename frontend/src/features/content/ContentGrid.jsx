import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Tag } from 'lucide-react';
import { getBooks } from '../../util/catalogApi';

export default function ContentGrid({ limit = 20, genreFilter = null }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((res) => {
        let data = res.data;
        if (genreFilter && genreFilter !== 'all') {
          data = data.filter((book) => book.genre?.includes(genreFilter));
        }
        setBooks(data.slice(0, limit));
        setError('');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response ? 'Something went wrong on our end.' : "Can't reach the server — check your network.");
        setLoading(false);
      });
  }, [limit, genreFilter]);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="content-card h-[320px] animate-pulse">
              <div className="aspect-[3/4] bg-foreground/5 rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-foreground/5 rounded w-1/3" />
                <div className="h-6 bg-foreground/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
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
              {book.genre?.[0] && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur-sm border border-border text-xs font-semibold text-foreground/70">
                    <Tag size={11} />
                    {book.genre[0].replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold leading-snug text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-foreground/60 mb-4">{book.author}</p>

              <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-foreground/50">
                <span>{book.publisher}</span>
                <span className={book.availableCopies > 0 ? 'text-secondary font-semibold' : 'text-primary font-semibold'}>
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
      {error && <p className="text-sm text-primary text-center mt-6">{error}</p>}
    </div>
  );
}
