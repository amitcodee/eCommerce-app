import React from "react";

const Banner = () => {
  return (
    <div className="text-center bg-[#1F1F1F] lg:px-20 py-2 flex justify-between text-white">
      <div className="space-x-2 mt-2 hidden sm:block">
        <span className=" text-sm font-extralight">English</span>
        <span className=" text-sm font-extralight">USD</span>
      </div>
      <div>
        <h3 className="uppercase mt-2 text-sm ml-6 ">
          New Customer Save 10% with the code get10{" "}
        </h3>
      </div>

      <div className="mt-2 space-x-2 hidden sm:block">
        <i class="fa-brands fa-facebook"></i>
        <i class="fa-brands fa-instagram"></i>
        <i class="fa-brands fa-twitter"></i>
        <i class="fa-brands fa-youtube"></i>
      </div>
    </div>
    
  );
};

export default Banner;
