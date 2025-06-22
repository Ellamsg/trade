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
          <h1 className="custom-1-text">What is x Name</h1>
        </div>

        <div>
          <p className="custom-4-text lg:w-[60%] md:w-[80%]">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel laudantium reprehenderit cumque harum consectetur perferendis odio dolore totam? Qui maiores autem sapiente neque,
            quisquam nam dolorum omnis accusantium ut placeat.
          </p>
        </div>

        <div className="flex gap-9 ">
          <p className="text-[100px]">''</p>
          <p className="custom-3-text leading-20">
            X is the last mile between x billion people and the
            digital assets World.
          </p>
        </div>

        <p className="custom-5-text">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic eos
          optio quis explicabo cumque minus omnis ipsum quisquam in assumenda
          delectus nam, odit distinctio quam nostrum maxime repellat voluptatem
          cupiditate.
        </p>
        <p className="custom-4-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In architecto
          unde aperiam saepe incidunt, fugiat natus facere neque odit error non,
          corporis nam eos a. Beatae dolore dolores facilis provident!
        </p>
      </div>
      <div className="py-9">
        <p className="custom-3-text py-9 ">Product Partners</p>
<div className="flex gap-7">
<div className="bg-white s p-[60px] rounded-[20px]">
          <img src="" alt="logo" />
        </div> <div className="bg-white p-[60px] rounded-[20px]">
          <img src="" alt="logo" />
        </div>
</div>
       
      </div>
    </div>
  );
}
