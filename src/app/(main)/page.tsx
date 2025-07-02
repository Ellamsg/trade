// "use client";

// import React from "react";
// import dynamic from "next/dynamic";

// import { FaFacebook } from "react-icons/fa";
// import { IoLogoYoutube } from "react-icons/io5";
// import { FaInstagram } from "react-icons/fa6";
// import { FaLinkedin } from "react-icons/fa6";
// import { FaDiscord } from "react-icons/fa6";
// import { FaTelegramPlane } from "react-icons/fa";
// import Link from "next/link";

// const Earth = dynamic(() => import("../components/earth/earth"), {
//   ssr: false,
//   loading: () => <img src="/assets/placeholder.png"></img>,
// });

// export default function Home() {
//   return (
//     <div>
//       <main className="pt-[100px] padding-screen">
//         <div className="  relative ">
//           <div className="flex justify-center items-center w-full absolute ">
//             <div className="flex z-[100] md:w-[60%]  pt-[40px] flex-col text-center justify-center items-center">
//               <h1 className="custom-1-text  bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent  tracking-tighter font-extrabold">
//                 Penta Stocks
//               </h1>
//               <p className="custom-4-text">
//                 Investing Made Simple, Trading Made Smarter.
//               </p>
//               <div className="space-x-[30px]  flex mt-4">
//               <button className="relative cursor-pointer md:text-[16px] text-[14px]  p-[2px] rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
//               <Link href="/stocks" className="block px-[40px] py-3 rounded-[17px] bg-[#171717] text-white text-[16px] ">
//                 Discover
//               </Link>
//             </button>
//                 <button className="relative px-3 md:text-[16px] text-[14px] py-3  p-[2px] rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
//                   <Link
//                     href="/signup"
//                     className=" text-white  md:text-[20px]"
//                   >
//                     Get Penta Stocks
//                   </Link>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="pt-[100px] w-full  ">
//             <Earth />
//           </div>
//         </div>

//         <div className="flex md:pt-0 pt-[100px] justify-center">
//           <div className="lg:w-[64%] ">
//             <p className="small-big md:leading-15 leading-9 tracking-tighter">
//               Penta Stocks is a modern trading platform that empowers
//               individuals to buy, sell, and manage stocks with ease. Built for
//               both new and seasoned investors, Penta Stocks combines simplicity,
//               security, and smart tools to help users make confident financial
//               decisions in real time. At our core, we believe that the stock
//               market shouldn’t be intimidating or reserved for the elite. That’s
//               why we’re creating a seamless, accessible, and transparent
//               ecosystem where users can explore opportunities, build wealth, and
//               take control of their financial future.
//             </p>
//           </div>
//         </div>

//         <div></div>
//       </main>

//       <div className="custom-2-text px-5 md:px-0 font-bold md:py-0 py-[100px] mt-[120px] md:mt-[150px] border-y-[0.4px] border-white md:divide-x-[0.4px] md:divide-white md:flex w-full">
//   <div className="md:w-[50%] md:px-0 flex items-center small-big pt-[20px] md:text-center md:py-0 py-3 tracking-tighter">
//     <p className="transform  md:rotate-[270deg] origin-middle">
//       What we offer{" "}
//     </p>
//   </div>
//   <div className="md:w-[90%] md:px-[10%] md:py-[140px] relative">
//     <div className="relative pl-10 space-y-10">
//       {/* Gradient connecting line */}
//       <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-gradient-to-b from-blue-400 to-purple-500"></div>
      
//       {/* List items with gradient numbers */}
//       <div className="relative">
//         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//           <span className="text-sm">1</span>
//         </div>
//         <p className="pl-2">
//           User-Friendly Trading App – A clean, intuitive interface that makes
//           investing easy and engaging. offline, ensuring it cannot be
//           compromised.
//         </p>
//       </div>
      
//       <div className="relative">
//         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//           <span className="text-sm">2</span>
//         </div>
//         <p className="pl-2">
//           Real-Time Market Data – Stay informed with up-to-the-second updates
//           and analytics.
//         </p>
//       </div>
      
//       <div className="relative">
//         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//           <span className="text-sm">3</span>
//         </div>
//         <p className="pl-2">
//           Secure Transactions – End-to-end encryption and regulatory
//           compliance to protect every trade.
//         </p>
//       </div>
      
//       <div className="relative">
//         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//           <span className="text-sm">4</span>
//         </div>
//         <p className="pl-2">
//           Educational Tools – Learn the basics or deepen your strategy with
//           our built-in resources.
//         </p>
//       </div>
      
