


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Palette, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';

const StackedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      id: 1,
      title: "Privacy",
      description: "No KYC required to use the app. We don't track your data.",
      icon: Shield,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Security",
      description: "Your private keys are encrypted and never leave your device. Only you have control over your funds.",
      icon: Lock,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Convenient designs",
      description: "Choose from a variety of stocks.",
      icon: Palette,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "24/7 Customer Support",
      description: "Fast support available around the clock with live chat and comprehensive customer service.",
      icon: Headphones,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className=" text-white flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center leading-13 md:leading-19 mb-8 md:mb-16">
          <h1 className="custom-3-text font-bold mb-4 md:mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why you should choose this 
          </h1>
          <h2 className="custom-3-text  font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Platform.
          </h2>
        </div>

        {/* Stacked Carousel Container */}
        <div className="relative w-full h-64 md:h-96">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Stacked Cards */}
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
            <AnimatePresence mode="wait">
              {features.map((feature, index) => {
                const offset = index - currentIndex;
                const absOffset = Math.abs(offset);
                const isActive = index === currentIndex;
                const Icon = feature.icon;
                
                // Don't render cards that are too far away
                if (absOffset > 2) return null;

                return (
                  <motion.div
                    key={feature.id}
                    className={`absolute w-64 md:w-80 h-56 md:h-72 rounded-2xl backdrop-blur-sm border border-white/20 cursor-pointer ${
                      isActive ? 'z-10' : 'z-0'
                    }`}
                    initial={{ 
                      x: offset * 80,
                      scale: 1 - absOffset * 0.1,
                      opacity: 1 - absOffset * 0.3,
                      rotateY: offset * 5
                    }}
                    animate={{ 
                      x: offset * 80,
                      scale: 1 - absOffset * 0.1,
                      opacity: 1 - absOffset * 0.3,
                      rotateY: offset * 5,
                      zIndex: isActive ? 10 : 5 - absOffset
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    onClick={() => goToSlide(index)}
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, rgba(${feature.gradient.includes('purple') ? '139, 69, 19' : feature.gradient.includes('blue') ? '59, 130, 246' : feature.gradient.includes('green') ? '34, 197, 94' : '249, 115, 22'}, 0.2), rgba(0, 0, 0, 0.8))`
                        : 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="p-4 md:p-8 h-full flex flex-col justify-center">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                        <Icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-white">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 md:mt-12 space-x-2 md:space-x-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Auto-advance indicator */}
        <div className="flex justify-center mt-4 md:mt-8">
          <div className="text-xs md:text-sm text-gray-500 flex items-center space-x-2">
            <span>Click cards or use arrows to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedCarousel;