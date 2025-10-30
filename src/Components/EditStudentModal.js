import React from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  Name_en: Yup.string().required("Name English is required"),
  Name_in: Yup.string().required("Name Hindi is required"),
  Mobile_No: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  gender_en: Yup.string().required("Gender English is required"),
  gender_in: Yup.string().required("Gender Hindi is required"),
  Age: Yup.number()
    .min(3, "Age must be at least 3")
    .required("Age is required"),
  Class: Yup.string().required("Class is required"),
  Section: Yup.string().required("Section is required"),
  address_en: Yup.string().required("Address English is required"),
  address_in: Yup.string().required("Address Hindi is required"),
  district_en: Yup.string().required("District English is required"),
  district_in: Yup.string().required("District Hindi is required"),
  city_en: Yup.string().required("City English is required"),
  city_in: Yup.string().required("City Hindi is required"),

  pincode: Yup.number().required("Pincode is required"),
  card_no: Yup.string()
    .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Enter valid card number")
    .required("Card No. is required"),
  school_id: Yup.string().required("School Name is required"),
});

const schoolList = [
  {
    value: "Kendriya Vidyalaya No. 1 AFS Gorakhpur",
    label: "Kendriya Vidyalaya No. 1 AFS Gorakhpur",
  },
  {
    value: "Jawahar Navodaya Vidyalaya, Jungle Agahi, Peepiganj",
    label: "Jawahar Navodaya Vidyalaya, Jungle Agahi, Peepiganj",
  },
  {
    value: "Government Jubilee Inter College, Buxipur",
    label: "Government Jubilee Inter College, Buxipur",
  },
  {
    value: "Kendriya Vidyalaya – FCI Campus Gorakhpur",
    label: "Kendriya Vidyalaya – FCI Campus Gorakhpur",
  },
  { value: "Air Force School Gorakhpur", label: "Air Force School Gorakhpur" },
  {
    value: "Army Public School, Kunraghat, Gorakhpur",
    label: "Army Public School, Kunraghat, Gorakhpur",
  },
  {
    value: "Government School – Bhilora, Varanasi Road, Nausar",
    label: "Government School – Bhilora, Varanasi Road, Nausar",
  },
  {
    value: "Prathmik Vidyalaya Raipur, Dhudhara",
    label: "Prathmik Vidyalaya Raipur, Dhudhara",
  },
  {
    value: "Gauri Manglpur Government School, Chanda",
    label: "Gauri Manglpur Government School, Chanda",
  },
  {
    value: "Bhaluwa Primary School, Pachowree",
    label: "Bhaluwa Primary School, Pachowree",
  },
];

