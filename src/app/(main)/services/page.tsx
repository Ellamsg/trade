// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define navigation links in a single array

export default function Services() {
  return (
    <div className="padding-2-screen py-[200px]">
      <div className=" space-y-[60px] ">
        <div>
          <h1 className="custom-1-text">What is Penta Stocks?</h1>
        </div>

        <div>
          <p className="custom-4-text lg:w-[60%] md:w-[80%]">
          Penta Stocks is a modern trading platform that empowers individuals to buy, sell, 
          and manage stocks with ease. Built for both new and seasoned investors, Penta Stocks combines simplicity, security, and smart tools
           to help users make confident financial decisions in real time.
           At our core, we believe that the stock market shouldn’t be intimidating or reserved for the elite.
            That’s why we’re creating a seamless, accessible, and transparent ecosystem where users can explore 
            opportunities, build wealth, and take control of their financial future.

What we offer


          </p>
        </div>

        <div className="flex gap-9 ">
          <p className="text-[100px] md:block hidden">''</p>
          <p className="custom-3-text  md:leading-20">
          To democratize access to the stock market by making investing simple, transparent, and accessible to everyone
          </p>
        </div>

        <p className="custom-5-text">
        Millions of users alread Penta Stocks for option trading

          1.4 million user alread use Penta Stocks for option trading  
        </p>
        <p className="custom-4-text">
        At Penta Stocks, we empower traders and investors with cutting-edge tools, expert insights, and a seamless trading experience. Founded with a vision to democratize financial markets, we provide a secure and intuitive platform for stocks, forex, commodities, and cryptocurrencies.
        </p>
      </div>
   
    </div>
  );
}
