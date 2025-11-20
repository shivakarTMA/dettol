import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import EditFaqModal from "../../Components/EditFaqModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsQuestionCircle } from "react-icons/bs";
import { formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const validationSchema = Yup.object().shape({
  faqcategory_id: Yup.string().required("Category English is required"),
  question_en: Yup.string().required("Question English is required"),
  question_hi: Yup.string().required("Question Hindi is required"),
  answer_en: Yup.string().required("Answer English is required"),
  answer_hi: Yup.string().required("Answer Hindi is required"),
  position: Yup.string().required("Position is required"),
});

const FaqListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editingOption, setEditingOption] = useState(null);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/faq/list");

      let data = res.data?.data || [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch category");
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const formik = useFormik({
    initialValues: {
      faqcategory_id: "",
      question_en: "",
      question_hi: "",
      answer_en: "",
      answer_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/faq/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/faq/create", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchCategoryList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save user");
      }
      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  return (
    <div>
      <div className="">
        <div className="mb-3 flex">
          <button
            className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
            onClick={() => {
              setEditingOption(null);
              formik.resetForm();
              setShowModal(true);
            }}
          >
            <BsQuestionCircle className="text-xl" />
            <span>Create FAQ</span>
          </button>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">Category</th>
                    <th className="px-3 py-3 min-w-[200px]">Question</th>
                    <th className="px-3 py-3 min-w-[200px]">Answer</th>
                    <th className="px-3 py-3 min-w-[80px] text-center">
                      Position
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.category_name}</td>
                        <td className="px-3 py-3">{item?.question_en}</td>
                        <td className="px-3 py-3">
                          {item?.answer_en?.length > 50
                            ? item.answer_en.substring(0, 50) + "..."
                            : item.answer_en}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.position}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`block w-fit px-3 py-1 rounded-full capitalize ${
                              item.status === "ACTIVE"
                                ? "bg-green-200"
                                : "bg-gray-200"
                            }`}
                          >
                            {formatCapitalText(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content={`${
                                userType === "ADMIN"
                                  ? "Edit Category"
                                  : "View Category"
                              }`}
                              place="left"
                            >
                              <div
                                className="cursor-pointer w-8"
                                onClick={() => {
                                  setEditingOption(item?.id);
                                  setShowModal(true);
                                }}
                              >
                                <img
                                  src={
                                    userType === "ADMIN" ? editIcon : viewIcon
                                  }
                                  alt="view"
                                  className="w-full"
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <EditFaqModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default FaqListScreen;
