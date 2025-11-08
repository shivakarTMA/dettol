import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAxios } from "../Config/config";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  remark: Yup.string().required("Remarks is required"),
});

export default function SubmitRemarksPopup({ isOpen, onClose, onSubmit }) {
  const formik = useFormik({
    initialValues: {
      remark: "", // Default value for remark
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");

      if (typeof onSubmit === "function") {
        console.log("✅ Remarks", values);
        onSubmit(values);
      } else {
        console.error("❌ onSubmit prop is not a function");
      }

      // try {
      //   // Prepare the payload for the API request
      //   const payload = { ...values };

      //   await authAxios().post("/staff/feedback/create", payload);
      //   toast.success("Feedback submitted successfully");
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Failed to save feedback");
      // }

      // Reset the form and close the modal
      resetForm();
      onClose();
    },
  });

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
            Add your remark
          </h2>
          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Feedback Textarea */}
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm h-28 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Write your thoughts...."
              {...formik.getFieldProps("remark")}
            ></textarea>
            {/* Comment error message */}
            {formik.errors.remark && formik.touched.remark && (
              <p className="text-red-500 text-sm">{formik.errors.remark}</p>
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
