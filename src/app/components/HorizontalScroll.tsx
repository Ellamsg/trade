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
    title: "The ultimate fusion of safety and elegance",
    description:
      "Three cards visible at once, creating a beautiful carousel effect",
    bgGradient: "from-red-400 to-orange-500",
    image  : "/assets/xrp.jpg",
  },
  {
    title: "Design",
    description: "Perfect spacing and smooth transitions between each section",
    bgGradient: "from-teal-400 to-green-500",
    image : "https://picsum.photos/200/300",
  },
  {
    title: "Code",
    description: "Built with GSAP ScrollTrigger for buttery smooth performance",
    bgGradient: "from-cyan-200 to-pink-200",
    textColor: "text-gray-800",
    image  : "https://picsum.photos/200/300",
  },
  {
    title: "Portfolio",
    description: "Showcase your work with this modern scrolling technique",
    bgGradient: "from-yellow-200 to-orange-200",
    textColor: "text-gray-800",
    image  : "https://picsum.photos/200/300",
  },
  {
    title: "Products",
    description: "Display multiple products or services side by side",
    bgGradient: "from-indigo-500 to-purple-600",
    image : "https://picsum.photos/200/300",
  },
  {
    title: "Gallery",
    description: "Perfect for image galleries or content showcases",
    bgGradient: "from-pink-300 to-purple-300",
    textColor: "text-gray-800",
    image : "https://picsum.photos/200/300",
  },
  {
    title: "Features",
    description: "Highlight key features with visual impact",
    bgGradient: "from-blue-200 to-indigo-200",
    textColor: "text-gray-800",
    image  : "https://picsum.photos/200/300",
  },
  {
    title: "Timeline",
    description: "Tell your story chronologically with style",
    bgGradient: "from-orange-200 to-pink-200",
    textColor: "text-gray-800",
    image  : "https://picsum.photos/200/300",
  },
  {
    title: "Finish",
    description: "End with a strong call-to-action or summary",
    bgGradient: "from-purple-200 to-pink-200",
    textColor: "text-gray-800",
    image : "https://picsum.photos/200/300",
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
              indicator.innerHTML = `Progress: ${Math.round(
                self.progress * 100
              )}%<br>Keep scrolling →`;
            } else {
              indicator.innerHTML = "Section complete!<br>Continue scrolling ↓";
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
        ref={indicatorRef}
        className="fixed pt-[100px] top-1/2 right-4 md:right-8 -translate-y-1/2 z-50 text-white text-sm bg-black/50 py-2 rounded backdrop-blur-sm"
      ></div>

      {/* Spacer Before */}
      <div className="relative h-[100vh]  bg-gradient-to-br ">
       
          <div className=" custom-text-7 md:flex justify-between px-[6%] md:px-[10%] w-full absolute bottom-19">
            <p className="md:w-[40%] w-[70%] md:leading-16">Want to explore Penta Stocks for Fuyture Crypto Experience </p>
            <p className="custom-2-text">Introductin Penta Stocks And Future tRsding</p>
          </div>

          <video
            poster="/images/pose2.jpeg"
            autoPlay
            loop
            muted
            x5-playsinline=""
            src="https://res.cloudinary.com/dalmrzjps/video/upload/v1750607897/Untitled_design-2_fjsr5e.mp4"
            className="w-full h-full object-cover "
          />
        
       
      </div>

      {/* Horizontal Scroll Section */}
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative flex items-center"
      >
        <div
          ref={horizontalRef}
          className="flex h-full"
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
                <h2 className="mb-4 text-3xl md:text-4xl font-bold drop-shadow-lg">
                  {panel.title}
                </h2>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                  {panel.description}
                </p>
             
                <img className="absolute -z-30 bottom-0 rounded-[12px] left-0 w-full h-full" src={panel.image} alt="Panel Image" />
             
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {/* Additional Spacer */}
     
    </>
  );
}