const statusOption = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditStudentModal = ({ onClose, student }) => {
  console.log(student, "student");
  const initialValues = {
    Name_en: "Arjun Verma",
    Name_in: "अर्जुन वर्मा",
    Mobile_No: "9798654321",
    gender_en: "Male",
    gender_in: "पुरुष",
    Age: 10,
    Class: 4,
    Section: "C",
    address_en: "72, Jungle Agahi, Near Peepiganj Chowk",
    address_in: "72, जंगल अगही, पीपलगंज चौक के पास",
    district_en: "Deoria",
    district_in: "देवरिया",
    city_en: "Gorakhpur",
    city_in: "गोरखपुर",
    pincode: "273165",
    card_no: "4458-6623-9123-7765",
    school_id: "Kendriya Vidyalaya No. 1 AFS Gorakhpur",
    status: "Active",
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // important to update form when student changes
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onClose();
      toast.success("Updated successfully!");
    },
  });

  // Custom Card No formatting: 1234-5678-9012-3456
  const handleCardNoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    value = value.match(/.{1,4}/g)?.join("-") || "";
    formik.setFieldValue("Card_No", value);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[1000px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">Edit Student</h3>
              <button className="text-2xl" onClick={onClose} aria-label="Close">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Name_en"
                    value={formik.values.Name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.Name_en && formik.errors.Name_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Name_en}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Name_in"
                    value={formik.values.Name_in || ""}
                    onChange={formik.handleChange}
                    placeholder="Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.Name && formik.errors.Name_in && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Name_in}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Mobile No<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Mobile_No"
                    value={formik.values.Mobile_No || ""}
                    onChange={formik.handleChange}
                    placeholder="Mobile No"
                    className="custom--input w-full"
                    maxLength={10}
                  />
                  {formik.touched.Mobile_No && formik.errors.Mobile_No && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Mobile_No}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Gender (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gender_en"
                    value={formik.values.gender_en || ""}
                    onChange={formik.handleChange}
                    placeholder="gender_en"
                    className="custom--input w-full"
                  />
                  {formik.touched.gender_en && formik.errors.gender_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.gender_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Gender (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gender_in"
                    value={formik.values.gender_in || ""}
                    onChange={formik.handleChange}
                    placeholder="gender_in"
                    className="custom--input w-full"
                  />
                  {formik.touched.gender_in && formik.errors.gender_in && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.gender_in}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Age<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Age"
                    value={formik.values.Age || ""}
                    onChange={formik.handleChange}
                    placeholder="Age"
                    className="custom--input w-full"
                  />
                  {formik.touched.Age && formik.errors.Age && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Age}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Class<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Class"
                    value={formik.values.Class || ""}
                    onChange={formik.handleChange}
                    placeholder="Class"
                    className="custom--input w-full"
                  />
                  {formik.touched.Class && formik.errors.Class && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Class}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Section<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Section"
                    value={formik.values.Section || ""}
                    onChange={formik.handleChange}
                    placeholder="Section"
                    className="custom--input w-full"
                  />
                  {formik.touched.Section && formik.errors.Section && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.Section}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block font-[500]">
                    Address (English)<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address_en"
                    value={formik.values.address_en || ""}
                    onChange={formik.handleChange}
                    placeholder="address_en"
                    className="custom--input w-full"
                  />
                  {formik.touched.address_en && formik.errors.address_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.address_en}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block font-[500]">
                    Address (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address_in"
                    value={formik.values.address_in || ""}
                    onChange={formik.handleChange}
                    placeholder="Address Hindi"
                    className="custom--input w-full"
                  />
                  {formik.touched.address_in && formik.errors.address_in && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.address_in}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    District (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district_en"
                    value={formik.values.district_en || ""}
                    onChange={formik.handleChange}
                    placeholder="District (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.district_en && formik.errors.district_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.district_en}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    District (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district_in"
                    value={formik.values.district_in || ""}
                    onChange={formik.handleChange}
                    placeholder="District (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.district_in && formik.errors.district_in && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.district_in}
                    </div>
                  )}
                </div>

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
                    name="city_en"
                    value={formik.values.city_en || ""}
                    onChange={formik.handleChange}
                    placeholder="City (Hindi)"
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
                    Pincode<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pincode"
                    value={formik.values.pincode || ""}
                    onChange={formik.handleChange}
                    placeholder="pincode"
                    className="custom--input w-full"
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.pincode}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Card No.<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="card_no"
                    value={formik.values.card_no || ""}
                    onChange={handleCardNoChange} // custom formatting
                    placeholder="1234-5678-9012-3456"
                    className="custom--input w-full"
                    maxLength={19}
                  />
                  {formik.touched.card_no && formik.errors.card_no && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.card_no}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    School Name<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={schoolList.find(
                      (option) => option.value === formik.values.school_id
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue(
                        "school_id",
                        option ? option.value : ""
                      )
                    } // ✅ Handles both select & clear
                    options={schoolList}
                    placeholder="School Name"
                    styles={customStyles}
                  />
                  {formik.touched.school_id && formik.errors.school_id && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.school_id}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={statusOption.find(
                      (option) => option.value === formik.values.status
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue("status", option ? option.value : "")
                    } // ✅ Handles both select & clear
                    options={statusOption}
                    placeholder="School Name"
                    styles={customStyles}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.status}
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

export default EditStudentModal;
