// "use client";

// import React from "react";
// import { useEffect, useState } from "react";
// import "./scrollers.css";

// const Scroller = () => {
//   useEffect(() => {
//     const scrollers = document.querySelectorAll(".scroller");

//     if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
//       addAnimation();
//     }

//     function addAnimation() {
//       scrollers.forEach((scroller) => {
//         scroller.setAttribute("data-animated", true);

//         const scrollerInner = scroller.querySelector(".scroller__inner");
//         const scrollerContent = Array.from(scrollerInner.children);

//         scrollerContent.forEach((item) => {
//           const duplicatedItem = item.cloneNode(true);
//           duplicatedItem.setAttribute("aria-hidden", true);
//           scrollerInner.appendChild(duplicatedItem);
//         });

//         // Add event listeners to pause animation on hover
//         scroller.addEventListener("mouseenter", () => {
//           scrollerInner.style.animationPlayState = "paused";
//         });

//         scroller.addEventListener("mouseleave", () => {
//           scrollerInner.style.animationPlayState = "running";
//         });
//       });
//     }
//   }, []);

//   return (
//     <div>
//       <div className="pt-[20px] pb-3">
//         <p className="md:text-[40px] text-[20px] ">
//           We create art through fashion, experiences and imagery inspired by
//           Africa’s evolving identity. Lagos based, delivered globally.
//         </p>
//       </div>

//       <div className="flex md:flex-row flex-col  border-t-2 justify-between border-[#8c8c8c] ">
//         <div className="md:border-r-2 border-b md:w-[33.3%]  py-4  border-[#8c8c8c] ">
//           <p>00000000000</p>
//           <p>jules.com</p>
//         </div>
//         <div className="md:border-r-2 md:w-[33.3%] py-3 md:p-4 border-[#8c8c8c] ">
//           <p>00000000000</p>
//           <p>jules.com</p>
//         </div>
//         <div className=" md:w-[33.3%] py-4 md:p-3 ">
//           <p>View</p>
//         </div>
//       </div>

//       <div className="border-t-2 border-[#8c8c8c] ">
//         <div className="scroller   w-[100%]   " data-speed="slow">
//           <ul className="tag-list md:h-auto h-[300px] flex items-center move scroller__inner">
//             <div className="">
//               <p className="md:text-[30rem] text-[20rem] font-bold md:leading-[30rem]">JULES</p>
//             </div>
//             <img
//               className="md:h-[390px] h-[260px] w-[200px]  md:w-[300px]"
//               src="images/dark1.avif"
//               alt=""
//             />
//             <img
//               className="md:h-[390px] h-[260px] w-[200px]  object-cover md:w-[300px]"
//               src="images/dark2.webp"
//               alt=""
//             />
//             <img
//               className="md:h-[390px] h-[260px] w-[200px] object-cover  md:w-[300px]"
//               src="images/back.png"
//               alt=""
//             />
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Scroller;