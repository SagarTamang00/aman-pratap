import React, { useEffect, useState, useRef } from 'react';

const projects = [
    {
        id: 1,
        title: 'Echoes of the Himalayas',
        category: 'Feature Film',
        year: '2024',
        duration: '1h 42min',
        director: 'Aarav Shrestha',
        genre: 'Drama · Adventure',
        synopsis: 'A lone mountaineer discovers an ancient monastery hidden above the clouds, unraveling a mystery that has kept a valley frozen in time for centuries.',
        preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        youtube: 'IMWyrrrT39w',
    },
    {
        id: 2,
        title: 'The Silent Valley',
        category: 'Short Film',
        year: '2023',
        duration: '24min',
        director: 'Priya Tamang',
        genre: 'Drama · Mystery',
        synopsis: 'Two estranged siblings return to their childhood home in a remote valley to find that some silences speak louder than words ever could.',
        preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        youtube: 'dQw4w9WgXcQ',
    },
    {
        id: 3,
        title: 'Before the Monsoon',
        category: 'Documentary',
        year: '2023',
        duration: '58min',
        director: 'Bikash Gurung',
        genre: 'Documentary · Nature',
        synopsis: 'Following three farming families through the desperate weeks before the monsoon arrives — a portrait of hope, patience, and the rhythm of the earth.',
        preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        youtube: 'dQw4w9WgXcQ',
    },
    {
        id: 4,
        title: 'Red Clay',
        category: 'Short Film',
        year: '2022',
        duration: '18min',
        director: 'Sita Rai',
        genre: 'Drama · Coming-of-age',
        synopsis: "A young potter inherits her grandmother's wheel and discovers that every crack in the clay holds a story she was never meant to forget.",
        preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        youtube: 'dQw4w9WgXcQ',
    },
    {
        id: 5,
        title: 'Dust & Light',
        category: 'Commercial',
        year: '2022',
        duration: '3min',
        director: 'Aarav Shrestha',
        genre: 'Commercial · Lifestyle',
        synopsis: 'A cinematic brand film tracing the journey of handwoven textiles from highland looms to the hands of people who carry stories in their clothing.',
        preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        youtube: 'dQw4w9WgXcQ',
    },
];

const buildRows = (items) => {
    const rows = [];
    let i = 0;
    let bigFirst = true;
    while (i < items.length) {
        if (bigFirst) {
            rows.push({ type: 'double', items: items.slice(i, i + 2) });
            i += 2;
        } else {
            rows.push({ type: 'single', items: items.slice(i, i + 1) });
            i += 1;
        }
        bigFirst = !bigFirst;
    }
    return rows;
};

