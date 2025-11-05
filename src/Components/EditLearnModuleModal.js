import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  file_name_En: Yup.string().required("File Name English is required"),
  file_name_hi: Yup.string().required("File Name Hindi is required"),
  File_en_url: Yup.string().required("File English is required"),
  File_hi_url: Yup.string().required("File Hindi is required"),
});

const EditLearnModuleModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    File_Id: "PDF001",
    file_name_En: "Coping with Exam Stress",
    file_name_hi: "परीक्षा के तनाव से कैसे निपटें",
    File_en_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    File_hi_url:
      "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
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
              <h3 className="text-lg font-semibold">Edit Learn Module</h3>
              {/* Close button */}
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    File Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="file_name_En"
                    value={formik.values.file_name_En || ""}
                    onChange={formik.handleChange}
                    placeholder="File Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.file_name_En &&
                    formik.errors.file_name_En && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.file_name_En}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    File Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="file_name_hi"
                    value={formik.values.file_name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="File Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.file_name_hi &&
                    formik.errors.file_name_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.file_name_hi}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    File (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="File_en_url"
                    accept="image/*"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "File_en_url",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="custom--input w-full"
                  />
                  {formik.touched.File_en_url && formik.errors.File_en_url && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.File_en_url}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    File (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="File_hi_url"
                    accept="image/*"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "File_hi_url",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="custom--input w-full"
                  />
                  {formik.touched.File_hi_url && formik.errors.File_hi_url && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.File_hi_url}
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
                  className="bg-[#008421] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-white"
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

export default EditLearnModuleModal;
