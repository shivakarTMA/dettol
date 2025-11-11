import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { useSelector } from "react-redux";

const statusOption = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

const EditLearnModuleModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/exam/stress/management/${id}`);
        const data = res.data?.data || res.data || null;
        console.log(data, "data");

        if (data) {
          formik.setValues({
            title_en: data?.title_en || "",
            title_hi: data?.title_hi || "",
            file_en: data?.file_en || "",
            file_hi: data?.file_hi || "",
            position: data?.position || "",
            status: data.status || "ACTIVE",
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
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[600px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption ? "Edit Learn Module" : "Create Learn Module"}
              </h3>
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
                    File Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formik.values.title_en || ""}
                    onChange={formik.handleChange}
                    placeholder="File Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.title_en && formik.errors.title_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.title_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    File Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_hi"
                    value={formik.values.title_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="File Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.title_hi && formik.errors.title_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.title_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    File (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="file_en"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "file_en",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="custom--input w-full"
                  />
                  {formik.touched.file_en && formik.errors.file_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.file_en}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    File (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="file_hi"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "file_hi",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="custom--input w-full"
                  />
                  {formik.touched.file_hi && formik.errors.file_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.file_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Position<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="position"
                    value={formik.values.position || ""}
                    onChange={formik.handleChange}
                    placeholder="File Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.position && formik.errors.position && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.position}
                    </div>
                  )}
                </div>

                {editingOption && (
                    <div>
                      <label className="mb-2 block font-[500]">Status</label>
                      <Select
                        value={statusOption.find(
                          (option) => option.value === formik.values?.status
                        )}
                        onChange={(option) =>
                          formik.setFieldValue(
                            "status",
                            option ? option.value : ""
                          )
                        }
                        options={statusOption}
                        placeholder="Status"
                        styles={customStyles}
                      />
                    </div>
                  )}
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

export default EditLearnModuleModal;
