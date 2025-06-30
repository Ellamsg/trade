"use client";

import React from "react";
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
  loading: () => <img src="/assets/placeholder.png"></img>,
});

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
              <div className="space-x-[30px] mt-4">
                <button className="md:text-[25px] py-3 px-6   ">
                  Discover
                </button>

                <button className="relative p-[2px] rounded-[50px] bg-gradient-to-r from-blue-400 to-purple-500">
                  <Link
                    href="/register"
                    className="block px-6 py-3 rounded-[48px] bg-[#171717] text-white text-[16px] md:text-[20px]"
                  >
                    Create Account
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
            <p className="small-big md:leading-15 leading-9 tracking-tighter">
              Penta Stocks is a modern trading platform that empowers
              individuals to buy, sell, and manage stocks with ease. Built for
              both new and seasoned investors, Penta Stocks combines simplicity,
              security, and smart tools to help users make confident financial
              decisions in real time. At our core, we believe that the stock
              market shouldn’t be intimidating or reserved for the elite. That’s
              why we’re creating a seamless, accessible, and transparent
              ecosystem where users can explore opportunities, build wealth, and
              take control of their financial future.
            </p>
          </div>
        </div>

        <div></div>
      </main>

      <div className="custom-2-text px-5 md:px-0 font-bold md:py-0 py-[100px] mt-[120px] md:mt-[150px] border-y-[0.4px] border-white md:divide-x-[0.4px] md:divide-white  md:flex w-full">
        <div className="md:w-[50%] md:px-0   flex items-center small-big   pt-[20px]  md:text-center md:py-0 py-3 tracking-tighter  ">
          <p className="transform md:rotate-[270deg] origin-middle">
            What we offer{" "}
          </p>
        </div>
        <div className="md:w-[90%] md:px-[10%]  md:py-[140px]">
          <p className="">
            User-Friendly Trading App – A clean, intuitive interface that makes
            investing easy and engaging. offline, ensuring it cannot be
            compromised.
          </p>
          <p>
            Real-Time Market Data – Stay informed with up-to-the-second updates
            and analytics.
          </p>
          <p>
            Secure Transactions – End-to-end encryption and regulatory
            compliance to protect every trade.
          </p>
          <p>
            -Educational Tools – Learn the basics or deepen your strategy with
            our built-in resources.
          </p>
          <p>
            Fractional Shares – Start investing with what you have—own a piece
            of your favorite companies.
          </p>
        </div>
      </div>

      <div className="cards   px-5 md:px-0 flex md:flex-row flex-col">
        <div className="md:px-[10%] md:order-first order-last  custom-2-text py-[100px]">
          <div className="md:w-[80%] w-[70%]">
            <p className="">
              To democratize access to the stock market by making investing
              simple, transparent, and accessible to everyone
            </p>
            <p>
              To become the most trusted platform for stock trading and
              financial growth in emerging markets
            </p>
          </div>
        </div>

        <div>
          <img src="assets/cards.webp" alt="cards" />
        </div>
      </div>

      <div className="border-t-[0.4px] border-white py-[130px] justify-center items-center">
        <div className="md:px-[10%]">
          <div className=" text-center flex flex-col justify-center items-center tracking-tighter ">
            <p className="custom-2-text">
              1.4 million user alread use Logo for option trading
            </p>
            <p className="custom-3-text">One Stock Option For All</p>
            <p className="custom-2-text w-[50%]">
              Lorem ipsum dolor sit amet consectetur adipindis amet id officia
              doloremque atque quaerat vel nam maiores. Vero, illo? Quisquam
              magni.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            className="md:h-[1000px] h-[600px] "
            src="assets/phone.png"
            alt="phone"
          />
        </div>
      </div>
      <div className="flex  px-5 md:px-0 flex-col justify-center items-center">
        <div className=" text-center md:w-[70%]  tracking-tighter ">
          <p className="custom-2-text">
            1.4 million user alread use Penta stocks for option trading
          </p>
          <p className="custom-3-text pb-17">Access to thousands of Stocks.</p>
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
        <div className="md:w-[50%]  order-last  md:pl-[10%]   tracking-tighter p-[50px] md:py-[140px]">
          <p className="md:text-[50px] text-[30px]">Set up Your Account</p>

          <p className="custom-2-text md:pt-0 pt-6">
            {" "}
            1.4 million user alread use Penta Stock for option trading, Latest
            trends, trading psychology, and strategy breakdowns
          </p>
          <button className="relative cursor-pointer p-[2px] my-4  rounded-[50px] bg-gradient-to-r from-blue-400 to-purple-500">
            <Link
              href="/register"
              className="block px-7 py-3 rounded-[48px] bg-[#171717] text-white text-[16px] "
            >
              Open Account
            </Link>
          </button>
        </div>
      </div>

      <div className="flex flex-col py-[120px]  justify-center items-center">
        <div className=" text-center md:w-[70%]  tracking-tighter ">
          <p className="custom-3-text">Stay connected.</p>
          <p className="custom-2-text">
            Millions of users already use Penta Stocks for option trading
          </p>

          <div className=" icons-box justify-center py-[60px]">
            <FaFacebook className="icons" />
            <IoLogoYoutube className="icons" />
            <FaInstagram className="icons" />
            <FaLinkedin className="icons" />
            <FaDiscord className="icons" />
            <FaTelegramPlane className="icons" />
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
