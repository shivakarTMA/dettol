import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SubmitRatingPopup({ isOpen, onClose }) {
  // Local states for rating and feedback text
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      rating,
      feedback,
    };
    console.log("Submitted Rating:", formData);
    onClose();
      toast.success("Rating Submitted Successfully!");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto">
        <div className="bg-white shadow-lg w-full max-w-[500px] mx-4 p-6 relative rounded-md">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
          >
            <IoMdClose />
          </button>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold mb-1">
            Do you like using our application?
          </h2>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            Please leave a rating for us.
          </p>

          {/* Rating Stars */}
          <div className="flex gap-2 mb-4">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={ratingValue}
                  size={28}
                  className="cursor-pointer transition"
                  color={
                    ratingValue <= (hover || rating)
                      ? "#ffc107"
                      : "#e4e5e9"
                  }
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>

          {/* Feedback Textarea */}
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-sm h-28 focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Write your thoughts...."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-800 transition"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
