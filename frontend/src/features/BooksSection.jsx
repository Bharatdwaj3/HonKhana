import React from 'react';
import { BookOpen, Star } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import BookListItem from '../components/BookListItem';

const BooksSection = () => {
  const {
    bookList,
    loading,
    error,
    selectedBookIds,
    bulkSaving,
    toggleBookSelection,
    handleBulkFeatured,
  } = useBooks();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}

      {selectedBookIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-card border border-border rounded-xl">
          <span className="text-sm font-semibold text-foreground/70">{selectedBookIds.size} selected</span>
          <button
            onClick={() => handleBulkFeatured(true)}
            disabled={bulkSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Star size={14} /> Add to Featured
          </button>
          <button
            onClick={() => handleBulkFeatured(false)}
            disabled={bulkSaving}
            className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-semibold hover:border-primary transition-all disabled:opacity-50"
          >
            Remove from Featured
          </button>
        </div>
      )}

      {bookList.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
          <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
          No books found.
        </div>
      ) : (
        <div className="space-y-2">
          {bookList.map((book) => (
            <BookListItem
              key={book.id}
              book={book}
              selected={selectedBookIds.has(book.id)}
              onToggle={toggleBookSelection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksSection;