//       <div className="relative">
//         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//           <span className="text-sm">5</span>
//         </div>
//         <p className="pl-2">
//           Fractional Shares – Start investing with what you have—own a piece
//           of your favorite companies.
//         </p>
//       </div>
//     </div>
//   </div>
// </div>
//       <div className="cards   px-5 md:px-0 flex md:flex-row flex-col">
//         <div className="md:px-[10%] md:order-first order-last  custom-2-text py-6 md:pb-0 pb-[120px] md:py-[100px]">
//           <div className="md:w-[80%] w-[90%]">
//             <p className="">
//               To democratize access to the stock market by making investing
//               simple, transparent, and accessible to everyone
//             </p>
//             <p>
//               To become the most trusted platform for stock trading and
//               financial growth in emerging markets
//             </p>
//           </div>
//         </div>

//         <div className="">
//           <img className="h-[600px] md:w-[700px] md:pt-0 pt-[100px]" src="assets/pent.png" alt="cards" />
//         </div>
//       </div>

//       <div className="border-t-[0.4px] border-white py-[130px] justify-center items-center">
//       <div className="md:px-[10%]">
//   <div className="text-center flex flex-col justify-center items-center tracking-tighter">
//     <p className="custom-2-text text-gray-300">
//       Traders around the world choose <strong>Penta Stock</strong> for smarter options trading
//     </p>
//     <p className="custom-3-text text-white leading-[50px] md:leading-[80px] font-semibold mt-2">
//       One Platform. Endless Possibilities.
//     </p>
//     <p className="custom-2-text w-[80%] md:w-[50%] text-gray-400 mt-4">
//       Explore powerful tools, real-time insights, and advanced strategies — all in one place. Whether you're just starting out or refining your edge, Penta Stock helps you trade with confidence.
//     </p>
//   </div>
// </div>

//         <div className="flex pt-6 justify-center">
//           <img
//             className="md:h-[600px] h-[600px] "
//             src="assets/penta-phone.png"
//             alt="phone"
//           />
//         </div>
//       </div>
//       <div className="flex px-5 md:px-0 flex-col justify-center items-center">
//   <div className="text-center md:w-[70%] tracking-tighter">
//     <p className="custom-2-text text-gray-300">
//       Take control of your trades with the tools and insights built for real market momentum — only on <strong>Penta Stock</strong>
//     </p>
//     <p className="custom-3-text pb-17 leading-[50px] md:leading-[80px] text-white font-semibold mt-2">
//       Explore Unlimited Stock Opportunities
//     </p>
//   </div>
// </div>

//       <div className="custom-2-text grid md:h-[650px] font-bold md:mt-[150px] md:border-y-[0.4px] border-white   md:flex w-full">
//         <div className="md:w-[50%]  md:order-first order-last ">
//           <img
//             className=" h-[400px] md:h-full w-full object-cover"
//             src="assets/visa.jpeg"
//             alt="cards"
//           />
//         </div>
//         <div className="md:w-[50%]  order-last md:pl-[10%]  pt-[40px] md:px-0 tracking-tighter px-6 md:p-[50px] md:py-[140px]">
//   <p className="md:text-[50px] md:w-auto w-[70%] text-[30px] font-semibold">
//     Join the Future of Trading
//   </p>

//   <p className="custom-2-text md:pt-0 pt-6 text-gray-300">
//     Trusted Millions of traders worldwide, Penta Stock helps you stay ahead with real-time market insights, smart option strategies, and in-depth trading psychology breakdowns. Everything you need — in one place.
//   </p>

//   <button className="relative  px-7 py-3  cursor-pointer p-[2px] mt-9 my-4 rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
//     <Link
//       href="/signup"
//       className="  text-white text-[16px] font-medium"
//     >
//       Get Started Now
//     </Link>
//   </button>
// </div>

//       </div>

//       <div className="flex flex-col   py-[120px]  justify-center items-center">
//         <div className=" text-center md:w-[70%]  tracking-tighter ">
//           <p className="custom-3-text">Stay connected.</p>
//           <p className="custom-2-text">
//             Millions of users already use Penta Stocks for option trading
//           </p>

//           <div className=" icons-box  py-[60px]">
//             <FaFacebook className="icons" />
        
//             <FaInstagram className="icons" />
          
//             <FaDiscord className="icons" />
//             <FaTelegramPlane className="icons" />
           
//           </div>
//         </div>
//       </div>

//       <div></div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import dynamic from "next/dynamic";

import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import Link from "next/link";

