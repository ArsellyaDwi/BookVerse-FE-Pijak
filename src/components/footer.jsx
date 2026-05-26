import { Link } from "react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    services: false,
    community: false,
    help: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerSections = {
    services: [
      { name: "Editor's Choice", path: "/editors-choice" },
      { name: "New Releases", path: "/new-releases" },
    ],
    community: [
      { name: "Personality Quiz", path: "/personality-quiz" },
      { name: "Reading Community", path: "/community" },
    ],
    help: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Return Policy", path: "/return-policy" },
    ],
  };

  const InstagramIcon = () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h-10.5a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 6.75v.008" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );

  return (
    <footer className="bg-blue-600 font-poppins mt-16 md:mt-24 lg:mt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-12 sm:py-16 lg:py-20">
        
        {/* DESKTOP VERSION */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 xl:gap-16 mb-10 lg:mb-14">
            
            {/* COLUMN 1: BRAND & SOCIAL */}
            <div className="text-center sm:text-left">
              <div className="mb-4 md:mb-6 lg:mb-8">
                <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-tight">
                  BookVerse
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6 md:mb-8 max-w-xs mx-auto sm:mx-0">
                Exploring the world of knowledge, inspiring change, and building a community of smart readers.
              </p>
              <div className="flex justify-center sm:justify-start gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15 hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15 hover:scale-105"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* COLUMN 2: SERVICES */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 md:mb-5 lg:mb-6 tracking-wide uppercase text-center sm:text-left">
                SERVICES
              </h4>
              <ul className="flex flex-col items-center sm:items-start gap-2 md:gap-2.5 lg:gap-3">
                {footerSections.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs sm:text-sm text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: COMMUNITY */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 md:mb-5 lg:mb-6 tracking-wide uppercase text-center sm:text-left">
                COMMUNITY
              </h4>
              <ul className="flex flex-col items-center sm:items-start gap-2 md:gap-2.5 lg:gap-3">
                {footerSections.community.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs sm:text-sm text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: HELP */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 md:mb-5 lg:mb-6 tracking-wide uppercase text-center sm:text-left">
                HELP
              </h4>
              <ul className="flex flex-col items-center sm:items-start gap-2 md:gap-2.5 lg:gap-3">
                {footerSections.help.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs sm:text-sm text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 my-6 md:my-7 lg:my-8" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-white/80">
              © {new Date().getFullYear()} BookVerse. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* MOBILE VERSION */}
        <div className="block sm:hidden">
          {/* Brand & Social */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                BookVerse
              </h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed mb-5 max-w-xs mx-auto">
              Exploring the world of knowledge, inspiring change, and building a community of smart readers.
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Accordion: SERVICES */}
          <div className="border-t border-white/20">
            <button
              onClick={() => toggleSection('services')}
              className="w-full flex justify-between items-center py-4 text-left"
            >
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                SERVICES
              </h4>
              {openSections.services ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.services ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              <ul className="flex flex-col gap-2 pb-2">
                {footerSections.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Accordion: COMMUNITY */}
          <div className="border-t border-white/20">
            <button
              onClick={() => toggleSection('community')}
              className="w-full flex justify-between items-center py-4 text-left"
            >
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                COMMUNITY
              </h4>
              {openSections.community ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.community ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              <ul className="flex flex-col gap-2 pb-2">
                {footerSections.community.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Accordion: HELP */}
          <div className="border-t border-white/20">
            <button
              onClick={() => toggleSection('help')}
              className="w-full flex justify-between items-center py-4 text-left"
            >
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                HELP
              </h4>
              {openSections.help ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.help ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              <ul className="flex flex-col gap-2 pb-2">
                {footerSections.help.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300 inline-block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 my-6" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-white/80">
              © {new Date().getFullYear()} BookVerse. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}