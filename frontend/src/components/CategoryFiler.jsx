import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGenre } from '../store/contentSlice';

const GENRES = [
  { value: 'all', label: 'All Books' },
  { value: 'FICTION', label: 'Fiction' },
  { value: 'NON_FICTION', label: 'Non-Fiction' },
  { value: 'FANTASY', label: 'Fantasy' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'SCIENCE_FICTION', label: 'Sci-Fi' },
  { value: 'MYSTERY', label: 'Mystery' },
  { value: 'ROMANCE', label: 'Romance' },
  { value: 'HORROR', label: 'Horror' },
  { value: 'HISTORY', label: 'History' },
  { value: 'BIOGRAPHY', label: 'Biography' },
  { value: 'POETRY', label: 'Poetry' },
  { value: 'DRAMA', label: 'Drama' },
  { value: 'SELF_HELP', label: 'Self-Help' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'PHILOSOPHY', label: 'Philosophy' },
  { value: 'CHILDREN', label: 'Children' },
];

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.content.selectedGenre);

  const handleGenreClick = (genre) => {
    dispatch(setGenre(genre));
  };

  return (
    <div
      className="glass-strong rounded-2xl mb-8 sticky top-20 z-10 animate-fade-in"
      style={{ padding: '24px 40px' }}
    >
      <div className="flex gap-3 flex-wrap justify-center items-center overflow-x-auto">
        {GENRES.map((g, idx) => (
          <button
            key={g.value}
            onClick={() => handleGenreClick(g.value)}
            className={`
              px-5 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 ease-in-out
              ${selectedGenre === g.value
                ? 'bg-primary text-primary-foreground glow-border scale-105'
                : 'bg-secondary text-foreground hover:bg-muted'
              }
              hover:-translate-y-1 hover:shadow-lg
              animate-fade-in
            `}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
