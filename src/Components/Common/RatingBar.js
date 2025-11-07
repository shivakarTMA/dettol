import React from "react";

import startIcon from "../../Assests/Images/icons/star-circle.svg"

const RatingBar = ({ title, rating, max = 5 }) => {
  const percentage = (rating / max) * 100;

  return (
    <div className="bg-[#F0F0F0] rounded-[10px] lg:p-[15px] p-[10px]">
      <div className="flex gap-1 justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <img src={startIcon} className="lg:w-[34px] w-[25px]" /> <span className="lg:text-md text-[13px]">{title}</span>
        </div>
        <div className="rating-score">
          <span className="text-[12px] italic">Average Rating</span> <strong className="lg:text-2xl text-xl text-black">{rating.toFixed(1)}</strong>
        </div>
      </div>
      <div className="inner--shadow bg-white h-2 rounded-full">
        <div
          className="bg-[#009A27] h-full rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RatingBar;
