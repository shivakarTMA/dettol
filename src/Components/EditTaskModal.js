import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  category_name: Yup.string().required("Category is required"),
  title_en: Yup.string().required("Title English is required"),
  loyalty_points: Yup.string().required("Loyalty Points is required"),
});

const categoryList = [
  {
    value: "Personal Hygiene",
    label: "Personal Hygiene",
  },
  {
    value: "School Hygiene",
    label: "School Hygiene",
  },
  {
    value: "During Illness",
    label: "During Illness",
  },
  {
    value: "At Home",
    label: "At Home",
  },
  { value: "At Community", label: "At Community" },
];

const EditTaskModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    category_name: "At Community",
    title_en: "Create poster on hygiene messages for proper waste disposal",
    title_hi:"कचरा प्रबंधन पर स्वच्छता संदेश वाला पोस्टर बनाएं",
     instructions_en: [
      "1. Create poster on hygiene messages for proper waste disposal.",
      "2. Do it carefully and maintain cleanliness.",
      "3. Take a short video or photo proof while doing it.",
      "4. Keep the proof saved on your phone for milestone verification.",
      "5. Ask your parent or teacher to confirm completion if required.",
    ], // English instructions array
    instructions_hi: [
      "1. कचरा प्रबंधन और साफ-सफाई पर पोस्टर बनाएं।",
      "2. इसे सावधानी और सफाई से करें।",
      "3. वीडियो या फोटो प्रमाण लें।",
      "4. प्रमाण सुरक्षित रखें।",
      "5. ज़रूरत हो तो माता-पिता या शिक्षक से पुष्टि करवाएं।",
    ], // Hindi instructions array
    loyalty_points: 5,
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

  // Function to update instruction inputs manually
  const handleInstructionChange = (field, index, value) => {
    const updatedArray = [...formik.values[field]]; // Copy existing array
    updatedArray[index] = value; // Update specific instruction
    formik.setFieldValue(field, updatedArray); // Set updated array back to formik
  };

  // Function to add a new empty instruction
  const addInstruction = (field) => {
    const updatedArray = [...formik.values[field], ""]; // Add empty string
    formik.setFieldValue(field, updatedArray); // Update field
  };

  // Function to remove a specific instruction
  const removeInstruction = (field, index) => {
    const updatedArray = formik.values[field].filter((_, i) => i !== index); // Remove by index
    formik.setFieldValue(field, updatedArray); // Update field
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
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
                    Category<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={categoryList.find(
                      (option) => option.value === formik.values.category_name
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue(
                        "category_name",
                        option ? option.value : ""
                      )
                    } // ✅ Handles both select & clear
                    options={categoryList}
                    placeholder="Category"
                    styles={customStyles}
                  />
                  {formik.touched.category_name &&
                    formik.errors.category_name && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.category_name}
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
                 {/* Instructions English */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Instructions (English)
                  </label>
                  {formik.values.instructions_en.map((instruction, index) => (
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
                  ))}
                  <button
                    type="button"
                    onClick={() => addInstruction("instructions_en")}
                    className="text-[#4D57EE]"
                  >
                    + Add Instruction
                  </button>
                </div>

                {/* Instructions Hindi */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Instructions (Hindi)
                  </label>
                  {formik.values.instructions_hi.map((instruction, index) => (
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
                  ))}
                  <button
                    type="button"
                    onClick={() => addInstruction("instructions_hi")}
                    className="text-[#4D57EE]"
                  >
                    + Add Instruction
                  </button>
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

export default EditTaskModal;
