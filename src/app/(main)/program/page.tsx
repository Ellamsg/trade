// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HorizontalCarousel from "../../components/HorizontalScroll";
// Define navigation links in a single array

export default function Program() {
  return (

    <div className="">

<HorizontalCarousel />
    <div className="padding-2-screen  pb-[100px]">
      

      <div>
        <div className="">
          <video
            poster="/images/pose2.jpeg"
            autoPlay
            loop
            muted
            x5-playsinline=""
            src="https://tangem.com/video/desktop/ring-app-activation.mp4"
            className="w-full h-[450px] md:h-[620px] object-cover "
          />
        </div>

        <div className="md:w-full w-[70%]">
          <p className="custom-text-7 font-bold">
            Thousands of Stocks all in one Account
          </p>
          <p>
          Penta Stocks offers secure, high-performance trading solutions with advanced encryption and multi-layer protection to safeguard your investments.
          </p>
        </div>
      </div>

      <div className="flex  pt-[130px] justify-center">
        <div className="lg:w-[64%]  ">
          <p className="small-big md:leading-15 leading-9 tracking-tighter">
            Tangem redefines the crypto wallet experience with top-level
            security, simplicity, and convenience. Enjoy total independence when
            managing your digital assets on the go. We break down barriers for
            newcomers and enhance self-custody for experts.
          </p>
        </div>
      </div>

      <div className="lg:flex py-6 lg:gap-[60px] gap-0 items-center">
        <div>
          <video
            poster="/images/pose2.jpeg"
            autoPlay
            loop
            muted
            x5-playsinline=""
            src="https://tangem.com/video/desktop/ring-unique-devices.mp4"
            className="w-full md:h-[750px] size-[400px] object-cover "
          />
        </div>

        <div>
          <p className="custom-text-7 font-bold">
             unique exchanges — one accounts
          </p>

          <p className="custom-2-text">
            The set consists of one ring and two cards. The smart backup
            technology and seed phrase option provide maximum protection for
            your digital assets against loss or theft.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
