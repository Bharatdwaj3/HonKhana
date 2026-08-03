import React from 'react';
import { Star } from 'lucide-react';

const BookListItem = ({ book, selected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(book.id)}
      className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 cursor-pointer hover:border-primary transition-all"
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(book.id)}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{book.title}</p>
        <p className="text-sm text-foreground/60 truncate">{book.author}</p>
      </div>
      {book.featured && (
        <span className="flex items-center gap-1 text-xs font-semibold text-primary flex-shrink-0">
          <Star size={14} fill="currentColor" /> Featured
        </span>
      )}
    </div>
  );
};

export default BookListItem;
