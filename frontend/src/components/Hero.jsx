import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Hero = ({ spotlightBook }) => {
  return (
    <header className="relative min-h-screen w-full flex bg-background overflow-hidden">

      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-secondary/10 blur-[120px] rounded-full animate-slow-drift" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[60%] bg-primary/8 blur-[100px] rounded-full animate-slow-drift animation-delay-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
        className="w-full lg:w-[35%] lg:min-w-[380px] flex flex-col justify-center px-8 lg:px-16 xl:px-24 z-20 bg-card/50 backdrop-blur-md border-r border-border"
      >
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-foreground mb-6 leading-none uppercase select-none">
          HonKhana
        </h1>

        <p className="text-base lg:text-lg text-foreground/60 leading-relaxed mb-10 font-light">
          Your digital and walk-in library, in one place. Borrow physical books,
          read digital copies instantly, and
          <span className="text-primary font-medium ml-1">never lose track of a due date again</span>.
        </p>

        <div className="space-y-8">
          <Link to="/explore" className="group relative flex items-center gap-4 w-fit hover:scale-105 transition-transform">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/70 group-hover:text-primary transition-colors border-b-2 border-border pb-2 group-hover:border-primary">
              Explore the Library
            </span>
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
            </div>
          </Link>

          <Link to="/profile" className="flex items-center gap-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider hover:text-secondary transition-colors cursor-pointer w-fit group">
            <BookOpen size={14} strokeWidth={2.5} className="group-hover:text-secondary transition-colors" />
            View My Loans
          </Link>
        </div>
      </motion.div>

      <div className="hidden lg:flex flex-1 relative bg-background items-center justify-center">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        />
        <div className="w-[40%] h-[30%] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />

        {spotlightBook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative z-10 flex items-center gap-8 max-w-md"
          >
            <Link
              to={`/content/${spotlightBook.id}`}
              className="w-40 h-56 rounded-2xl overflow-hidden border border-border shadow-2xl shrink-0 hover:scale-105 transition-transform"
            >
              {spotlightBook.coverUrl ? (
                <img src={spotlightBook.coverUrl} alt={spotlightBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <BookOpen size={32} className="text-foreground/10" />
                </div>
              )}
            </Link>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Featured Pick</span>
              <h3 className="text-xl font-bold text-foreground mb-1">{spotlightBook.title}</h3>
              <p className="text-sm text-foreground/50 mb-4">{spotlightBook.author}</p>
              <Link
                to={`/content/${spotlightBook.id}`}
                className="text-xs font-semibold uppercase tracking-wide text-foreground/70 border-b-2 border-border pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                View Book
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
