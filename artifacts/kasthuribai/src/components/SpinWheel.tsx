import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PRIZES = [
  { label: "10% OFF", color: "#7D1A35", textColor: "#fff" },
  { label: "20% OFF", color: "#D4A035", textColor: "#000" },
  { label: "Free Gift", color: "#7D1A35", textColor: "#fff" },
  { label: "5% OFF", color: "#D4A035", textColor: "#000" },
  { label: "15% OFF", color: "#7D1A35", textColor: "#fff" },
  { label: "Try Again", color: "#D4A035", textColor: "#000" },
];

export function SpinWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Random rotation between 1800 and 3600 degrees (5-10 full spins)
    const spins = Math.floor(Math.random() * 5) + 5;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + extraDegrees;

    setRotation(totalRotation);

    // Calculate which prize was landed on
    // The pointer is at the top (0 degrees), so we need to calculate which segment is under it
    const normalizedRotation = totalRotation % 360;
    const segmentAngle = 360 / PRIZES.length;
    // Adjust for the pointer being at the top and the wheel rotating clockwise
    const pointerAngle = (360 - normalizedRotation + segmentAngle / 2) % 360;
    const prizeIndex = Math.floor(pointerAngle / segmentAngle);
    const prize = PRIZES[prizeIndex];

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prize.label);
    }, 4000);
  };

  const closeModal = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#7D1A35] to-[#D4A035] text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-all text-[11px] font-body font-semibold shadow-md hover:shadow-lg"
      >
        <span className="text-base">🎡</span>
        <span>Try Your Luck 🎁</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-logo font-bold text-[#7D1A35] mb-2">
                  🎡 Spin the Wheel!
                </h2>
                <p className="text-sm text-gray-600 font-body">
                  Try your luck and win amazing discounts!
                </p>
              </div>

              {/* Wheel */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#7D1A35]" />
                </div>

                {/* Wheel SVG */}
                <svg
                  width="256"
                  height="256"
                  viewBox="0 0 256 256"
                  className="drop-shadow-lg"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                      : "none",
                  }}
                >
                  {PRIZES.map((prize, index) => {
                    const angle = (index * 360) / PRIZES.length;
                    const startAngle = (angle * Math.PI) / 180;
                    const endAngle =
                      ((angle + 360 / PRIZES.length) * Math.PI) / 180;

                    const x1 = 128 + 120 * Math.cos(startAngle);
                    const y1 = 128 + 120 * Math.sin(startAngle);
                    const x2 = 128 + 120 * Math.cos(endAngle);
                    const y2 = 128 + 120 * Math.sin(endAngle);

                    const largeArcFlag =
                      360 / PRIZES.length > 180 ? 1 : 0;

                    const midAngle =
                      ((angle + 360 / PRIZES.length / 2) * Math.PI) / 180;
                    const textX = 128 + 70 * Math.cos(midAngle);
                    const textY = 128 + 70 * Math.sin(midAngle);

                    return (
                      <g key={index}>
                        <path
                          d={`M 128 128 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={prize.color}
                          stroke="#fff"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={prize.textColor}
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="Inter, sans-serif"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${angle + 360 / PRIZES.length / 2}, ${textX}, ${textY})`}
                        >
                          {prize.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center circle */}
                  <circle cx="128" cy="128" r="25" fill="#fff" stroke="#7D1A35" strokeWidth="3" />
                  <text
                    x="128"
                    y="128"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fill="#7D1A35"
                  >
                    🎁
                  </text>
                </svg>
              </div>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-4"
                >
                  <div className="inline-block bg-gradient-to-r from-[#7D1A35] to-[#D4A035] text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                    🎉 You won: {result}!
                  </div>
                </motion.div>
              )}

              {/* Spin button */}
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`w-full py-3 rounded-full font-bold text-white transition-all ${
                  isSpinning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#7D1A35] to-[#D4A035] hover:opacity-90 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSpinning ? "Spinning..." : "SPIN NOW! 🎡"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 font-body">
                * Discount applies to your next purchase
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
