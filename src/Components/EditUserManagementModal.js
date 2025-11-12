import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { authAxios } from "../Config/config";

const userRole = [
  {
    value: "LEADERSHIP",
    label: "Leadership",
  },
  {
    value: "PROJECT_MANAGER",
    label: "Project Manager",
  },
  {
    value: "COORDINATOR",
    label: "Coordinator",
  },
  { value: "TELEMEDICINE", label: "Telemedicine" },
];

const reportOptions = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "LEADERSHIP",
    label: "Leadership",
  },
  {
    value: "PROJECT_MANAGER",
    label: "Project Manager",
  },
  {
    value: "COORDINATOR",
    label: "Coordinator",
  },
  { value: "TELEMEDICINE", label: "Telemedicine" },
];

const EditUserManagementModal = ({ setShowModal, editingOption, formik }) => {
  const [userReport, setUserReport] = useState([]);

  const fetchAllUser = async () => {
    try {
      const res = await authAxios().get("/staff/fetch/all");

      let data = res.data?.data || [];
      setUserReport(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch all staff");
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/staff/${id}`);
        const data = res.data?.data || res.data || null;

        if (data) {
          formik.setValues({
            name: data.name || "",
            mobile: data.mobile || "",
            role: data.role || "",
            report_to: data.report_to || "",
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
                {editingOption ? "Edit User" : "Create User"}
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
                    User Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name || ""}
                    onChange={formik.handleChange}
                    placeholder="User Name"
                    className="custom--input w-full"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Mobile Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile || ""}
                    onChange={formik.handleChange}
                    placeholder="Mobile Number"
                    className="custom--input w-full"
                    maxLength={10}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Role<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={userRole.find(
                      (option) => option.value === formik.values.role
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue("role", option ? option.value : "")
                    } // ✅ Handles both select & clear
                    options={userRole}
                    placeholder="Role"
                    styles={customStyles}
                  />
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.role}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reports To<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={reportOptions.find(
                      (option) => option.value === formik.values.report_to
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue(
                        "report_to",
                        option ? option.value : ""
                      )
                    } // ✅ Handles both select & clear
                    options={reportOptions}
                    placeholder="Reports To"
                    styles={customStyles}
                  />
                  {formik.touched.report_to && formik.errors.report_to && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.report_to}
                    </div>
                  )}
                </div>
              </div>
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserManagementModal;
