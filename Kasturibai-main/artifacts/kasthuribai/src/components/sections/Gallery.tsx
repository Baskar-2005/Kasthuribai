import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Pause, Image, Video, Grid3X3 } from "lucide-react";

const GALLERY_IMAGES = [
  "/images/gallery/image1.jpeg",
  "/images/gallery/image2.jpeg",
  "/images/gallery/image3.jpeg",
  "/images/gallery/image4.jpeg",
  "/images/gallery/image5.jpeg",
  "/images/gallery/image6.jpeg",
  "/images/gallery/image7.jpeg",
  "/images/gallery/image8.jpeg",
  "/images/gallery/image9.jpeg",
  "/images/gallery/image10.jpeg",
  "/images/gallery/image11.jpeg",
];

const GALLERY_VIDEOS = [
  "/images/gallery/video1.mp4",
  "/images/gallery/video2.mp4",
  "/images/gallery/video3.mp4",
  "/images/gallery/video4.mp4",
  "/images/gallery/video5.mp4",
  "/images/gallery/video6.mp4",
  "/images/gallery/video7.mp4",
  "/images/gallery/video8.mp4",
  "/images/gallery/video9.mp4",
  "/images/gallery/video10.mp4",
];

type FilterType = "all" | "photos" | "videos";

interface GalleryItem {
  type: "image" | "video";
  src: string;
  index: number;
}

function VideoThumbnail({ src, index, onClick }: { src: string; index: number; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative w-full aspect-square overflow-hidden rounded-lg sm:rounded-xl cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        playsInline
        preload="metadata"
      />
      
      {/* Play button overlay - visible when not hovered */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/95 rounded-full flex items-center justify-center shadow-xl">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-primary ml-0.5" />
          </div>
        </div>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 sm:pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 text-white">
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs font-semibold">Click to view</span>
        </div>
      </div>
    </div>
  );
}

function ImageThumbnail({ src, index, onClick }: { src: string; index: number; onClick: () => void }) {
  return (
    <div
      className="relative w-full aspect-square overflow-hidden rounded-lg sm:rounded-xl cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={src}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 sm:pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 text-white">
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs font-semibold">Click to view</span>
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const getFilteredItems = (): GalleryItem[] => {
    if (filter === "photos") {
      return GALLERY_IMAGES.map((src, i) => ({ type: "image" as const, src, index: i }));
    } else if (filter === "videos") {
      return GALLERY_VIDEOS.map((src, i) => ({ type: "video" as const, src, index: i }));
    } else {
      return [
        ...GALLERY_IMAGES.map((src, i) => ({ type: "image" as const, src, index: i })),
        ...GALLERY_VIDEOS.map((src, i) => ({ type: "video" as const, src, index: i })),
      ];
    }
  };

  const filteredItems = getFilteredItems();

  // Auto-slide the lightbox
  useEffect(() => {
    if (!autoPlay || lightboxIdx === null) return;
    const interval = setInterval(() => {
      setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPlay, lightboxIdx, filteredItems.length]);

  const prevItem = () => setLightboxIdx((prev) => 
    prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
  );
  
  const nextItem = () => setLightboxIdx((prev) => 
    prev === null ? null : (prev + 1) % filteredItems.length
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { 
      window.removeEventListener("keydown", handleKey); 
      document.body.style.overflow = ""; 
    };
  }, [lightboxIdx]);

  const currentItem = lightboxIdx !== null ? filteredItems[lightboxIdx] : null;

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-primary font-body font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Our Story in Pictures
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-2 mb-3 sm:mb-4">
            Gallery
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body text-sm sm:text-base px-4">
            Explore our collection of beautiful moments, stunning outfits, and memorable events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-10 px-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-body font-semibold transition-all duration-300 ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            All ({GALLERY_IMAGES.length + GALLERY_VIDEOS.length})
          </button>
          <button
            onClick={() => setFilter("photos")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-body font-semibold transition-all duration-300 ${
              filter === "photos"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            }`}
          >
            <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Photos ({GALLERY_IMAGES.length})
          </button>
          <button
            onClick={() => setFilter("videos")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-body font-semibold transition-all duration-300 ${
              filter === "videos"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            }`}
          >
            <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Videos ({GALLERY_VIDEOS.length})
          </button>
        </div>

        {/* Grid Layout - Perfect Alignment for Mobile */}
        <motion.div
          layout
          className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                layout
                key={`${item.type}-${item.index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {item.type === "video" ? (
                  <VideoThumbnail
                    src={item.src}
                    index={item.index}
                    onClick={() => setLightboxIdx(i)}
                  />
                ) : (
                  <ImageThumbnail
                    src={item.src}
                    index={item.index}
                    onClick={() => setLightboxIdx(i)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 text-center px-2">
          <div className="bg-secondary/30 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 min-w-[80px] sm:min-w-[100px]">
            <div className="text-2xl sm:text-3xl font-display font-bold text-primary">{GALLERY_IMAGES.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-body">Photos</div>
          </div>
          <div className="bg-secondary/30 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 min-w-[80px] sm:min-w-[100px]">
            <div className="text-2xl sm:text-3xl font-display font-bold text-primary">{GALLERY_VIDEOS.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-body">Videos</div>
          </div>
          <div className="bg-secondary/30 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 min-w-[80px] sm:min-w-[100px]">
            <div className="text-2xl sm:text-3xl font-display font-bold text-primary">{GALLERY_IMAGES.length + GALLERY_VIDEOS.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-body">Total Media</div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && currentItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" 
              onClick={() => setLightboxIdx(null)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Auto-play toggle */}
            <button
              className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-body font-semibold transition-all z-10 flex items-center gap-1.5 sm:gap-2 ${
                autoPlay 
                  ? "bg-gold text-black shadow-lg shadow-gold/30" 
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
              onClick={(e) => { e.stopPropagation(); setAutoPlay(!autoPlay); }}
            >
              {autoPlay ? (
                <>
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Auto Play
                </>
              )}
            </button>

            {/* Previous button */}
            <button 
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" 
              onClick={(e) => { e.stopPropagation(); prevItem(); }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Media Content */}
            <motion.div
              key={lightboxIdx}
              className="max-w-5xl w-full mx-8 sm:mx-16 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.type === "image" ? (
                <img 
                  src={currentItem.src} 
                  alt={`Gallery image ${currentItem.index + 1}`} 
                  className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl" 
                />
              ) : (
                <div className="relative w-full max-w-4xl">
                  <video
                    src={currentItem.src}
                    className="w-full max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                    controls
                    autoPlay
                    playsInline
                  />
                </div>
              )}
            </motion.div>

            {/* Next button */}
            <button 
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" 
              onClick={(e) => { e.stopPropagation(); nextItem(); }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10 max-w-xl overflow-x-auto px-4 py-2">
              {filteredItems.map((item, i) => (
                <button
                  key={`${item.type}-${item.index}`}
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`flex-shrink-0 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    i === lightboxIdx 
                      ? "bg-gold w-6 sm:w-8" 
                      : item.type === "video" 
                        ? "bg-red-400/60 w-1.5 sm:w-2 hover:bg-red-400" 
                        : "bg-white/40 w-1.5 sm:w-2 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Caption */}
            <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 text-center">
              <span className="text-white font-body font-semibold text-xs sm:text-sm bg-black/60 backdrop-blur-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2">
                {currentItem.type === "image" ? (
                  <>
                    <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Photo {currentItem.index + 1}
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Video {currentItem.index + 1}
                  </>
                )}
                <span className="text-white/60">·</span>
                <span>{lightboxIdx + 1} / {filteredItems.length}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
