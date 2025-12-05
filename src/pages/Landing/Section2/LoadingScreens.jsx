import { useState, useEffect } from "react";

const loadingScreens = [
  {
    id: 1,
    title: "Discovering Hidden Gems",
    description: "We're searching through thousands of restaurants to find the perfect match for you.",
    image: "/assets/restaurant-seating.webp",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Comparing Best Deals",
    description: "Scanning multiple platforms to bring you the best prices and availability.",
    image: "/assets/comp1.png",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Finding Your Perfect Table",
    description: "Matching your preferences with available reservations across top restaurants.",
    image: "/assets/restraunt-wallpaper.jpg",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Almost There!",
    description: "Finalizing your personalized restaurant recommendations.",
    image: "/assets/main-page.jpg",
    color: "from-green-500 to-teal-500"
  }
];

export default function LoadingScreens() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      
      setTimeout(() => {
        setCurrentScreen((prev) => {
          const next = (prev + 1) % loadingScreens.length;
          return next;
        });
        setFadeState("fade-in");
      }, 400); // 400ms for fade out
    }, 2000); // Show each screen for 2 seconds

    return () => clearInterval(interval);
  }, []);

  const screen = loadingScreens[currentScreen];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          fadeState === "fade-in" ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${screen.image})`,
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${screen.color} opacity-80`}></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
          <div className="max-w-2xl mx-auto">
            {/* Animated Loading Indicator */}
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-white/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-white/40 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-agrandir drop-shadow-lg">
              {screen.title}
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/95 mb-8 font-roboto drop-shadow-md max-w-xl mx-auto leading-relaxed">
              {screen.description}
            </p>

            {/* Progress Dots */}
            <div className="flex justify-center gap-3 mt-10">
              {loadingScreens.map((_, index) => (
                <div
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                    index === currentScreen
                      ? "bg-white w-10 shadow-lg"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

