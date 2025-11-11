import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { authAxios } from "../Config/config";
import { useSelector } from "react-redux";

const EditSchoolModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/school/${id}`);
        const data = res.data?.data || res.data || null;

        console.log(data, "SHIVAKAR");

        if (data) {
          formik.setValues({
            name: data.name || "",
            mobile: data.mobile || "",
            role: data.role || "",
            report_to: data.report_to || "",

            name_en: data.name_en || "",
            address_en: data.address_en || "",
            district_en: data.district_en || "",
            city_en: data.city_en || "",
            name_hi: data.name_hi || "",
            address_hi: data.address_hi || "",
            district_hi: data.district_hi || "",
            city_hi: data.city_hi || "",
            pincode: data.pincode || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch module details");
      }
    };

    fetchStaffById(editingOption);
  }, [editingOption]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setShowModal(false);
        }}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[1000px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit School</h3>
              {/* Close button */}
              <button
                className="text-2xl"
                onClick={() => {
                  formik.resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
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

              {userType === "ADMIN" && (
                <div className="flex justify-end gap-3 lg:pb-5 pb-2 lg:px-5 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setShowModal(false);
                    }}
                    className="bg-[#EFEFEF] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#008421] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-white"
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSchoolModal;
