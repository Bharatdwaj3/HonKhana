import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto w-full">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                HonKhana
              </h3>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs leading-relaxed">
              Your digital and walk-in library.<br />
              Borrow, read, and renew — all in one place.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h4 className="text-primary font-bold mb-4 uppercase tracking-wider text-xs">
                Library
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm font-medium">
                <li><Link to="/explore" className="hover:text-primary transition-colors">Explore Books</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">My Loans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary font-bold mb-4 uppercase tracking-wider text-xs">
                Account
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm font-medium">
                <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary font-bold mb-4 uppercase tracking-wider text-xs">
                Support
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm font-medium">
                <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Community</Link></li>
                <li className="pt-2">
                  <Link to="/coming-soon" className="hover:text-primary transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-muted-foreground">
          <div>
            © {currentYear} HonKhana. All rights reserved.
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <Link 
              to="/coming-soon" 
              aria-label="Twitter" 
              className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <Twitter size={18} strokeWidth={2} className="shrink-0" />
              <span className="text-[11px] font-bold">X</span>
            </Link>
            <Link 
              to="/coming-soon" 
              aria-label="Instagram" 
              className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <Instagram size={18} strokeWidth={2} className="shrink-0" />
              <span className="text-[11px] font-bold">IG</span>
            </Link>
            <Link 
              to="/coming-soon" 
              aria-label="GitHub" 
              className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <Github size={18} strokeWidth={2} className="shrink-0" />
              <span className="text-[11px] font-bold">GH</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;