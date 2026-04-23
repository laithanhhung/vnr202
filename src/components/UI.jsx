import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

const pictures = Array.from({ length: 35 }, (_, i) => `${i + 2}`);

export const pageAtom = atom(0);
export const fixedPoseAtom = atom(false);
export const voiceVolumeAtom = atom(1.0);
export const voiceSpeedAtom = atom(1.0);
export const isMutedAtom = atom(false);

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}
pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [fixedPose, setFixedPose] = useAtom(fixedPoseAtom);
  const [voiceVolume, setVoiceVolume] = useAtom(voiceVolumeAtom);
  const [voiceSpeed, setVoiceSpeed] = useAtom(voiceSpeedAtom);
  const [isMuted, setIsMuted] = useAtom(isMutedAtom);

  const [audioEnabled, setAudioEnabled] = useState(false);

  // Enable audio after user interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  // Page flip sound
  useEffect(() => {
    if (!audioEnabled) return;
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, [page, audioEnabled]);

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      {/* Background scrolling text */}
      <div className="fixed inset-0 flex items-center -rotate-2 select-none pointer-events-none">
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black">Wawa Sensei</h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">React Three Fiber</h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">Three.js</h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">Ultimate Guide</h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">Tutorials</h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">Learn</h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">Practice</h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">Creative</h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black">Wawa Sensei</h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">React Three Fiber</h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">Three.js</h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">Ultimate Guide</h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">Tutorials</h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">Learn</h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">Practice</h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">Creative</h2>
          </div>
        </div>
      </div>

      {/* Main UI overlay */}
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col overflow-x-hidden">
        <a className="pointer-events-auto mt-10 ml-10" href=""></a>

        {/* Bottom Navbar */}
        <div className="pointer-events-auto flex justify-center pb-4 md:pb-6 mt-auto relative z-60 w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl px-4 py-2.5 flex items-center gap-4 md:gap-7 border border-gray-100/50">

            {/* Fixed Pose Toggle */}
            <div className="flex items-center border-r border-gray-200 pr-4 md:pr-7">
              <button
                title={fixedPose ? "Thoát cố định" : "Cố định camera"}
                onClick={() => setFixedPose(!fixedPose)}
                className={`transition-all duration-300 flex items-center gap-2 px-2 py-1.5 rounded-lg font-medium text-sm md:text-base ${
                  fixedPose
                    ? "text-blue-600 bg-blue-50/80"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={fixedPose ? "currentColor" : "none"} stroke="currentColor" strokeWidth={fixedPose ? "0" : "2.5"} strokeLinecap="round" strokeLinejoin="round">
                  {fixedPose ? (
                    <>
                      <path d="M12 2c.552 0 1 .448 1 1v6.586l2.293-2.293a1 1 0 111.414 1.414L12 13l-4.707-4.293a1 1 0 111.414-1.414L11 9.586V3c0-.552.448-1 1-1z" />
                      <path d="M5 21a1 1 0 010-2h14a1 1 0 010 2H5z" />
                    </>
                  ) : (
                    <>
                      <path d="M12 2v6.586l2.293-2.293a1 1 0 011.414 1.414L12 13l-4.707-4.293a1 1 0 011.414-1.414L11 9.586V2h1z" />
                      <path d="M5 21h14" />
                    </>
                  )}
                </svg>
                <span className="hidden md:inline">{fixedPose ? "Bỏ cố định" : "Cố định"}</span>
              </button>
            </div>

            {/* Prev / Page Indicator / Next */}
            <div className="flex items-center gap-4">
              {/* Prev */}
              <button
                title="Trang trước"
                className={`transition-colors flex items-center ${
                  page === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => page > 0 && handlePageClick(page - 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.5 12l8.5 6V6zM2 12l8.5 6V6z"></path>
                </svg>
              </button>

              {/* Page indicator */}
              <div className="flex items-center text-sm md:text-base font-bold rounded-lg overflow-hidden shrink-0 mx-1">
                <div className="bg-black text-white px-3 md:px-5 py-1.5 md:py-2 min-w-[3rem] text-center">
                  {page + 1}
                </div>
                <div className="bg-gray-700 text-gray-200 px-3 md:px-5 py-1.5 md:py-2 min-w-[3rem] text-center">
                  {pages.length + 1}
                </div>
              </div>

              {/* Next */}
              <button
                title="Trang sau"
                className={`transition-colors flex items-center ${
                  page >= pages.length ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => page < pages.length && handlePageClick(page + 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.5 12l-8.5-6v12zM22 12l-8.5-6v12z"></path>
                </svg>
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 md:pl-8 ml-2">
              {/* Mute Toggle */}
              <button
                title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
                className={`transition-colors p-2 ${isMuted ? "text-red-500" : "text-gray-500 hover:text-gray-800"}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className="w-16 md:w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  title={`Âm lượng: ${Math.round(voiceVolume * 100)}%`}
                />
              </div>

              {/* Speed Selector */}
              <div className="relative">
                <select
                  className="bg-transparent text-xs md:text-sm font-bold text-gray-600 hover:text-black cursor-pointer appearance-none outline-none border-none p-1"
                  value={voiceSpeed.toString()}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  title="Tốc độ"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Fullscreen */}
            <div className="flex items-center border-l border-gray-200 pl-4 md:pl-6 ml-2">
              <button
                title="Toàn màn hình"
                className="text-gray-500 hover:text-gray-800 transition-colors p-2"
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
