import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAxios } from "../Config/config";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Please select a rating"),
  comment: Yup.string().required("Comment is required"),
});

export default function SubmitRatingPopup({ setIsSuccessModalOpen }) {
  const formik = useFormik({
    initialValues: {
      rating: 0, // Default value for rating
      comment: "", // Default value for comment
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");

      try {
        // Prepare the payload for the API request
        const payload = { ...values };

        await authAxios().post("/staff/feedback/create", payload);
        toast.success("Feedback submitted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save feedback");
      }

      // Reset the form and close the modal
      resetForm();
      setIsSuccessModalOpen(false);
    },
  });

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setIsSuccessModalOpen(false);
        }}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto">
        <div className="bg-white shadow-lg w-full max-w-[500px] mx-4 p-6 relative rounded-md">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
            onClick={() => {
              formik.resetForm();
              setIsSuccessModalOpen(false);
            }}
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

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
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
                      ratingValue <= formik.values.rating
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                    onClick={() => formik.setFieldValue("rating", ratingValue)} // Set rating using Formik
                    onMouseEnter={() =>
                      formik.setFieldValue("rating", ratingValue)
                    } // Show hover effect
                    onMouseLeave={() =>
                      formik.setFieldValue("rating", formik.values.rating)
                    } // Revert to original rating
                  />
                );
              })}
            </div>
            {/* Rating error message */}
            {formik.errors.rating && formik.touched.rating && (
              <p className="text-red-500 text-sm">{formik.errors.rating}</p>
            )}

            {/* Feedback Textarea */}
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm h-28 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Write your thoughts...."
              {...formik.getFieldProps("comment")}
            ></textarea>
            {/* Comment error message */}
            {formik.errors.comment && formik.touched.comment && (
              <p className="text-red-500 text-sm">{formik.errors.comment}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-800 transition"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
