import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Truck className="w-8 h-8 text-accent" />
              <span className="text-2xl font-heading font-bold">
                SAT <span className="text-accent">Transport</span>
              </span>
            </div>
            <div className="text-white/70 mb-6 leading-relaxed">
              Safe, fast and affordable goods transportation. We provide reliable transport solutions for every delivery need.
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-accent transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="text-white/70 hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3 text-white/70">
              <li>Household Items Transport</li>
              <li>Machinery Items Transport</li>
              <li>Cotton Box Transport</li>
              <li>Coconut Transport</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-accent shrink-0 mt-1" size={20} />
                <span className="text-white/70">A TO Z MANPOWER AGENCY, Thiruchitrambalam, Pattukkottai, Thanjavur, Tamil Nadu</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-accent shrink-0" size={20} />
                <span className="text-white/70">+91 9047415661</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-accent shrink-0" size={20} />
                <span className="text-white/70">+91 9486754661</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-accent shrink-0" size={20} />
                <span className="text-white/70">arulrajkks@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SJA TRANSPORT. All rights reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center">
            Developed by Sakthivel S
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
