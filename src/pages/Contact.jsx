import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Contact = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-section)" }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#c9a84c]/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#8b6d5c]/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div
          className={`text-center mt-5 mb-14 transition-all duration-1000 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="uppercase tracking-[5px] text-xs sm:text-sm mb-4 font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            Contact
          </p>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
            style={{ color: "var(--color-heading)" }}
          >
            Let’s Work Together
          </h2>

          <div className="w-24 h-[2px] bg-[#c9a84c] mx-auto mt-6 rounded-full" />

          <p
            className="max-w-2xl mx-auto mt-6 text-sm sm:text-base leading-relaxed"
            style={{ color: "var(--color-body)" }}
          >
            Connect with Nepali film director
            <span
              className="font-bold ml-1"
              style={{ color: "var(--color-accent)" }}
            >
              Aman Pratap Adhikary
            </span>{" "}
            for collaborations, film projects, creative partnerships, or media
            inquiries.
          </p>
        </div>

        {/* Main Card */}
        <div
          className={`grid lg:grid-cols-5 rounded-4xl overflow-hidden border transition-all duration-1000 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "var(--shadow)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Left Side */}
          <div
            className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #8b6d5c 0%, #6f5547 100%)",
            }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-52 h-52 bg-[#c9a84c]/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <p className="uppercase tracking-[4px] text-xs text-[#f4e2a3] mb-3">
                Get In Touch
              </p>

              <h3 className="text-3xl font-black text-white leading-snug mb-10">
                Start Your <br /> Next Project
              </h3>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10">
                    <FaEnvelope className="text-[#f4e2a3] text-sm" />
                  </div>

                  <div>
                    <p className="text-[#f4e2a3] text-xs uppercase tracking-[3px] mb-2">
                      Email
                    </p>

                    <a
                      href="mailto:aman@example.com"
                      className="text-white text-sm sm:text-base hover:text-[#f4e2a3] transition-all duration-300 break-all"
                    >
                      aman@example.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10">
                    <FaPhoneAlt className="text-[#f4e2a3] text-sm" />
                  </div>

                  <div>
                    <p className="text-[#f4e2a3] text-xs uppercase tracking-[3px] mb-2">
                      Phone
                    </p>

                    <a
                      href="tel:+9779800000000"
                      className="text-white text-sm sm:text-base hover:text-[#f4e2a3] transition-all duration-300"
                    >
                      +977 9800000000
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10">
                    <FaMapMarkerAlt className="text-[#f4e2a3] text-sm" />
                  </div>

                  <div>
                    <p className="text-[#f4e2a3] text-xs uppercase tracking-[3px] mb-2">
                      Location
                    </p>

                    <p className="text-white text-sm sm:text-base">
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="relative z-10 mt-12">
              <p className="text-[#f4e2a3] text-xs uppercase tracking-[3px] mb-4">
                Follow
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#4f4532]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <FaInstagram />
                </a>

                <a
                  href="/"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#4f4532]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <FaFacebookF />
                </a>

                <a
                  href="/"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#4f4532]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="lg:col-span-3 p-8 sm:p-10 md:p-12">
            <h3
              className="text-3xl font-black mb-2"
              style={{ color: "var(--color-heading)" }}
            >
              Send Message
            </h3>

            <p
              className="text-sm mb-10"
              style={{ color: "var(--color-body)" }}
            >
              Fill out the form and let’s create something cinematic together.
            </p>

            <form className="space-y-6">
              {/* Inputs */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block mb-2 text-sm font-semibold"
                    style={{ color: "var(--color-heading)" }}
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-5 py-4 rounded-2xl border outline-none text-sm transition-all duration-300 focus:scale-[1.01] focus:border-[#c9a84c]"
                    style={{
                      borderColor: "rgba(79,69,50,0.08)",
                      backgroundColor: "rgba(255,255,255,0.55)",
                      color: "var(--color-body)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-semibold"
                    style={{ color: "var(--color-heading)" }}
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 rounded-2xl border outline-none text-sm transition-all duration-300 focus:scale-[1.01] focus:border-[#c9a84c]"
                    style={{
                      borderColor: "rgba(79,69,50,0.08)",
                      backgroundColor: "rgba(255,255,255,0.55)",
                      color: "var(--color-body)",
                    }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block mb-2 text-sm font-semibold"
                  style={{ color: "var(--color-heading)" }}
                >
                  Subject
                </label>

                <select
                  className="w-full px-5 py-4 rounded-2xl border outline-none text-sm transition-all duration-300 focus:border-[#c9a84c]"
                  style={{
                    borderColor: "rgba(79,69,50,0.08)",
                    backgroundColor: "rgba(255,255,255,0.55)",
                    color: "var(--color-body)",
                  }}
                >
                  <option>Select Subject</option>
                  <option>Film Collaboration</option>
                  <option>Music Video Project</option>
                  <option>Interview Request</option>
                  <option>Creative Partnership</option>
                  <option>Brand Collaboration</option>
                  <option>Media Inquiry</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  className="block mb-2 text-sm font-semibold"
                  style={{ color: "var(--color-heading)" }}
                >
                  Description
                </label>

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full px-5 py-4 rounded-2xl border outline-none resize-none text-sm transition-all duration-300 focus:scale-[1.01] focus:border-[#c9a84c]"
                  style={{
                    borderColor: "rgba(79,69,50,0.08)",
                    backgroundColor: "rgba(255,255,255,0.55)",
                    color: "var(--color-body)",
                  }}
                ></textarea>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="group relative overflow-hidden px-8 py-4 rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #4f4532 0%, #6a5a42 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(79,69,50,0.25)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Send Message
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>

                <div className="absolute inset-0 bg-[#c9a84c] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;