import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Truck, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? 'bg-primary shadow-md border-transparent py-4'
          : 'bg-primary/75 backdrop-blur-md border-white/10 py-6'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <Truck className="w-10 h-10 text-accent transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-[34px] leading-none font-heading font-extrabold uppercase tracking-tight">
                <span className="text-white">SJA</span> <span className="text-accent">TRANSPORT</span>
              </span>
              <span className="text-white/80 text-[10px] tracking-[0.2em] font-medium mt-1">
                SAFE • FAST • RELIABLE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[18px] font-semibold transition-all duration-300 relative group
                  ${isActive ? 'text-accent' : 'text-white hover:text-accent'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute left-0 right-0 -bottom-2 h-[3px] bg-accent rounded-full"
                      />
                    )}
                    {!isActive && (
                      <div className="absolute left-0 right-0 -bottom-2 h-[3px] bg-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Link
              to="/book"
              className="px-8 py-3 bg-accent text-primary text-[18px] font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-[#E5C158] hover:scale-105 transition-all duration-300"
            >
              Book Shipment
            </Link>
            {auth?.isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <Shield size={14} className="text-accent" />
                <span className="text-white text-xs font-bold tracking-wider">ADMIN</span>
              </div>
            ) : (
              <Link to="/admin/login" className="text-white/30 hover:text-white/70 text-xs transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t mt-4"
          >
            <div className="flex flex-col px-4 py-6 space-y-4 shadow-xl">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium py-2 transition-colors ${isActive ? 'text-accent' : 'text-text'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Link
                to="/book"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-accent text-white font-medium rounded-xl text-center shadow-md mt-4"
              >
                Book Shipment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
