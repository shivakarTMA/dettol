import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { customStyles } from "../Helper/helper";
import Select from "react-select";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const statusOption = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const EditTaskModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);
  const [categoryList, setCategoryList] = useState([]);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/category/fetch/all");

      let data = res.data?.data || [];
      console.log(data, "data");
      setCategoryList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch all staff");
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/task/${id}`);
        const data = res.data?.data || res.data || null;
        console.log(data, "data");

        if (data) {
          formik.setValues({
            category_id: data.category_id || null,
            title_en: data.title_en || "",
            instructions_en: Array.isArray(data.instructions_en)
              ? data.instructions_en
              : [],
            title_hi: data.title_hi || "",
            instructions_hi: Array.isArray(data.instructions_hi)
              ? data.instructions_hi
              : [],
            loyalty_points: data.loyalty_points || null,
            position: data.position || null,
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

  const handleInstructionChange = (field, index, value) => {
    const updatedArray = [...formik.values[field]];
    updatedArray[index] = value;
    formik.setFieldValue(field, updatedArray);

    // Mark that field as touched when typing
    formik.setFieldTouched(`${field}[${index}]`, true);
  };

  const addInstruction = (field) => {
    const updatedArray = [...(formik.values[field] || []), ""]; // add empty string
    formik.setFieldValue(field, updatedArray);

    // mark the new index as touched to trigger validation UI
    formik.setFieldTouched(`${field}[${updatedArray.length - 1}]`, true);
  };

  const removeInstruction = (field, index) => {
    const updatedArray = formik.values[field].filter((_, i) => i !== index);
    formik.setFieldValue(field, updatedArray);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setShowModal(false);
        }}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit Task</h3>
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
                    Category<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={
                      categoryList
                        .map((cat) => ({ value: cat.id, label: cat.name_en }))
                        .find(
                          (option) => option.value === formik.values.category_id
                        ) || null
                    }
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "category_id",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    options={categoryList.map((cat) => ({
                      value: cat.id,
                      label: cat.name_en,
                    }))}
                    placeholder="Select Category"
                    styles={customStyles}
                  />
                  {formik.touched.category_id && formik.errors.category_id && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.category_id}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Loyalty Points<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="loyalty_points"
                    value={formik.values.loyalty_points || ""}
                    onChange={formik.handleChange}
                    placeholder="Loyalty Points"
                    className="custom--input w-full"
                  />
                  {formik.touched.loyalty_points &&
                    formik.errors.loyalty_points && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.loyalty_points}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Title (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formik.values.title_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Title English"
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
                    Title (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_hi"
                    value={formik.values.title_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Title English"
                    className="custom--input w-full"
                  />
                  {formik.touched.title_hi && formik.errors.title_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.title_hi}
                    </div>
                  )}
                </div>
                {/* Instructions English */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Instructions (English)
                  </label>
                  {(formik.values.instructions_en || []).map(
                    (instruction, index) => (
                      <>
                        <div key={index} className="flex mb-2">
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) =>
                              handleInstructionChange(
                                "instructions_en",
                                index,
                                e.target.value
                              )
                            }
                            className="custom--input w-full !rounded-r-[0px]"
                            placeholder={`Instruction ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="bg-red-500 font-bold rounded-r-[5px] px-3 text-white"
                            onClick={() =>
                              removeInstruction("instructions_en", index)
                            }
                          >
                            ✕
                          </button>
                        </div>
                        {formik.touched.instructions_en?.[index] &&
                          formik.errors.instructions_en?.[index] && (
                            <p className="text-red-500 text-sm mb-3">
                              {formik.errors.instructions_en[index]}
                            </p>
                          )}
                      </>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => addInstruction("instructions_en")}
                    className="text-[#008421]"
                  >
                    + Add Instruction
                  </button>
                </div>

                {/* Instructions Hindi */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Instructions (Hindi)
                  </label>
                  {(formik.values.instructions_hi || []).map(
                    (instruction, index) => (
                      <>
                        <div key={index} className="flex mb-2">
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) =>
                              handleInstructionChange(
                                "instructions_hi",
                                index,
                                e.target.value
                              )
                            }
                            className="custom--input w-full !rounded-r-[0px]"
                            placeholder={`निर्देश ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="bg-red-500 font-bold rounded-r-[5px] px-3 text-white"
                            onClick={() =>
                              removeInstruction("instructions_hi", index)
                            }
                          >
                            ✕
                          </button>
                        </div>
                        {formik.touched.instructions_hi?.[index] &&
                          formik.errors.instructions_hi?.[index] && (
                            <p className="text-red-500 text-sm mb-3">
                              {formik.errors.instructions_hi[index]}
                            </p>
                          )}
                      </>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => addInstruction("instructions_hi")}
                    className="text-[#008421]"
                  >
                    + Add Instruction
                  </button>
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
                    placeholder="Title English"
                    className="custom--input w-full"
                  />
                  {formik.touched.position && formik.errors.position && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.position}
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

export default EditTaskModal;
