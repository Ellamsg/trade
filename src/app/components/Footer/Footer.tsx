// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

// Define navigation links in a single array

export default function Footer() {
  return (
    <footer className="bg-[#151515] p-6 lg:p-[70px]">
      <div className="grid md:grid-cols-4 justify-items-center md:justify-items-start md:items-start items-center justify-center  md:gap-0 gap-9  ">
        <div>
          <img className="h-9" src="assets/pentalogo.png" alt="main-log" />
        </div>
        <div className="flex  md:items-start items-center flex-col gap-8">
          <Link href="/">
            <p>Home</p>
          </Link>
          <Link href="/program">
            <p>Program</p>
          </Link>
          <Link href="/services">
            <p>Services</p>
          </Link>
        </div>
        <div className="flex flex-col md:items-start items-center   gap-8">
          <Link href="/stocks">
            <p>Stocks</p>
          </Link>

          <Link
            href="mailto:pentastocks@gmail.com?subject=Support Request&body=Hello, I need help with..."
            className="hover:text-blue-400 transition-colors"
          >
            <p>Customer Support</p>
          </Link>
        </div>

        <div className="grid text-center gap-4 grid-cols-6 justify-center ">
          <FaFacebook className="footer-icons" />
          <IoLogoYoutube className="footer-icons" />
          <FaInstagram className="footer-icons" />
          <FaLinkedin className="footer-icons" />
          <FaDiscord className="footer-icons" />
          <FaTelegramPlane className="footer-icons" />
        </div>
      </div>

      <div className="text-center my-[40px] md:py-[20px] md:pt-[90px] text-[13px] text-[#404040]">
        <p>
          Reg. No CHE-390.112.525 Penta Stocks provides only hardware wallets
          and non-custodial software solutions for managing digital assets.
          Penta Stocks is not regulated as a financial services provider or
          cryptocurrency exchange. Penta Stocks does not hold, custody, or
          control users' assets or transactions. Penta Stocks transaction
          services are provided by third-party providers. Penta Stocks provides
          no advice or recommendation on use of these third-party services.
          Copyright © 2025 Penta Stocks. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
