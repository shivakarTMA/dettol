import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";
import { useSelector } from "react-redux";

const statusOption = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const categoriesOption = [
  { value: "GENERAL & ELIGIBILITY", label: "GENERAL & ELIGIBILITY" },
  { value: "STARTING-UP", label: "STARTING-UP" },
  { value: "POINTS & ACTIONS", label: "POINTS & ACTIONS" },
  { value: "REWARDS & TARGETS", label: "REWARDS & TARGETS" },
  { value: "ENROLLMENT REWARDS (FREE)", label: "ENROLLMENT REWARDS (FREE)" },
  { value: "SUPPORT & ISSUES", label: "SUPPORT & ISSUES" },
];

const EditFaqModal = ({ setShowModal, editingOption, formik }) => {
  const { userType } = useSelector((state) => state.auth);

  const [categoryList, setCategoryList] = useState([]);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/faqcategory/list");

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
        const res = await authAxios().get(`/faq/${id}`);
        const data = res.data?.data || res.data || null;
        console.log(data, "data");

        if (data) {
          formik.setValues({
            faqcategory_id: data?.faqcategory_id || "",
            question_en: data?.question_en || "",
            question_hi: data?.question_hi || "",
            answer_en: data?.answer_en || "",
            answer_hi: data?.answer_hi || "",
            position: data?.position || 7,
            status: data?.status || "ACTIVE",
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
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption ? "Edit FAQ" : "Create FAQ"}
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
                <div className="lg:col-span-2">
                  <label className="mb-2 block font-[500]">
                    Category<span className="text-red-500">*</span>
                  </label>
                  {/* <Select
                    value={categoriesOption.find(
                      (option) => option.value === formik.values.faqcategory_id
                    )}
                    onChange={(option) =>
                      formik.setFieldValue("faqcategory_id", option ? option.value : "")
                    }
                    options={categoriesOption}
                    placeholder="Select Category"
                    styles={customStyles}
                  /> */}

                  <Select
                    value={
                      categoryList
                        .map((cat) => ({ value: cat.id, label: cat.title_en }))
                        .find(
                          (option) =>
                            option.value === formik.values?.faqcategory_id
                        ) || null
                    }
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "faqcategory_id",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    options={categoryList.map((cat) => ({
                      value: cat.id,
                      label: cat.title_en,
                    }))}
                    placeholder="Select Category"
                    styles={customStyles}
                  />
                  {formik.touched.faqcategory_id &&
                    formik.errors.faqcategory_id && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.faqcategory_id}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Question (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="question_en"
                    value={formik.values.question_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Question (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.question_en && formik.errors.question_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.question_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Question (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="question_hi"
                    value={formik.values.question_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Question (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.question_hi && formik.errors.question_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.question_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Answer (English)<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="answer_en"
                    value={formik.values.answer_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Answer (English)"
                    className="custom--input w-full"
                    rows={4}
                  />
                  {formik.touched.answer_en && formik.errors.answer_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.answer_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Answer (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="answer_hi"
                    value={formik.values.answer_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Answer (Hindi)"
                    className="custom--input w-full"
                    rows={4}
                  />
                  {formik.touched.answer_hi && formik.errors.answer_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.answer_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Position<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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

export default EditFaqModal;
