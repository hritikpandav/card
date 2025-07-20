
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">DigitalCards</span>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1">
                Pro
              </Badge>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Create stunning digital business cards that make lasting impressions. 
              Connect, share, and grow your network effortlessly.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                { icon: <Facebook className="h-5 w-5" />, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about-us" className="text-slate-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/help-center" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies-policy" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Mail className="h-4 w-4" />
                <span>hello@digitalcards.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4" />
                <span>Indore, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-slate-300 mb-4">
              Get the latest features and tips delivered to your inbox.
            </p>
            <div className="flex space-x-2 overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2 rounded-lg font-medium whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © {currentYear} DigitalCards. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <p className="text-slate-400 text-sm flex items-center">
              Made with trust for professionals
            </p>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
              v2.1.0
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
