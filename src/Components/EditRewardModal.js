import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  reward_name: Yup.string().required("Reward Name is required"),
  reward_description: Yup.string().required("Reward Description is required"),
  reward_contents: Yup.string().required("Reward Contents is required"),
  points_required: Yup.string().required("Points is required"),
});

const EditRewardModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    reward_name: "Clean Start Hygiene Bundle",
    reward_description: "3 pack Dettol soap and hygiene posters",
    reward_contents: "Soap x3, Posters x2",
    points_required: "100",
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // important to update form when student changes
    validationSchema,
    onSubmit: (values) => {
      onClose();
      toast.success("Updated successfully!");
    },
  });

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[400px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit Reward</h3>
              {/* Close button */}
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reward_name"
                    value={formik.values.reward_name || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Name"
                    className="custom--input w-full"
                  />
                  {formik.touched.reward_name && formik.errors.reward_name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.reward_name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Description<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reward_description"
                    value={formik.values.reward_description || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Description"
                    className="custom--input w-full"
                  />
                  {formik.touched.reward_description &&
                    formik.errors.reward_description && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.reward_description}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Contents<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reward_contents"
                    value={formik.values.reward_contents || ""}
                    onChange={formik.handleChange}
                    placeholder="City (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.reward_contents && formik.errors.reward_contents && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.reward_contents}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Points<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="points_required"
                    value={formik.values.points_required || ""}
                    onChange={formik.handleChange}
                    placeholder="City (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.points_required && formik.errors.points_required && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.points_required}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 lg:pb-5 pb-2 lg:px-5 px-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#EFEFEF] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4D57EE] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRewardModal;
