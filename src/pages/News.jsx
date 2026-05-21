import React, { useEffect, useState } from "react";

const newsData = [
  {
    id: 1,
    title: "Aman Pratap Adhikary Announces New Cinematic Project",
    description:
      "Nepali film director Aman Pratap Adhikary reveals details about his upcoming visually driven storytelling project inspired by Himalayan culture.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    link: "https://example.com/aman-project",
    category: "Film Direction",
    date: "May 9, 2026",
  },
  {
    id: 2,
    title: "Behind the Scenes with Aman Pratap Adhikary",
    description:
      "An exclusive look into Aman’s creative filmmaking process, cinematic vision, and storytelling techniques used in modern Nepali cinema.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    link: "https://example.com/behind-scenes",
    category: "Behind The Scenes",
    date: "May 7, 2026",
  },
  {
    id: 3,
    title: "The Rise of Independent Cinema in Nepal",
    description:
      "Director Aman Pratap Adhikary shares insights on the future of independent films, artistic freedom, and global recognition of Nepali cinema.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
    link: "https://example.com/independent-cinema",
    category: "Cinema",
    date: "May 5, 2026",
  },
  {
    id: 4,
    title: "The Rise of Independent Cinema in Nepal",
    description:
      "Director Aman Pratap Adhikary shares insights on the future of independent films, artistic freedom, and global recognition of Nepali cinema.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
    link: "https://example.com/independent-cinema",
    category: "Cinema",
    date: "May 5, 2026",
  },
];

const NewsCard = ({ news, index, showCards }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className={`group rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:scale-[1.02] ${
        showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: hovered
          ? "0 12px 24px rgba(0, 0, 0, 0.12)"
          : "0 4px 8px rgba(0, 0, 0, 0.06)",
        transitionDelay: showCards ? "0ms" : `${index * 200}ms`,
        transition: "opacity 700ms, transform 700ms, box-shadow 300ms ease, border-color 300ms",
      }}
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category + Date */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs md:text-sm font-semibold px-4 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-accent-light)",
            }}
          >
            {news.category}
          </span>

          <span
            className="text-sm"
            style={{ color: "var(--color-body)" }}
          >
            {news.date}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold mb-3 leading-snug transition duration-300 group-hover:text-(--color-primary)"
          style={{ color: "var(--color-heading)" }}
        >
          {news.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-body)" }}
        >
          {news.description}
        </p>

        {/* Read More */}
        <div
          className="mt-6 inline-flex items-center gap-2 font-semibold transition-all duration-300 group-hover:translate-x-2"
          style={{ color: "var(--color-accent)" }}
        >
          Read More
          <span>→</span>
        </div>
      </div>
    </a>
  );
};

const News = () => {
  const [showCards, setShowCards] = useState(false);

  // Fade In Animation on Refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="py-20 px-6 mt-16 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-section)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div
          className={`text-center mb-14 transition-all duration-1000 ${showCards
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
            }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-heading)" }}
          >
            News & Blogs
          </h2>

          <p
            className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--color-body)" }}
          >
            Explore the latest updates, cinematic stories, behind-the-scenes
            insights, and creative journeys of Nepali film director
            <span
              className="font-semibold ml-1"
              style={{ color: "var(--color-primary)" }}
            >
              Aman Pratap Adhikary
            </span>
            .
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {newsData.map((news, index) => (
            <NewsCard
              key={news.id}
              news={news}
              index={index}
              showCards={showCards}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;