const Earth = dynamic(() => import("../components/earth/earth"), {
  ssr: false,
  loading: () => <img src="/assets/placeholder.png" alt="Loading..."></img>,
});

// Interface for ScrollRevealText props
interface ScrollRevealTextProps {
  children: ReactNode;
  className?: string;
}

// Scroll Reveal Text Component
const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({ children, className = "" }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    // Split text into words
    const textContent = typeof children === 'string' ? children : 
      (children as any)?.props?.children || '';
    const wordArray = textContent.split(' ');
    setWords(wordArray);
  }, [children]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is visible
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Start animation when element enters viewport
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Calculate progress based on scroll position
        const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight / 2)));
        
        // Calculate how many words should be visible
        const totalWords = words.length;
        const wordsToShow = Math.floor(progress * totalWords);
        
        setVisibleWords(wordsToShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [words.length]);

  return (
    <div ref={elementRef} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`transition-colors duration-500 ease-out ${
            index < visibleWords ? 'text-white' : 'text-gray-500'
          }`}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <main className="pt-[100px] padding-screen">
        <div className="  relative ">
          <div className="flex justify-center items-center w-full absolute ">
            <div className="flex z-[100] md:w-[60%]  pt-[40px] flex-col text-center justify-center items-center">
              <h1 className="custom-1-text  bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent  tracking-tighter font-extrabold">
                Penta Stocks
              </h1>
              <p className="custom-4-text">
                Investing Made Simple, Trading Made Smarter.
              </p>
              <div className="space-x-[30px]  flex mt-4">
              <button className="relative cursor-pointer md:text-[16px] text-[14px]  p-[2px] rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
              <Link href="/stocks" className="block px-[40px] py-3 rounded-[17px] bg-[#171717] text-white text-[16px] ">
                Discover
              </Link>
            </button>
                <button className="relative px-3 md:text-[16px] text-[14px] py-3  p-[2px] rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
                  <Link
                    href="/signup"
                    className=" text-white  md:text-[20px]"
                  >
                    Get Penta Stocks
                  </Link>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-[100px] w-full  ">
            <Earth />
          </div>
        </div>

        <div className="flex md:pt-0 pt-[100px] justify-center">
          <div className="lg:w-[64%] ">
            <ScrollRevealText className="small-big md:leading-15 leading-9 tracking-tighter">
              Penta Stocks is a modern trading platform that empowers
              individuals to buy, sell, and manage stocks with ease. Built for
              both new and seasoned investors, Penta Stocks combines simplicity,
              security, and smart tools to help users make confident financial
              decisions in real time. At our core, we believe that the stock
              market shouldn't be intimidating or reserved for the elite. That's
              why we're creating a seamless, accessible, and transparent
              ecosystem where users can explore opportunities, build wealth, and
              take control of their financial future.
            </ScrollRevealText>
          </div>
        </div>

        <div></div>
      </main>

      <div className="custom-2-text px-5 md:px-0 font-bold md:py-0 py-[100px] mt-[120px] md:mt-[150px] border-y-[0.4px] border-white md:divide-x-[0.4px] md:divide-white md:flex w-full">
  <div className="md:w-[50%] md:px-0 flex items-center small-big pt-[20px] md:text-center md:py-0 py-3 tracking-tighter">
    <p className="transform  md:rotate-[270deg] origin-middle">
      What we offer{" "}
    </p>
  </div>
  <div className="md:w-[90%] md:px-[10%] md:py-[140px] relative">
    <div className="relative pl-10 space-y-10">
      {/* Gradient connecting line */}
      <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-gradient-to-b from-blue-400 to-purple-500"></div>
      
      {/* List items with gradient numbers */}
      <div className="relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          <span className="text-sm">1</span>
        </div>
        <ScrollRevealText className="pl-2">
          User-Friendly Trading App – A clean, intuitive interface that makes
          investing easy and engaging. offline, ensuring it cannot be
          compromised.
        </ScrollRevealText>
      </div>
      
      <div className="relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          <span className="text-sm">2</span>
        </div>
        <ScrollRevealText className="pl-2">
          Real-Time Market Data – Stay informed with up-to-the-second updates
          and analytics.
        </ScrollRevealText>
      </div>
      
      <div className="relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          <span className="text-sm">3</span>
        </div>
        <ScrollRevealText className="pl-2">
          Secure Transactions – End-to-end encryption and regulatory
          compliance to protect every trade.
        </ScrollRevealText>
      </div>
      
      <div className="relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          <span className="text-sm">4</span>
        </div>
        <ScrollRevealText className="pl-2">
          Educational Tools – Learn the basics or deepen your strategy with
          our built-in resources.
        </ScrollRevealText>
      </div>
      
      <div className="relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          <span className="text-sm">5</span>
        </div>
        <ScrollRevealText className="pl-2">
          Fractional Shares – Start investing with what you have—own a piece
          of your favorite companies.
        </ScrollRevealText>
      </div>
    </div>
  </div>
