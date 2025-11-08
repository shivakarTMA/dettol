import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";

const subjectOptions = [
  { value: "Issue related to address", label: "Issue related to address" },
  { value: "Need senior support", label: "Need senior support" },
  { value: "No reward stock", label: "No reward stock" },
  { value: "Others", label: "Others" },
];

const RaiseTicketModal = ({ setRaiseTicketModal, formik }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setRaiseTicketModal(false);
        }}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[600px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Raise a Ticket</h3>
              {/* Close button */}
              <button
                className="text-2xl"
                onClick={() => {
                  formik.resetForm();
                  setRaiseTicketModal(false);
                }}
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Select Subject<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={subjectOptions.find(
                      (option) => option.value === formik.values.subject
                    )}
                    onChange={(option) =>
                      formik.setFieldValue(
                        "subject",
                        option ? option.value : ""
                      )
                    }
                    options={subjectOptions}
                    placeholder="Status"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Message
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formik.values.message || ""}
                    onChange={formik.handleChange}
                    placeholder="Message"
                    className="custom--input w-full"
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 lg:pb-5 pb-2 lg:px-5 px-3">
                <button
                  type="submit"
                  onClick={() => {
                    formik.resetForm();
                    setRaiseTicketModal(false);
                  }}
                  className="bg-[#008421] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RaiseTicketModal;
