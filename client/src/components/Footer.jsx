import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = () => {
  const exploreLinks = [
    { name: 'The Problem', href: '#' },
    { name: 'Our Solution', href: '#' },
    { name: 'How It Works', href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Login', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-r from-[#062b18] to-[#0a3d24] text-[#EFEFEF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center mb-2">
            <ChefHat className="w-6 h-6 mr-2 text-[#BB4500]" />
            <span className="text-xl font-semibold text-white">IngreMatch</span>
          </div>
          <p className="text-sm text-[#EFEFEF]">
            Smart cooking, zero waste.
          </p>
        </div>

        <div>
          <h3 className="text-[#BB4500] font-bold mb-3">Explore</h3>
          <ul className="space-y-2">
            {exploreLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#BB4500] font-bold mb-3">Company</h3>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#BB4500] font-bold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-[#EFEFEF]">
            <li>ingrematch@gmail.com</li>
            <li>Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;