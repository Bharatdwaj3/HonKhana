import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users } from 'lucide-react';

const STACK_CONFIG = [
  { rotate: -10, translateY: 20, z: 10, widthClass: 'w-20 sm:w-24', heightClass: 'h-64 sm:h-72', marginClass: '' },
  { rotate: 0, translateY: 0, z: 30, widthClass: 'w-24 sm:w-28', heightClass: 'h-72 sm:h-80 xl:h-96', marginClass: '-ml-6' },
  { rotate: 10, translateY: 20, z: 10, widthClass: 'w-20 sm:w-24', heightClass: 'h-64 sm:h-72', marginClass: '-ml-6' },
];

const SpineCover = ({ book, config }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: config.translateY }}
    transition={{ duration: 0.9, delay: 0.2 }}
    style={{ transform: `rotate(${config.rotate}deg)`, zIndex: config.z }}
    className={`relative ${config.widthClass} ${config.heightClass} ${config.marginClass} rounded-lg overflow-hidden border border-border shadow-2xl shrink-0`}
  >
    {book.coverUrl ? (
      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-card flex items-center justify-center">
        <BookOpen size={28} className="text-foreground/10" />
      </div>
    )}
  </motion.div>
);

const FloatingTitleCard = ({ book, position, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    className={`hidden xl:block absolute z-40 bg-card border border-border rounded-xl shadow-xl px-3 py-2 max-w-[160px] ${position}`}
  >
    <p className="text-xs font-bold text-foreground truncate">{book.title}</p>
    <p className="text-[11px] text-foreground/50 truncate">{book.author}</p>
  </motion.div>
);

export const Hero = ({ spotlightBook, floatingBooks = [] }) => {
  const [left, right] = floatingBooks;
  const stackBooks = [left, spotlightBook, right];

  return (
    <header className="relative min-h-screen w-full flex bg-background overflow-x-hidden">

      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
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

      <div className="hidden lg:flex flex-1 relative bg-background items-center justify-center px-12 xl:px-20 py-16">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

        {spotlightBook && (
          <div className="relative flex flex-col items-center">
            <div className="relative flex items-end">
              {stackBooks.map((book, i) =>
                book ? <SpineCover key={book.id} book={book} config={STACK_CONFIG[i]} /> : null
              )}

              {left && <FloatingTitleCard book={left} position="top-2 -left-16" delay={0.9} />}
              {right && <FloatingTitleCard book={right} position="top-10 -right-16" delay={1.05} />}
            </div>

            <div className="w-2/3 h-5 bg-black/10 blur-xl rounded-full mt-4" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-center"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Featured Pick</span>
              <h3 className="text-xl font-bold text-foreground mb-1">{spotlightBook.title}</h3>
              <p className="text-sm text-foreground/50 mb-4">{spotlightBook.author}</p>
              <Link
                to={`/content/${spotlightBook.id}`}
                className="group inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-wide rounded-full px-5 py-2.5 hover:bg-primary/90 transition-all"
              >
                View Book
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </header>
  );
};
