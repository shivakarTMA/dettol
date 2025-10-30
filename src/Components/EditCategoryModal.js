import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_in: Yup.string().required("Name Hindi is required"),
  sort_order: Yup.string().required("Order is required"),
});

const EditCategoryModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    name_en: "Personal Hygiene",
    name_in: "व्यक्तिगत स्वच्छता",
    sort_order: "1",
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
              <h3 className="text-lg font-semibold">Edit Category</h3>
              {/* Close button */}
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formik.values.name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="School Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_en && formik.errors.name_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_in"
                    value={formik.values.name_in || ""}
                    onChange={formik.handleChange}
                    placeholder="School Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_in && formik.errors.name_in && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_in}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Order<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sort_order"
                    value={formik.values.sort_order || ""}
                    onChange={formik.handleChange}
                    placeholder="City (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.sort_order && formik.errors.sort_order && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.sort_order}
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

export default EditCategoryModal;
