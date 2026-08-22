import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const Hero = ({ spotlightBook }) => {
  return (
    <header className="relative min-h-[calc(100vh-4rem)] w-full bg-background overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 z-10">

        {/* Left Column: Typography & Action Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-0"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-none uppercase select-none">
            HonKhana
          </h1>

          <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8 max-w-md font-light">
            Your digital and walk-in library, in one place. Borrow physical books,
            read digital copies instantly, and
            <span className="text-primary font-medium ml-1">never lose track of a due date again</span>.
          </p>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-6">
            <Link 
              to="/explore" 
              className="group relative flex items-center gap-4 w-fit hover:translate-x-1 transition-transform"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors border-b-2 border-border pb-1 group-hover:border-primary">
                Explore the Library
              </span>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
              </div>
            </Link>

            <Link 
              to="/profile" 
              className="flex items-center gap-2.5 text-xs font-semibold text-foreground/50 uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer w-fit group"
            >
              <BookOpen size={14} strokeWidth={2.5} className="group-hover:text-primary transition-colors" />
              View My Loans
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Full-bleed Featured Spotlight — the cover fills the
            entire column instead of floating as a small card in empty space. */}
        {spotlightBook && (
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative min-h-[60vh] lg:min-h-full"
          >
            <Link to={`/content/${spotlightBook.id}`} className="absolute inset-0 block">
              {spotlightBook.coverUrl ? (
                <img
                  src={spotlightBook.coverUrl}
                  alt={spotlightBook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <BookOpen size={64} className="text-foreground/10" />
                </div>
              )}
            </Link>

            {/* Gradient so the overlaid text stays legible over any cover image */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent lg:bg-gradient-to-r lg:from-background lg:via-transparent lg:to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 lg:right-auto lg:max-w-md p-8 lg:p-12">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                <Sparkles size={12} strokeWidth={2.5} />
                Featured Pick
              </span>

              {Array.isArray(spotlightBook.genre) && spotlightBook.genre.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {spotlightBook.genre.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="text-[10px] font-semibold uppercase tracking-wide text-foreground/70 border border-border/60 rounded-full px-2 py-0.5 bg-background/70 backdrop-blur-sm"
                    >
                      {g.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 leading-tight line-clamp-2">
                {spotlightBook.title}
              </h3>
              <p className="text-sm text-foreground/60 mb-4 font-medium">
                {spotlightBook.author}
              </p>

              {spotlightBook.description && (
                <p className="text-sm text-foreground/70 leading-relaxed mb-5 line-clamp-2">
                  {spotlightBook.description}
                </p>
              )}

              <Link
                to={`/content/${spotlightBook.id}`}
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-full px-5 py-2.5 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                View Book
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </header>
  );
};
