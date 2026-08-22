import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const Hero = ({ spotlightBook }) => {
  return (
    <header className="relative min-h-[calc(100vh-4rem)] w-full flex items-center bg-background overflow-hidden py-12 lg:py-0">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Typography & Action Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col justify-center"
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

        {/* Right Column: Featured Spotlight Card */}
        {spotlightBook && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex justify-center lg:justify-end"
          >
            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-card/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl max-w-xl w-full">
              
              {/* Book Cover Container */}
              <div className="relative shrink-0">
                <div className="absolute -top-2 -right-2 w-36 h-52 sm:w-44 sm:h-64 rounded-xl bg-secondary/20 border border-border/40 rotate-6 pointer-events-none" />
                
                <Link
                  to={`/content/${spotlightBook.id}`}
                  className="relative block w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden border border-border shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  {spotlightBook.coverUrl ? (
                    <img 
                      src={spotlightBook.coverUrl} 
                      alt={spotlightBook.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BookOpen size={36} className="text-foreground/20" />
                    </div>
                  )}
                </Link>
              </div>

              {/* Book Metadata */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                  <Sparkles size={12} strokeWidth={2.5} />
                  Featured Pick
                </span>

                {Array.isArray(spotlightBook.genre) && spotlightBook.genre.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
                    {spotlightBook.genre.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] font-semibold uppercase tracking-wide text-foreground/60 border border-border/60 rounded-full px-2 py-0.5 bg-background/50"
                      >
                        {g.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 leading-tight line-clamp-2">
                  {spotlightBook.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground/50 mb-4 font-medium">
                  {spotlightBook.author}
                </p>

                {spotlightBook.description && (
                  <p className="text-xs text-foreground/60 leading-relaxed mb-5 line-clamp-2 hidden sm:block">
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

            </div>
          </motion.div>
        )}

      </div>
    </header>
  );
};