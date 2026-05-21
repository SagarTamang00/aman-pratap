import React from 'react';
import { FaInstagram, FaFacebookF, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1a1710] border-t border-[rgba(201,168,76,0.15)] pt-20 pb-10 px-6 md:px-10 font-[var(--sans)]">

      {/* Top decorative divider */}
      <div className="max-w-6xl mx-auto mb-14 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.5)] to-transparent" />

      {/* Main grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* ── BRAND ── */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[#c9a84c] text-[0.68rem] uppercase tracking-[0.28em] font-extrabold mb-2">
              Filmmaker · Director
            </p>
            <h2 className="text-[#d1c4af] text-4xl md:text-5xl font-black tracking-tight leading-none m-0">
              Aman{' '}
              <span className="text-[#c9a84c] italic">Pratap</span>
            </h2>
          </div>
          <p className="text-[rgba(209,196,175,0.5)] text-sm leading-relaxed max-w-[260px] m-0">
            Crafting stories through light, shadow, and motion.
          </p>
          <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-transparent" />
        </div>


        {/* ── CONTACT ── */}
        <div>
          <p className="text-[#c9a84c] text-[0.68rem] uppercase tracking-[0.25em] font-extrabold mb-5">
            Get in touch
          </p>

          <a
            href="mailto:director@email.com"
            className="group flex items-center gap-3 text-[rgba(209,196,175,0.65)] hover:text-[#c9a84c] text-sm font-bold no-underline transition-colors duration-200 mb-7 w-fit"
          >
            <span className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] grid place-items-center shrink-0 group-hover:bg-[rgba(201,168,76,0.18)] transition-colors duration-200">
              <FaEnvelope size={13} className="text-[#c9a84c]" />
            </span>
            director@email.com
          </a>

          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { icon: <FaInstagram size={14} />, href: '#', label: 'Instagram' },
              { icon: <FaFacebookF size={14} />, href: '#', label: 'Facebook' },
              { icon: <FaYoutube size={14} />, href: '#', label: 'YouTube' },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-[rgba(209,196,175,0.04)] border border-[rgba(201,168,76,0.18)] grid place-items-center text-[rgba(209,196,175,0.5)] hover:text-[#c9a84c] hover:bg-[rgba(201,168,76,0.14)] hover:border-[rgba(201,168,76,0.45)] hover:-translate-y-0.5 transition-all duration-200 no-underline"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-6xl mx-auto mt-14 pt-6 border-t border-[rgba(201,168,76,0.1)] flex flex-wrap justify-between items-center gap-4">
        <p className="text-(--color-span)  text-[0.72rem] uppercase tracking-[0.12em] font-bold m-0">
          © {new Date().getFullYear()} Aman Pratap — All rights reserved
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-px bg-[#c9a84c] opacity-40" />

          <a
            href="https://yashashtech.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-span) text-[0.68rem] uppercase tracking-[0.18em] font-bold no-underline"
          >
            Made by yashashtech
          </a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;