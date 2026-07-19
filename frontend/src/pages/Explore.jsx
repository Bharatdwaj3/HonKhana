import React, { useState } from "react";
import { motion } from "framer-motion";
import ContentGrid from "../features/content/ContentGrid";
import { Filter, TrendingUp, Clock, Star } from "lucide-react";

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('recent');

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'fiction', label: 'Fiction' },
    { id: 'technology', label: 'Technology' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'business', label: 'Business' },
    { id: 'science', label: 'Science' },
     { id: 'history', label: 'history' }
  ];

  const filters = [
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Star },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Explore Stories
            </h1>
            <p className="text-foreground/60 text-lg">
              Discover amazing content from writers around the world
            </p>
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground/50 flex-shrink-0">
                <Filter size={16} />
                <span>Sort by:</span>
              </div>
              <div className="flex gap-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                        selectedFilter === filter.id
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-card border border-border text-foreground/70 hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon size={14} />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-secondary/10 border border-secondary text-secondary'
                      : 'bg-card border border-border text-foreground/70 hover:border-secondary hover:text-secondary'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6">
          <ContentGrid 
            limit={20} 
            categoryFilter={selectedCategory === 'all' ? null : selectedCategory}
          />
        </div>
      </div>
    </main>
  );
}