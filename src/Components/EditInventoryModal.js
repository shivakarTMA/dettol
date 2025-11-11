import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";

const statusOption = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const EditInventoryModal = ({ setShowModal, editingOption, formik }) => {
  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/inventory/${id}`);
        const data = res.data?.data || res.data || null;

        if (data) {
          formik.setValues({
            product_name: data.product_name || "",
            total: data.total || "",
            allotted: data.allotted || "",
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
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[400px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption ? "Edit Inventory" : "Create Inventory"}
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
              <div className="grid lg:grid-cols-1 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Product Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formik.values.product_name || ""}
                    onChange={formik.handleChange}
                    placeholder="Product Name"
                    className="custom--input w-full"
                  />
                  {formik.touched.product_name && formik.errors.product_name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.product_name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Total Stock<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={formik.values.total || ""}
                    onChange={formik.handleChange}
                    placeholder="Total Stock"
                    className="custom--input w-full"
                  />
                  {formik.touched.total && formik.errors.total && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.total}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Allotted Stock<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="allotted"
                    value={formik.values.allotted || ""}
                    onChange={formik.handleChange}
                    placeholder="Allotted Stock"
                    className="custom--input w-full"
                  />
                  {formik.touched.allotted && formik.errors.allotted && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.allotted}
                    </div>
                  )}
                </div>

                {!editingOption ? null : (
                  <div>
                    <label className="mb-2 block font-[500]">Status</label>
                    <Select
                      value={statusOption.find(
                        (option) => option.value === formik.values.status
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

export default EditInventoryModal;
