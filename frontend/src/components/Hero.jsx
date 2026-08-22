import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users } from 'lucide-react';

const FLOAT_POSITIONS = [
  '-top-5 -right-5 rotate-6',
  '-bottom-5 -left-5 -rotate-3',
];

const FloatingBookCard = ({ book, position, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    className={`hidden xl:flex absolute z-30 items-center gap-3 bg-background border border-border rounded-xl shadow-xl px-3 py-2.5 max-w-[180px] ${position}`}
  >
    <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 bg-card border border-border">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <BookOpen size={14} className="text-foreground/20" />
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-foreground truncate">{book.title}</p>
      <p className="text-[11px] text-foreground/50 truncate">{book.author}</p>
    </div>
  </motion.div>
);

export const Hero = ({ spotlightBook, floatingBooks = [] }) => {
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
        <div className="inline-flex items-center gap-2 w-fit mb-8 px-4 py-1.5 rounded-full border border-border bg-background/60 text-xs font-semibold text-foreground/60">
          <BookOpen size={13} strokeWidth={2.5} className="text-primary" />
          Your campus library, online and on the shelf
        </div>

        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-foreground mb-6 leading-none uppercase select-none">
          HonKhana
        </h1>

        <p className="text-base lg:text-lg text-foreground/60 leading-relaxed mb-10 font-light">
          Your digital and walk-in library, in one place. Borrow physical books,
          read digital copies instantly, and
          <span className="text-primary font-medium ml-1">never lose track of a due date again</span>.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-wide rounded-full px-6 py-3.5 hover:bg-primary/90 hover:scale-105 transition-all"
          >
            Explore the Library
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/profile"
            className="inline-flex items-center gap-2 border border-border text-foreground/70 text-xs font-bold uppercase tracking-wide rounded-full px-6 py-3.5 hover:border-primary hover:text-primary transition-all"
          >
            <BookOpen size={14} strokeWidth={2.5} />
            View My Loans
          </Link>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-medium text-foreground/40">
          <Users size={15} strokeWidth={2} />
          Trusted by students & faculty on campus
        </div>
      </motion.div>

      <div className="hidden lg:flex flex-1 relative bg-background items-center justify-center px-12 xl:px-24">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />

        {spotlightBook && (
          <div className="relative w-full max-w-sm">
            {/* Ambient warm glow behind the whole grouped card, filling the void */}
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative z-10 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-2xl p-6"
            >
              <div className="relative w-full aspect-[2/3] mb-6">
                {floatingBooks.slice(0, 2).map((book, i) => (
                  <FloatingBookCard
                    key={book.id}
                    book={book}
                    position={FLOAT_POSITIONS[i]}
                    delay={0.9 + i * 0.15}
                  />
                ))}

                <Link
                  to={`/content/${spotlightBook.id}`}
                  className="relative z-10 block w-full h-full rounded-xl overflow-hidden border border-border shadow-lg hover:scale-[1.02] transition-transform duration-300"
                >
                  {spotlightBook.coverUrl ? (
                    <img src={spotlightBook.coverUrl} alt={spotlightBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center">
                      <BookOpen size={48} className="text-foreground/10" />
                    </div>
                  )}
                </Link>
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Featured Pick</span>
              <h3 className="text-lg font-bold text-foreground mb-1">{spotlightBook.title}</h3>
              <p className="text-sm text-foreground/50 mb-5">{spotlightBook.author}</p>

              <Link
                to={`/content/${spotlightBook.id}`}
                className="group flex items-center justify-center gap-2 w-full bg-primary text-white text-xs font-bold uppercase tracking-wide rounded-full px-6 py-3.5 hover:bg-primary/90 transition-all"
              >
                View Book
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </header>
  );
};
