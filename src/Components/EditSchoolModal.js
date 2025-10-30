import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  address_en: Yup.string().required("Address English is required"),
  address_in: Yup.string().required("Address Hindi is required"),
  city_en: Yup.string().required("City English is required"),
  city_hi: Yup.string().required("City Hindi is required"),
  pincode: Yup.number().required("Pincode is required"),
});

const EditSchoolModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    name_en: "Kendriya Vidyalaya No. 1 AFS Gorakhpur",
    name_hi: "केन्द्रीय विद्यालय संख्या 1 एएफएस गोरखपुर",
    address_en: "New Project Air Force Station, Post Kusumi, Gorakhpur",
    address_hi: "न्यू प्रोजेक्ट एयर फोर्स स्टेशन, पोस्ट कुसुमी, गोरखपुर",
    city_en: "Gorakhpur",
    city_hi: "गोरखपुर",
    pincode: "273002",
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
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[1000px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit School</h3>
              {/* Close button */}
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    School Name (English)<span className="text-red-500">*</span>
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
                    School Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={formik.values.name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="School Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_hi && formik.errors.name_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    School Address (English)
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address_en"
                    value={formik.values.address_en || ""}
                    onChange={formik.handleChange}
                    placeholder="School Address (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.address_en && formik.errors.address_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.address_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    School Address (Hindi)
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address_hi"
                    value={formik.values.address_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="School Address (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.address_hi && formik.errors.address_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.address_hi}
                    </div>
                  )}
                </div>
                <div className="lg:col-span-2 grid lg:grid-cols-3 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4">
                  <div>
                    <label className="mb-2 block font-[500]">
                      City (English)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city_en"
                      value={formik.values.city_en || ""}
                      onChange={formik.handleChange}
                      placeholder="City (English)"
                      className="custom--input w-full"
                    />
                    {formik.touched.city_en && formik.errors.city_en && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.city_en}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block font-[500]">
                      City (Hindi)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city_hi"
                      value={formik.values.city_hi || ""}
                      onChange={formik.handleChange}
                      placeholder="City (Hindi)"
                      className="custom--input w-full"
                    />
                    {formik.touched.city_hi && formik.errors.city_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.city_hi}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block font-[500]">
                      Pincode<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formik.values.pincode || ""}
                      onChange={formik.handleChange}
                      placeholder="Pincode"
                      className="custom--input w-full"
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.pincode}
                      </div>
                    )}
                  </div>
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

export default EditSchoolModal;
