import { useEffect, useRef, useState } from "react";

export function WelcomeAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/owner1.mp3");
    audio.volume = 1; // Set volume to 100%
    audioRef.current = audio;

    // Try to play audio automatically
    const playAudio = async () => {
      try {
        await audio.play();
        // If autoplay succeeds, hide button
        setShowButton(false);
      } catch (error) {
        console.log("Audio autoplay prevented by browser:", error);
        // Show button for manual play
        setShowButton(true);
      }
    };

    // Small delay to ensure page is loaded
    const timer = setTimeout(() => {
      playAudio();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setShowButton(false);
      } catch (error) {
        console.log("Error playing audio:", error);
      }
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <button
      onClick={handlePlay}
      className="fixed bottom-4 right-4 z-50 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
      aria-label="Play welcome audio"
    >
      <span>🔊</span>
      <span className="text-sm font-body">Play Welcome</span>
    </button>
  );
}
