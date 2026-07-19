import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../util/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    userName: '', fullName: '', email: '', accountType: 'reader', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/user/register', formData);
      navigate('/login', { state: { message: 'Success' } });
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
  
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 md:p-6 pt-24 overflow-y-auto">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col md:flex-row w-full max-w-4xl min-h-[550px] md:h-[min(650px,75vh)] rounded-3xl overflow-hidden shadow-2xl border border-border bg-card"
      >
        
       
        <div className="relative w-full md:w-[38%] bg-primary flex flex-col justify-center px-8 md:px-10 py-10 text-foreground shrink-0">
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Augen</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 leading-none">Sign<br/>Up</h1>
          <div className="w-10 h-1 bg-foreground mb-6" />
          
          <p className="text-[13px] font-light opacity-80 leading-relaxed max-w-[200px]">
            Step into an unfiltered reality. Share your vision.
          </p>

          <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary border-[5px] border-card rounded-full items-center justify-center z-10 shadow-lg">
            <ChevronRight className="text-foreground" size={18} />
          </div>
        </div>

      
        <div className="w-full md:w-[62%] p-8 md:p-12 flex flex-col relative overflow-hidden bg-card">
          
         
          <div className="flex md:absolute md:top-8 md:right-8 mb-6 md:mb-0 self-end bg-background/50 rounded-full p-1 border border-border/50">
            <button className="px-4 py-1 rounded-full text-[8px] font-bold tracking-widest bg-primary text-foreground">SIGN UP</button>
            <Link to="/login" className="px-4 py-1 rounded-full text-[8px] font-bold tracking-widest text-foreground/40 hover:text-foreground">LOGIN</Link>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
              {error && <p className="text-primary text-[9px] font-bold uppercase tracking-widest">{error}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Full Name</label>
                  <input name="fullName" placeholder="John Doe" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors text-xs" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Username</label>
                  <input name="userName" placeholder="johndoe" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors text-xs" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Email</label>
                <input name="email" type="email" placeholder="hello@augen.com" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Password</label>
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors text-xs" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-1.5 text-foreground/20 hover:text-primary">
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Confirm</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors text-xs" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Account Type</label>
                <select name="accountType" onChange={handleChange} className="w-full bg-transparent border-b border-border py-1.5 text-foreground/60 focus:outline-none focus:border-primary transition-colors text-xs cursor-pointer">
                  <option value="reader" className="bg-card">READER</option>
                  <option value="creator" className="bg-card">CREATOR</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="mt-4 w-full md:w-max px-8 py-3.5 bg-primary text-foreground text-[10px] font-black uppercase tracking-[0.25em] rounded hover:bg-accent transition-all">
                {loading ? 'Creating...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
               <input type="checkbox" className="w-3.5 h-3.5 rounded border-border bg-transparent text-primary focus:ring-primary" required />
               <span className="text-[9px] text-foreground/40 tracking-wider">I AGREE TO THE <Link to="/terms" className="text-foreground border-b border-foreground/20">TERMS</Link></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}