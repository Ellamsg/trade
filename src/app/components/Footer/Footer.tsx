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
      <div className="grid md:grid-cols-4 md:justify-center justify-start md:gap-0 gap-9  ">
        <div>
          <img src="" alt="logo" />
        </div>
        <div className="space-y-6">
          <p>names </p>
          <p>names </p>
          <p>names </p>
          <p>names </p>
        </div>
        <div className="space-y-6">
          <p>names </p>
          <p>names </p>
          <p>names </p>
          <p>names </p>
        </div>

        <div className="grid text-center grid-cols-6 justify-center ">
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
          Reg. No CHE-390.112.525 Tangem AG provides only hardware wallets and
          non-custodial software solutions for managing digital assets. Tangem
          is not regulated as a financial services provider or cryptocurrency
          exchange. Tangem does not hold, custody, or control users' assets or
          transactions. Crypto transaction services are provided by third-party
          providers. Tangem provides no advice or recommendation on use of these
          third-party services. Copyright © 2025 Tangem AG. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
