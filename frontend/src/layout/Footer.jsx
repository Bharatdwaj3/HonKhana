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
                Augen
              </h3>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Where creators share vision.<br />
              Where readers find clarity.
            </p>
          </div>

        
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
           
            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                Platform
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/contents" className="hover:text-primary transition-colors">Explore Contents</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Become a Creator</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Augen</Link></li>
              </ul>
            </div>

           
            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                For Creators
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><a href="/user/creator/dashboard" className="hover:text-primary transition-colors">Creator Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Publishing Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Monetization</a></li>
              </ul>
            </div>

           
            <div>
              <h4 className="text-primary font-semibold mb-4 uppercase tracking-wide text-sm">
                Support
              </h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li className="pt-2">
                  <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            © {currentYear} Augen. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <span>Made with vision in India</span>
            
            <div className="flex gap-5">
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                IG
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                GH
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;