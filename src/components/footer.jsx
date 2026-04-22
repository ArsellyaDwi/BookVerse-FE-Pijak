import { Link } from "react-router";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! Email ${email} has been registered for the newsletter.`);
    setEmail("");
  };

  return (
    <footer className="mt-32 bg-blue-600 font-poppins">
      {/* Main Footer Content - 4 Columns */}
      <div className="max-w-[1440px] mx-auto py-20 px-20 pb-10">
        <div className="grid grid-cols-4 gap-16 mb-14">
          {/* COLUMN 1: IDENTITY & SOCIAL MEDIA */}
          <div>
            {/* Logo - TEXT BASED */}
            <div className="mb-8">
              <h3 className="font-poppins text-[32px] font-bold text-white m-0 tracking-tight leading-none">
                BookVerse
              </h3>
            </div>

            {/* Poetic Tagline */}
            <p className="font-poppins text-sm font-normal text-white/90 leading-relaxed mb-8 max-w-[240px]">
              Exploring the world of knowledge, inspiring change, and building a
              community of smart readers.
            </p>

            {/* Social Media - White Outline Circles */}
            <div className="flex gap-3">
              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75h-10.5a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 6.75v.008"
                  />
                </svg>
              </a>

              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:border-white hover:bg-white/15"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: SERVICES */}
          <div>
            <h4 className="font-poppins text-sm font-bold text-white mb-6 leading-relaxed tracking-wide uppercase">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/genre/editor-choice"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  Editor's Choice
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/new-releases"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/merchandise"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  Merchandise
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HELP */}
          <div>
            <h4 className="font-poppins text-sm font-bold text-white mb-6 leading-relaxed tracking-wide uppercase">
              HELP
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/contact"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="font-poppins text-sm font-normal text-white/90 no-underline leading-relaxed inline-block transition-all duration-300 hover:opacity-100 hover:underline hover:underline-offset-4"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div>
            <h4 className="font-poppins text-sm font-bold text-white mb-4 leading-relaxed tracking-wide uppercase">
              SUBSCRIBE
            </h4>

            {/* Newsletter Description */}
            <p className="font-poppins text-[13px] font-normal text-white/90 leading-relaxed mb-5">
              Get the latest updates and exclusive discounts straight to your
              email.
            </p>

            {/* Newsletter Form - COMPACT */}
            <form onSubmit={handleNewsletterSubmit}>
              <div className="flex items-center transition-all duration-300 rounded-full p-1.5 bg-white/15 border border-white/20 max-w-[280px] hover:bg-white/20 hover:border-white/40">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="flex-1 bg-transparent focus:outline-none font-poppins text-[13px] text-white py-1.5 px-3 border-none placeholder:text-white/60"
                />
                {/* Paper Plane Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-none cursor-pointer text-blue-600 bg-white p-3 flex-shrink-0 transition-all duration-300 hover:bg-slate-100 hover:scale-105"
                  title="Send"
                >
                  <svg
                    className="w-5 h-5 block m-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider Line - White Thin */}
        <div className="h-px bg-white/20 mb-8" />

        {/* Bottom Copyright Bar */}
        <div className="font-poppins text-[13px] text-white text-center">
          <p className="m-0 opacity-85">
            © 2026 BookVerse. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
