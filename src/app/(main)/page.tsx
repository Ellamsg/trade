"use client";

import React from "react";
import dynamic from "next/dynamic";

import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";


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
                Ultimate Option Trading Solution
              </h1>
              <p className="custom-4-text">
                Lorem ipsum dolor reiciendis quia aut pariatur? Placeat eum
                ipsam reiciendis auerit officia non ducimus.
              </p>
              <div className="space-x-[30px] mt-4">
                <button className="md:text-[20px] py-3 px-6 rounded-[50px] border-white border-[0.5] ">
                  With the Etheral
                </button>

                <button className="py-3 md:text-[20px]  px-6 rounded-[50px] bg-[#171717] ">
                  Check Core studio
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
              Tangem redefines the crypto wallet experience with top-level
              security, simplicity, and convenience. Enjoy total independence
              when managing your digital assets on the go. We break down
              barriers for newcomers and enhance self-custody for experts.
            </p>
          </div>
    

          
        </div>

        <div></div>
      </main>


      <div className="custom-2-text  font-bold md:py-0 py-[100px] mt-[120px] md:mt-[150px] border-y-[0.4px] border-white md:divide-x-[0.4px] md:divide-white  md:flex w-full">
        <div className="md:w-[50%] md:px-[10%]  md:py-[140px]">
          <p className="">
            During activation, the Tangem chip generates a random private key
            offline, ensuring it cannot be compromised.
          </p>
        </div>
        <div className="md:w-[50%]  pt-[20px]  md:text-center tracking-tighter md:p-[50px] md:py-[140px]">
          <p>Set up a hardware wallet in</p>
          <p className="md:text-[45px]">3 minutes</p>
        </div>
      </div>

      <div className="cards  flex md:flex-row flex-col">
        <div className="md:px-[10%] md:order-first order-last  custom-2-text py-[100px]">
          <p className="md:w-[50%]">
            Tangem wallet imageA Tangem Wallet set can contain up to three cards
            or a ring and two cards—each providing equal access like three
            identical keys.
          </p>
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
            <p className="custom-3-text">One Crypto For All</p>
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
      <div className="flex flex-col justify-center items-center">
        <div className=" text-center md:w-[70%]  tracking-tighter ">
          <p className="custom-2-text">
            1.4 million user alread use Logo for option trading
          </p>
          <p className="custom-3-text pb-17">
            Access to thousands of cryptocurrencies.
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
        <div className="md:w-[50%]  order-last  md:pl-[10%]   tracking-tighter p-[50px] md:py-[140px]">
          <p className="md:text-[50px] text-[30px]">Set up a hardware wallet in</p>

          <p className="custom-2-text md:pt-0 pt-6">            1.4 million user alread use Logo for option trading

          1.4 million user alread use Logo for option trading            1.4 million user alread use Logo for option trading
          </p>
          <button className="md:text-[20px] mt-6 py-3 px-6 rounded-[50px] border-white border-[0.5] ">
            With the Etheral
          </button>
        </div>
      </div>


     

       <div className="flex flex-col py-[120px]  justify-center items-center">
        <div className=" text-center md:w-[70%]  tracking-tighter ">
        <p className="custom-3-text">
          Stay connected.
          </p>
          <p className="custom-2-text">
            1.4 million user alread use Logo for option trading
          </p>

          <div className=" icons-box justify-center py-[60px]">
          <FaFacebook className="icons" />
          <IoLogoYoutube className="icons"/>
          <FaInstagram className="icons" />
          <FaLinkedin className="icons" />
          <FaDiscord className="icons" />
          <FaTelegramPlane className="icons"/>
          </div>
         
        </div>
      </div>


      <div>


      </div>
    </div>
  );
}
