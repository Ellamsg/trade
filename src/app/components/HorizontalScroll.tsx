"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PanelData {
  title: string;
  description: string;
  bgGradient: string;
  textColor?: string;
  image  :string;
}

const panelData: PanelData[] = [
  {
    title: "Real-Time Market Insights at Your Fingertips",
    description: "Track live price movements with an intuitive, dynamic interface",
    bgGradient: "from-red-400 to-orange-500",
    image: "/assets/trade1.webp",
  },
  {
    title: "Seamless Portfolio Visualization",
    description: "Effortlessly analyze asset allocation with smooth transitions",
    bgGradient: "from-teal-400 to-green-500",
    image: "https://img.freepik.com/free-vector/abstract-red-light-lines-pipe-speed-zoom-black-background-technology_1142-8971.jpg",
  },
  {
    title: "Precision Trading Analytics",
    description: "Powered by real-time data feeds for ultra-responsive performance",
    bgGradient: "from-cyan-200 to-pink-200",
    textColor: "text-gray-800",
    image: "/assets/trade2.jpeg",
  },
  {
    title: "Dynamic Stock Performance Dashboard",
    description: "Monitor gains, losses, and trends in a sleek, interactive layout",
    bgGradient: "from-yellow-200 to-orange-200",
    textColor: "text-gray-800",
    image: "https://www.investopedia.com/thmb/6KhgRu9qCjMWQnTneIGMdxzN3Z0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/stock-market-crash-sell-off---trading-screen-in-red-104271845-565bca2f055c47558a2d17ec3563a4dd.jpg",
  },
  {
    title: "Multi-Asset Trading Platform",
    description: "Stocks, crypto, forex—all in one unified workspace",
    bgGradient: "from-indigo-500 to-purple-600",
    image: "/assets/trade3.jpeg",
  },
  {
    title: "Advanced Charting Tools",
    description: "Candlesticks, moving averages, and technical indicators built-in",
    bgGradient: "from-pink-300 to-purple-300",
    textColor: "text-gray-800",
    image: "https://cdn.businessday.ng/2022/12/VV-47-1.png",
  },
  {
    title: "Risk Management Hub",
    description: "Set stop-losses, take-profit levels, and volatility alerts",
    bgGradient: "from-blue-200 to-indigo-200",
    textColor: "text-gray-800",
    image: "https://insight.kellogg.northwestern.edu/imager/clientcontent/565452/Full_0125_volatility-Index_e501e24c91d1dd1bb53c2057524667f0.jpg",
  },
  {
    title: "Market Sentiment Timeline",
    description: "Visualize news events and price reactions in chronological flow",
    bgGradient: "from-orange-200 to-pink-200",
    textColor: "text-gray-800",
    image: "/assets/trade4.jpg",
  },
  {
    title: "Trade Execution Terminal",
    description: "Execute orders with institutional-grade speed and reliability",
    bgGradient: "from-purple-200 to-pink-200",
    textColor: "text-gray-800",
    image: "https://images.squarespace-cdn.com/content/v1/637cf7273bbb7f7d32484e43/1710939812278-DSHFBJV67WK4JA3GRQJO/smoke-on-black-background-stock-photo-glenn-meling-0132.jpg",
  },
];

export default function HorizontalCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !horizontalRef.current) return;

    const container = horizontalRef.current;
    const progressBar = progressRef.current;
    const indicator = indicatorRef.current;

    // Calculate total scroll distance
    const totalWidth = container.scrollWidth - window.innerWidth;

    // Create the main horizontal scroll animation
    const horizontalScroll = gsap.to(container, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update progress bar
          if (progressBar) {
            gsap.set(progressBar, {
              scaleX: self.progress,
            });
          }

          // Update scroll indicator
          if (indicator) {
            if (self.progress < 1) {
              indicator.innerHTML = ` ${Math.round(
                self.progress * 100
              )}%<br>Keep scrolling →`;
            } else {
              indicator.innerHTML = "";
            }
          }
        },
      },
    });

    // Add subtle parallax effect to panel content
    const panels = container.querySelectorAll(".panel");
    panels.forEach((panel) => {
      const content = panel.querySelector(".panel-content");

      if (content) {
        gsap.fromTo(
          content,
          {
            y: 50,
            opacity: 0.8,
          },
          {
            y: -50,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "left right",
              end: "right left",
              scrub: 1,
              containerAnimation: horizontalScroll,
            },
          }
        );
      }
    });

    // Handle resize
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // Initialize progress bar
    if (progressBar) {
      gsap.set(progressBar, { scaleX: 0 });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-1  z-50"
        style={{ transformOrigin: "left" }}
      />

      {/* Scroll Indicator */}
      <div
        
        className="fixed pt-[100px] top-1/2 right-4 md:right-8 -translate-y-1/2 z-50 text-white text-sm bg-black/50 py-2 rounded backdrop-blur-sm"
      ></div>

      {/* Spacer Before */}
      <div className="relative h-[100vh]  bg-gradient-to-br ">
       
          <div className=" custom-text-7 md:flex justify-between px-[6%] md:px-[10%] w-full absolute bottom-19">
            <p className="md:w-[40%] w-[70%] md:leading-16">Want to explore Penta Stocks for Future Trading Experience </p>
            <p className="custom-2-text">Introducting Penta Stocks And Future trading</p>
          </div>

          <video
            poster="/images/pose2.jpeg"
            autoPlay
            loop
            muted
            playsInline
            x5-playsinline=""
            src="https://res.cloudinary.com/dalmrzjps/video/upload/v1751442343/dollar_dgr2z5.mp4"
            className="w-full h-full object-cover "
          />
        
       
      </div>

      {/* Horizontal Scroll Section */}
      <div
        ref={containerRef}
        className="h-screen overflow-hidden  relative flex items-center"
      >
        <div
          ref={horizontalRef}
          className="flex md:h-full"
          style={{ willChange: "transform" }}
        >
          {panelData.map((panel, index) => (
            <div
              key={index}
              className={`panel 
                  h-full flex items-center 
                 justify-center relative text-2xl font-bold flex-shrink-0 bg-gradient-to-br `}
            >
              <div className={`panel-content relative h-[500px] w-[400px] p-6 rounded-[12px] text-start max-w-[80%] }`}>
                <h2 className="mb-4 text-2xl md:text-4xl font-bold drop-shadow-lg">
                  {panel.title}
                </h2>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                  {panel.description}
                </p>
             
                <img className="absolute -z-30 bottom-0 rounded-[12px] left-0 w-full h-full  " src={panel.image} alt="Panel Image" />
             
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {/* Additional Spacer */}
     
    </>
  );
}
