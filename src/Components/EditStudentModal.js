import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { toast } from "react-toastify";
import { authAxios } from "../Config/config";
import { MdImage } from "react-icons/md";
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

const EditStudentModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);

  const [schoolList, setSchoolList] = useState([]);

  const fetchSchoolList = async () => {
    try {
      const res = await authAxios().get("/school/fetch/all");

      let data = res.data?.data || [];
      console.log(data, "data");
      setSchoolList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch all staff");
    }
  };

  useEffect(() => {
    fetchSchoolList();
  }, []);

  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/student/${id}`);
        const data = res.data?.data || res.data || null;
        console.log(data, "data");

        if (data) {
          formik.setValues({
            profile_pic: data?.profile_pic || "",
            name_en: data.name_en || "",
            parent_name_en: data.parent_name_en || "",
            parent_name_hi: data.parent_name_hi || "",
            name_hi: data.name_hi || "",
            mobile: data.mobile || "",
            gender_en: data.gender_en || "",
            gender_hi: data.gender_hi || "",
            age: data.age || null,
            class_name: data.class_name || null,
            section: data.section || "",
            address_en: data.address_en || "",
            address_hi: data.address_hi || "",
            district_en: data.district_en || "",
            district_hi: data.district_hi || "",
            city_en: data.city_en || "",
            city_hi: data.city_hi || "",
            pincode: data.pincode || "",
            card_no: data.card_no || "",
            school_id: data.school_id || null,
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
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[1000px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption ? "Edit Student" : "Create Student"}
              </h3>
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
              <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div>
                  <label className="mb-2 block font-[500]">
                    Profile Image<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="profile_pic"
                    accept="image/*"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "profile_pic",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="custom--input w-full"
                  />
                  {formik.touched?.profile_pic &&
                    formik.errors?.profile_pic && (
                      <div className="text-red-500 text-sm">
                        {formik.errors?.profile_pic}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formik.values?.name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.name_en && formik.errors?.name_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.name_en}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={formik.values?.name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.name_hi && formik.errors?.name_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.name_hi}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Mobile No<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values?.mobile || ""}
                    onChange={formik.handleChange}
                    placeholder="Mobile No"
                    className="custom--input w-full"
                    maxLength={10}
                  />
                  {formik.touched?.mobile && formik.errors?.mobile && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.mobile}
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
                    value={formik.values?.gender_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Gender (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.gender_en && formik.errors?.gender_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.gender_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Gender (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gender_hi"
                    value={formik.values?.gender_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Gender (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.gender_hi && formik.errors?.gender_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.gender_hi}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Age<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formik.values?.age || ""}
                    onChange={formik.handleChange}
                    placeholder="Age"
                    className="custom--input w-full"
                  />
                  {formik.touched?.age && formik.errors?.age && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.age}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Class<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="class_name"
                    value={formik.values?.class_name || ""}
                    onChange={formik.handleChange}
                    placeholder="Class"
                    className="custom--input w-full"
                  />
                  {formik.touched?.class_name && formik.errors?.class_name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.class_name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Section<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formik.values?.section || ""}
                    onChange={formik.handleChange}
                    placeholder="Section"
                    className="custom--input w-full"
                  />
                  {formik.touched?.section && formik.errors?.section && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.section}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Parent Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parent_name_en"
                    value={formik.values?.parent_name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Parent Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.parent_name_en &&
                    formik.errors?.parent_name_en && (
                      <div className="text-red-500 text-sm">
                        {formik.errors?.parent_name_en}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Parent Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parent_name_hi"
                    value={formik.values?.parent_name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Parent Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.parent_name_hi &&
                    formik.errors?.parent_name_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors?.parent_name_hi}
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
                    value={formik.values?.address_en || ""}
                    onChange={formik.handleChange}
                    placeholder="address_en"
                    className="custom--input w-full"
                  />
                  {formik.touched?.address_en && formik.errors?.address_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.address_en}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block font-[500]">
                    Address (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address_hi"
                    value={formik.values?.address_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Address Hindi"
                    className="custom--input w-full"
                  />
                  {formik.touched?.address_hi && formik.errors?.address_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.address_hi}
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
                    value={formik.values?.district_en || ""}
                    onChange={formik.handleChange}
                    placeholder="District (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.district_en &&
                    formik.errors?.district_en && (
                      <div className="text-red-500 text-sm">
                        {formik.errors?.district_en}
                      </div>
                    )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    District (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district_hi"
                    value={formik.values?.district_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="District (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.district_hi &&
                    formik.errors?.district_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors?.district_hi}
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
                    value={formik.values?.city_en || ""}
                    onChange={formik.handleChange}
                    placeholder="City (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.city_en && formik.errors?.city_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.city_en}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    City (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city_hi"
                    value={formik.values?.city_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="City (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched?.city_hi && formik.errors?.city_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.city_hi}
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
                    value={formik.values?.pincode || ""}
                    onChange={formik.handleChange}
                    placeholder="pincode"
                    className="custom--input w-full"
                  />
                  {formik.touched?.pincode && formik.errors?.pincode && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.pincode}
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
                    value={formik.values?.card_no || ""}
                    onChange={formik.handleChange}
                    placeholder="Card No."
                    className="custom--input w-full"
                    maxLength={16}
                  />
                  {formik.touched?.card_no && formik.errors?.card_no && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.card_no}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    School Name<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={
                      schoolList
                        .map((cat) => ({ value: cat.id, label: cat.name_en }))
                        .find(
                          (option) => option.value === formik.values?.school_id
                        ) || null
                    }
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "school_id",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    options={schoolList.map((cat) => ({
                      value: cat.id,
                      label: cat.name_en,
                    }))}
                    placeholder="School Name"
                    styles={customStyles}
                  />

                  {formik.touched?.school_id && formik.errors?.school_id && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.school_id}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={statusOption.find(
                      (option) => option.value === formik.values?.status
                    )} // ✅ React Select expects the full object, not just the value
                    onChange={(option) =>
                      formik.setFieldValue("status", option ? option.value : "")
                    } // ✅ Handles both select & clear
                    options={statusOption}
                    placeholder="Status"
                    styles={customStyles}
                  />
                  {formik.touched?.status && formik.errors?.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors?.status}
                    </div>
                  )}
                </div>
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

export default EditStudentModal;