const VideoCard = ({ project, onOpen, isDouble }) => {
    const videoRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // React's `muted` prop is broken — it sets the HTML attribute but NOT
        // the DOM property, so Chrome ignores it for autoplay gating.
        // Setting the property directly here is the real fix.
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;

        const attemptPlay = () => {
            if (!video.paused) return;
            video.play().catch(() => {
                // If still blocked (very strict browser settings),
                // retry on first user scroll or click
                const retryOnInteraction = () => {
                    video.play().catch(() => { });
                    document.removeEventListener('scroll', retryOnInteraction);
                    document.removeEventListener('click', retryOnInteraction);
                };
                document.addEventListener('scroll', retryOnInteraction, { once: true });
                document.addEventListener('click', retryOnInteraction, { once: true });
            });
        };

        // Use native addEventListener, NOT React's onCanPlay prop —
        // React synthetic events can miss canplay if it fires before mount completes
        if (video.readyState >= 3) {
            // Already buffered (cached / hot reload)
            attemptPlay();
        } else {
            video.addEventListener('canplay', attemptPlay, { once: true });
        }

        return () => {
            video.removeEventListener('canplay', attemptPlay);
        };
    }, []);

    return (
        <div
            className={`relative cursor-pointer overflow-hidden w-full ${isDouble ? 'md:flex-1 aspect-video' : 'md:w-full aspect-video'
                }`}
            style={{
                borderRadius: '16px',
                background: '#0d0b09',
                border: '1px solid rgba(201,168,76,0.12)',
                boxShadow: hovered
                    ? '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.1)'
                    : '0 8px 32px rgba(0,0,0,0.5)',
                transition: 'box-shadow 0.5s ease, transform 0.5s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onOpen(project)}
        >
            {/*
                Video is ALWAYS in the DOM, ALWAYS visible (no opacity:0 toggle).
                Hiding/toggling it resets buffering and breaks autoplay.
                The dark card background handles the "before load" appearance.
            */}
            <video
                ref={videoRef}
                src={project.preview}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    transform: hovered ? 'scale(1.06)' : 'scale(1)',
                    filter: hovered ? 'brightness(0.3)' : 'brightness(0.85)',
                    transition: 'transform 0.8s ease, filter 0.6s ease',
                }}
            />

            {/* Hover overlay */}
            <div
                className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
                style={{
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                    background:
                        'linear-gradient(to top, rgba(9,8,6,0.92) 0%, rgba(9,8,6,0.5) 50%, rgba(9,8,6,0.2) 100%)',
                    pointerEvents: hovered ? 'auto' : 'none',
                }}
            >
                {/* Top: category + year/duration */}
                <div className="flex items-start justify-between">
                    <span
                        className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] px-2 sm:px-3 py-1"
                        style={{
                            background: 'rgba(9,8,6,0.6)',
                            border: '1px solid rgba(201,168,76,0.35)',
                            color: '#c9a84c',
                            fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            borderRadius: '2px',
                        }}
                    >
                        {project.category}
                    </span>
                    <div className="flex flex-col items-end gap-0.5">
                        <span
                            className="text-[9px] uppercase tracking-[0.3em]"
                            style={{
                                color: 'rgba(245,240,232,0.5)',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            {project.year}
                        </span>
                        <span
                            className="text-[9px] uppercase tracking-[0.25em]"
                            style={{
                                color: 'rgba(201,168,76,0.7)',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            {project.duration}
                        </span>
                    </div>
                </div>

                {/* Middle: synopsis */}
                <div className="flex flex-col gap-2 px-1">
                    <div
                        style={{
                            height: '1px',
                            background: 'linear-gradient(to right, rgba(201,168,76,0.6), transparent)',
                            width: hovered ? '50px' : '0px',
                            transition: 'width 0.5s ease 0.1s',
                        }}
                    />
                    <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{
                            color: 'rgba(245,240,232,0.75)',
                            fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            fontStyle: 'italic',
                            maxWidth: '480px',
                            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                            transition: 'transform 0.45s ease 0.05s',
                        }}
                    >
                        {project.synopsis}
                    </p>
                </div>

                {/* Bottom: genre + title + director + watch */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p
                            className="text-[8px] uppercase tracking-[0.3em] mb-1"
                            style={{
                                color: 'rgba(201,168,76,0.55)',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            {project.genre}
                        </p>
                        <h3
                            className="font-black uppercase leading-none"
                            style={{
                                fontFamily: 'var(--font-heading, "Bebas Neue", "Impact", sans-serif)',
                                fontSize: isDouble ? 'clamp(20px, 3vw, 34px)' : 'clamp(24px, 4vw, 48px)',
                                color: '#f5f0e8',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {project.title}
                        </h3>
                        <p
                            className="text-[9px] mt-1"
                            style={{
                                color: 'rgba(245,240,232,0.4)',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            Dir. {project.director}
                        </p>
                    </div>

                    {/* Watch button */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '42px',
                                height: '42px',
                                border: '1px solid rgba(201,168,76,0.7)',
                                borderRadius: '50%',
                                background: 'rgba(9,8,6,0.5)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <div
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '7px solid transparent',
                                    borderBottom: '7px solid transparent',
                                    borderLeft: '13px solid #c9a84c',
                                    marginLeft: '3px',
                                }}
                            />
                        </div>
                        <span
                            className="hidden sm:inline text-[8px] uppercase tracking-[0.35em]"
                            style={{
                                color: '#c9a84c',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            Watch
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Video Modal
const VideoModal = ({ project, onClose }) => {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4 sm:p-8"
            style={{ background: 'rgba(9,8,6,0.96)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
        >
            <div
                className="relative w-full flex flex-col"
                style={{ maxWidth: '1000px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span
                            className="text-[9px] uppercase tracking-[0.4em] px-3 py-1 w-max"
                            style={{
                                border: '1px solid rgba(201,168,76,0.3)',
                                color: '#c9a84c',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                                borderRadius: '2px',
                            }}
                        >
                            {project.category}
                        </span>
                        <h2
                            className="font-black uppercase leading-none"
                            style={{
                                fontFamily: 'var(--font-heading, "Bebas Neue", "Impact", sans-serif)',
                                fontSize: 'clamp(20px, 4vw, 28px)',
                                color: '#f5f0e8',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {project.title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 shrink-0 group pt-1"
                    >
                        <span
                            className="hidden sm:inline text-[10px] uppercase tracking-[0.35em] transition-colors duration-300"
                            style={{
                                color: 'rgba(245,240,232,0.4)',
                                fontFamily: 'var(--font-body, "EB Garamond", serif)',
                            }}
                        >
                            Close
                        </span>
                        <div
                            className="transition-colors duration-300 group-hover:text-[#c9a84c]"
                            style={{ color: 'rgba(245,240,232,0.4)', fontSize: '20px', lineHeight: 1 }}
                        >
                            ✕
                        </div>
                    </button>
                </div>

                <div
                    className="relative w-full overflow-hidden"
                    style={{
                        aspectRatio: '16/9',
                        borderRadius: '12px',
                        border: '1px solid rgba(201,168,76,0.15)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
                        backgroundColor: '#000'
                    }}
                >
                    {project.youtube ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${project.youtube}?autoplay=1&rel=0&modestbranding=1`}
                            title={project.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <video
                            src={project.preview}
                            controls
                            autoPlay
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ border: 'none' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const [activeProject, setActiveProject] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const rows = buildRows(projects);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
    }, []);

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className="relative w-full min-h-screen bg-(--color-bg,#1F4959) py-24 overflow-hidden"
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
                    }}
                />

                <div className="container mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
                    <div
                        className="mb-16"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                            transition: 'all 0.9s ease',
                        }}
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div
                                className="h-px w-12"
                                style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <h2
                                className="font-black uppercase leading-none"
                                style={{
                                    fontFamily: 'var(--font-heading, "Bebas Neue", "Impact", sans-serif)',
                                    fontSize: 'clamp(48px, 9vw, 96px)',
                                    color: '#f5f0e8',
                                }}
                            >
                                The{' '}
                                <span
                                    className="text-transparent bg-clip-text"
                                    style={{ color: "var(--color-accent)", }}
                                >
                                    Movies
                                </span>
                            </h2>
                            <p
                                className="text-sm pb-2"
                                style={{
                                    color: 'rgba(245,240,232,0.35)',
                                    fontFamily: 'var(--font-body, "EB Garamond", serif)',
                                    fontStyle: 'italic',
                                }}
                            >
                                Click any film to watch on YouTube
                            </p>
                        </div>

                        <div
                            className="mt-8 h-px"
                            style={{
                                background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)',
                                width: isVisible ? '100%' : '0%',
                                transition: 'width 1.2s ease 0.3s',
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-5">
                        {rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="flex flex-col md:flex-row gap-5"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `opacity 0.7s ease ${0.2 + rowIndex * 0.15}s, transform 0.7s ease ${0.2 + rowIndex * 0.15}s`,
                                }}
                            >
                                {row.items.map((project) => (
                                    <VideoCard
                                        key={project.id}
                                        project={project}
                                        onOpen={setActiveProject}
                                        isDouble={row.type === 'double'}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {activeProject && (
                <VideoModal
                    project={activeProject}
                    onClose={() => setActiveProject(null)}
                />
            )}
        </>
    );
};

export default Projects;