import React from "react";
import { motion } from "framer-motion";
import { Footer } from "../layout/index";
import { Hero } from "../components/Hero";
import { ValueProp } from "../components/ValueProp";
import NewArrivals from "../features/content/NewArrivals";

export default function Home() {
  return (
    <main className="bg-background text-foreground selection:bg-primary/20">
      <div className="pt-20">
        <Hero />
      </div>
      <section className="relative py-24 px-6 lg:px-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <ValueProp />
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-12 flex items-center gap-4">
          <span className="text-xs font-bold tracking-widest uppercase text-foreground/60">
            New Arrivals
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <NewArrivals limit={8} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
