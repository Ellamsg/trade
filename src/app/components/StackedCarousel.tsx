import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Palette, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';

const StackedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      id: 1,
      title: "Privacy",
      description: "No  KYC required to use the app. We don't track your data.",
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

  const goToSlide = (index:number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why you should choose this 
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Platform.
          </h2>
        </div>

        {/* Stacked Carousel Container */}
        <div className="relative h-96 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Stacked Cards */}
            <div className="relative h-80 flex items-center justify-center">
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
                      className={`absolute w-80 h-72 rounded-2xl backdrop-blur-sm border border-white/20 cursor-pointer ${
                        isActive ? 'z-10' : 'z-0'
                      }`}
                      initial={{ 
                        x: offset * 100,
                        scale: 1 - absOffset * 0.1,
                        opacity: 1 - absOffset * 0.3,
                        rotateY: offset * 5
                      }}
                      animate={{ 
                        x: offset * 100,
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
                      <div className="p-8 h-full flex flex-col justify-center">
                        <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 text-white">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Auto-advance indicator */}
        <div className="flex justify-center mt-8">
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <span>Click cards or use arrows to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedCarousel;