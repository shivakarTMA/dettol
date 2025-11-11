import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";
import { MdImage } from "react-icons/md";
import { useSelector } from "react-redux";
import { authAxios } from "../Config/config";

const StopOption = [
  {
    value: "YES",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

const statusOption = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const EditSpinAwardsModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!editingOption) return;

    const fetchSpinAwardById = async (id) => {
      try {
        const res = await authAxios().get(`/spinaward/${id}`);
        const data = res.data?.data || res.data || null;
        console.log(data, "data");

        if (data) {
          formik.setValues({
            name_en: data.name_en || "",
            description_en: Array.isArray(data.description_en)
              ? data.description_en
              : [],
            name_hi: data.name_hi || "",
            description_hi: Array.isArray(data.description_hi)
              ? data.description_hi
              : [],
            image: data.image || "",
            won: data.won || "",
            position: data.position || null,
            status: data.status || "ACTIVE",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch module details");
      }
    };

    fetchSpinAwardById(editingOption);
  }, [editingOption]);

  // Function to update instruction inputs manually
  const handleAwardChange = (field, index, value) => {
    const updatedArray = [...formik.values[field]]; // Copy existing array
    updatedArray[index] = value; // Update specific instruction
    formik.setFieldValue(field, updatedArray); // Set updated array back to formik
  };

  // Function to add a new empty instruction
  const addDescription = (field) => {
    const updatedArray = [...formik.values[field], ""]; // Add empty string
    formik.setFieldValue(field, updatedArray); // Update field
  };

  // Function to remove a specific instruction
  const removeDescription = (field, index) => {
    const updatedArray = formik.values[field].filter((_, i) => i !== index); // Remove by index
    formik.setFieldValue(field, updatedArray); // Update field
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
              <h3 className="text-lg font-semibold">Edit Spin Award</h3>
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
                <div className="lg:col-span-2 flex lg:flex-row flex-col lg:gap-5 gap-2">
                  <div className="border rounded-lg w-[110px] h-[110px] flex items-center justify-center">
                    {formik.values.image ? (
                      <img
                        src={formik.values.image}
                        alt="Award Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 p-2 w-full">
                        <MdImage size={48} />
                        <p className="text-sm mt-1">Upload Image</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block font-[500]">
                      Award Image<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "image",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="custom--input w-full"
                    />
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.image}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Award Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formik.values.name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Award Name English"
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
                    Award Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={formik.values.name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Award Name English"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_hi && formik.errors.name_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_hi}
                    </div>
                  )}
                </div>

                {/* Description English */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Description (English)
                  </label>
                  {formik.values.description_en.map((instruction, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) =>
                          handleAwardChange(
                            "description_en",
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
                          removeDescription("description_en", index)
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDescription("description_en")}
                    className="text-[#008421]"
                  >
                    + Add Description
                  </button>

                  {formik.errors.description_en &&
                    typeof formik.errors.description_en === "string" && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.description_en}
                      </div>
                    )}
                  {Array.isArray(formik.errors.description_en) &&
                    formik.errors.description_en.map((err, idx) =>
                      err ? (
                        <div key={idx} className="text-red-500 text-sm mt-1">
                          {`Description ${idx + 1}: ${err}`}
                        </div>
                      ) : null
                    )}
                </div>

                {/* Description Hindi */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Description (Hindi)
                  </label>
                  {formik.values.description_hi.map((instruction, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) =>
                          handleAwardChange(
                            "description_hi",
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
                          removeDescription("description_hi", index)
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDescription("description_hi")}
                    className="text-[#008421]"
                  >
                    + Add Description
                  </button>

                  {formik.errors.description_hi &&
                    typeof formik.errors.description_hi === "string" && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.description_hi}
                      </div>
                    )}
                  {Array.isArray(formik.errors.description_hi) &&
                    formik.errors.description_hi.map((err, idx) =>
                      err ? (
                        <div key={idx} className="text-red-500 text-sm mt-1">
                          {`निर्देश ${idx + 1}: ${err}`}
                        </div>
                      ) : null
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
                    placeholder="Position"
                    className="custom--input w-full"
                  />
                  {formik.touched.position && formik.errors.position && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.position}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Won<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={StopOption.find(
                      (option) => option.value === formik.values.won
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue("won", option ? option.value : "")
                    } // ✅ Handles both select & clear
                    options={StopOption}
                    placeholder="Select Option"
                    styles={customStyles}
                  />
                  {formik.touched.won && formik.errors.won && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.won}
                    </div>
                  )}
                </div>
                {editingOption && (
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

export default EditSpinAwardsModal;
