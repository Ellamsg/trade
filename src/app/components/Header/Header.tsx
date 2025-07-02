// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/(auth)/login/action";

// Define navigation links in a single array
const NAV_LINKS = [
  { href: "/", text: "Home" },
  { href: "/program", text: "Program" },
  { href: "/services", text: "Services" },
  { href: "/stocks", text: "Stocks" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full bg-gblack transition-all z-[999] duration-300 ${
        scrolled ? "bg-black shadow-md py-2" : "bg-black/90 py-4"
      }`}
    >
      <div className="container  mx-auto px-4">
        <div className="flex  justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white md:py-0 py-2">
            <img className="h-9" src="assets/pentalogo.png" alt="main-log" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex py-3 px-6 rounded-[30px]  text-white  space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} text={link.text} />
            ))}
          </div>
          <form className="md:block hidden " action={signOut}>
            <button className="relative cursor-pointer p-[2px] rounded-[50px] bg-gradient-to-r from-blue-400 to-purple-500">
              <Link href="/login" className="block px-7 py-3 rounded-[48px] bg-[#171717] text-white text-[16px] ">
                Login
              </Link>
            </button>
          </form>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col items-end space-y-1.5">
                <span
                  className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
                    isOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
                    isOpen ? "opacity-0" : "w-5"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
                    isOpen ? "w-6 -rotate-45 -translate-y-2" : "w-4"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden bg-black overflow-hidden transition-all 
            duration-500 ease-in-out ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}
        >
          <div className="flex flex-col space-y-4  pt-4">
            {NAV_LINKS.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                text={link.text}
                onClick={closeMenu}
              />
            ))}
              <form className="block md:hidden " action={signOut}>
            <button className="relative cursor-pointer p-[2px] rounded-[50px] bg-gradient-to-r from-blue-400 to-purple-500">
              <Link href="/login" className="block px-7 py-3 rounded-[48px] bg-[#171717] text-white text-[16px] ">
                Login
              </Link>
            </button>
          </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

// NavLink component for desktop
function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="text-white hover:text-gray-900 font-medium transition-colors duration-300 relative group"
    >
      {text}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

// NavLink component for mobile
function MobileNavLink({
  href,
  text,
  onClick,
}: {
  href: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
    >
      {text}
    </Link>
  );
}
