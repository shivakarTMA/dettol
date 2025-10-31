import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";
import { MdImage } from "react-icons/md";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  Award_name_en: Yup.string().required("Award Name English is required"),
  award_name_hi: Yup.string().required("Award Name Hindi is required"),
  award_description_en: Yup.array()
    .of(Yup.string().trim().required("Description (English) cannot be empty"))
    .min(1, "At least one English description is required")
    .required("Award description (English) is required"),

  award_description_hi: Yup.array()
    .of(Yup.string().trim().required("Description (Hindi) cannot be empty"))
    .min(1, "At least one Hindi description is required")
    .required("Award description (Hindi) is required"),
  Order: Yup.string().required("Loyalty Points is required"),
  Award_Image: Yup.mixed()
    .required("Award image is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
    Stop: Yup.string().required("Stop Points is required"),
});

const StopOption = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

const EditSpinAwardsModal = ({ school, onClose, onSave }) => {
  const initialValues = {
    Award_name_en: "Jackpot (1-Year Supply of Dettol Soaps)",
    award_name_hi: "कचरा प्रबंधन पर स्वच्छता संदेश वाला पोस्टर बनाएं",
    award_description_en: [
      "Congratulations! You’ve hit the Jackpot!",
      "You’ve won a 1-year supply of Dettol Soaps.",
      "You’ll receive it along with your milestone rewards.",
    ],
    award_description_hi: [
      "बधाई हो! आपने जैकपॉट जीता है!",
      "आपको एक साल की डिटॉल साबुन की सप्लाई मिलेगी।",
      "यह आपको आपके माइलस्टोन रिवॉर्ड्स के साथ दिया जाएगा।",
    ],
    Award_Image: "",
    Order: 5,
    Stop: true,
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // important to update form when student changes
    validationSchema,
    onSubmit: (values) => {
      console.log(values,'values')
      onClose();
      toast.success("Updated successfully!");
    },
  });

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
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit Spin Award</h3>
              {/* Close button */}
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-5 gap-y-4 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div className="lg:col-span-2 flex lg:flex-row flex-col lg:gap-5 gap-2">
                  <div className="border rounded-lg w-[110px] h-[110px] flex items-center justify-center">
                    {formik.values.Award_Image ? (
                      <img
                        src={URL.createObjectURL(formik.values.Award_Image)}
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
                      name="Award_Image"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "Award_Image",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="custom--input w-full"
                    />
                    {formik.touched.Award_Image &&
                      formik.errors.Award_Image && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.Award_Image}
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
                    name="Award_name_en"
                    value={formik.values.Award_name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Award Name English"
                    className="custom--input w-full"
                  />
                  {formik.touched.Award_name_en &&
                    formik.errors.Award_name_en && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.Award_name_en}
                      </div>
                    )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Award Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="award_name_hi"
                    value={formik.values.award_name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Award Name English"
                    className="custom--input w-full"
                  />
                  {formik.touched.award_name_hi &&
                    formik.errors.award_name_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.award_name_hi}
                      </div>
                    )}
                </div>

                {/* Description English */}
                <div>
                  <label className="mb-2 block font-[500]">
                    Description (English)
                  </label>
                  {formik.values.award_description_en.map(
                    (instruction, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={instruction}
                          onChange={(e) =>
                            handleAwardChange(
                              "award_description_en",
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
                            removeDescription("award_description_en", index)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => addDescription("award_description_en")}
                    className="text-[#4D57EE]"
                  >
                    + Add Description
                  </button>

                  {formik.errors.award_description_en &&
                    typeof formik.errors.award_description_en === "string" && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.award_description_en}
                      </div>
                    )}
                  {Array.isArray(formik.errors.award_description_en) &&
                    formik.errors.award_description_en.map((err, idx) =>
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
                  {formik.values.award_description_hi.map(
                    (instruction, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={instruction}
                          onChange={(e) =>
                            handleAwardChange(
                              "award_description_hi",
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
                            removeDescription("award_description_hi", index)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => addDescription("award_description_hi")}
                    className="text-[#4D57EE]"
                  >
                    + Add Description
                  </button>

                  {formik.errors.award_description_hi &&
                    typeof formik.errors.award_description_hi === "string" && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.award_description_hi}
                      </div>
                    )}
                  {Array.isArray(formik.errors.award_description_hi) &&
                    formik.errors.award_description_hi.map((err, idx) =>
                      err ? (
                        <div key={idx} className="text-red-500 text-sm mt-1">
                          {`निर्देश ${idx + 1}: ${err}`}
                        </div>
                      ) : null
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Order<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Order"
                    value={formik.values.Order || ""}
                    onChange={formik.handleChange}
                    placeholder="Order"
                    className="custom--input w-full"
                  />
                  {formik.touched.Order && formik.errors.Order && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Order}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Stop<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={StopOption.find(
                      (option) => option.value === formik.values.Stop
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue("Stop", option ? option.value : "")
                    } // ✅ Handles both select & clear
                    options={StopOption}
                    placeholder="Stop"
                    styles={customStyles}
                  />
                  {formik.touched.Stop && formik.errors.Stop && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Stop}
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

export default EditSpinAwardsModal;