</div>
      <div className="cards   px-5 md:px-0 flex md:flex-row flex-col">
        <div className="md:px-[10%] md:order-first order-last  custom-2-text py-6 md:pb-0 pb-[120px] md:py-[100px]">
          <div className="md:w-[80%] w-[90%]">
            <ScrollRevealText className="">
              To democratize access to the stock market by making investing
              simple, transparent, and accessible to everyone
            </ScrollRevealText>
            <ScrollRevealText className="mt-4">
              To become the most trusted platform for stock trading and
              financial growth in emerging markets
            </ScrollRevealText>
          </div>
        </div>

        <div className="">
          <img className="h-[600px] md:w-[700px] md:pt-0 pt-[100px]" src="assets/pent.png" alt="cards" />
        </div>
      </div>

      <div className="border-t-[0.4px] border-white py-[130px] justify-center items-center">
      <div className="md:px-[10%]">
  <div className="text-center flex flex-col justify-center items-center tracking-tighter">
    <p className="custom-2-text text-gray-300">
      Traders around the world choose <strong>Penta Stock</strong> for smarter options trading
    </p>
    <p className="custom-3-text text-white leading-[50px] md:leading-[80px] font-semibold mt-2">
      One Platform. Endless Possibilities.
    </p>
    <ScrollRevealText className="custom-2-text w-[80%] md:w-[50%] text-gray-400 mt-4">
      Explore powerful tools, real-time insights, and advanced strategies — all in one place. Whether you're just starting out or refining your edge, Penta Stock helps you trade with confidence.
    </ScrollRevealText>
  </div>
</div>

        <div className="flex pt-6 justify-center">
          <img
            className="md:h-[600px] h-[600px] "
            src="assets/penta-phone.png"
            alt="phone"
          />
        </div>
      </div>
      <div className="flex px-5 md:px-0 flex-col justify-center items-center">
  <div className="text-center md:w-[70%] tracking-tighter">
    <p className="custom-2-text text-gray-300">
      Take control of your trades with the tools and insights built for real market momentum — only on <strong>Penta Stock</strong>
    </p>
    <p className="custom-3-text pb-17 leading-[50px] md:leading-[80px] text-white font-semibold mt-2">
      Explore Unlimited Stock Opportunities
    </p>
  </div>
</div>

      <div className="custom-2-text grid md:h-[650px] font-bold md:mt-[150px] md:border-y-[0.4px] border-white   md:flex w-full">
        <div className="md:w-[50%]  md:order-first order-last ">
          <img
            className=" h-[400px] md:h-full w-full object-cover"
            src="assets/visa.jpeg"
            alt="cards"
          />
        </div>
        <div className="md:w-[50%]  order-last md:pl-[10%]  pt-[40px] md:px-0 tracking-tighter px-6 md:p-[50px] md:py-[140px]">
  <p className="md:text-[50px] md:w-auto w-[70%] text-[30px] font-semibold">
    Join the Future of Trading
  </p>

  <ScrollRevealText className="custom-2-text md:pt-0 pt-6 text-gray-300">
    Trusted Millions of traders worldwide, Penta Stock helps you stay ahead with real-time market insights, smart option strategies, and in-depth trading psychology breakdowns. Everything you need — in one place.
  </ScrollRevealText>

  <button className="relative  px-7 py-3  cursor-pointer p-[2px] mt-9 my-4 rounded-[17px] bg-gradient-to-r from-blue-400 to-purple-500">
    <Link
      href="/signup"
      className="  text-white text-[16px] font-medium"
    >
      Get Started Now
    </Link>
  </button>
</div>

      </div>

      <div className="flex flex-col   py-[120px]  justify-center items-center">
        <div className=" text-center md:w-[70%]  tracking-tighter ">
          <p className="custom-3-text">Stay connected.</p>
          <ScrollRevealText className="custom-2-text">
            Millions of users already use Penta Stocks for option trading
          </ScrollRevealText>

          <div className=" icons-box  py-[60px]">
            <FaFacebook className="icons" />
        
            <FaInstagram className="icons" />
          
            <FaDiscord className="icons" />
            <FaTelegramPlane className="icons" />
           
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}