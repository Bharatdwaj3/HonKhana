import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HonKhana
              </h3>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Your digital and walk-in library.<br />
              Borrow, read, and renew ‚Äî all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                Library
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/explore" className="hover:text-primary transition-colors">Explore Books</Link></li>
                <li><Link to="/my-loans" className="hover:text-primary transition-colors">My Loans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                Account
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                Support
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
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

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            ¬© {currentYear} HonKhana. All rights reserved.
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="flex gap-5">
              <Link to="/coming-soon" className="hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                Ìµè
              </Link>
              <Link to="/coming-soon" className="hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                IG
              </Link>
              <Link to="/coming-soon" className="hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                GH
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
