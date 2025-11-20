import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import EditFaqCategoryModal from "../../Components/EditFaqCategoryModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiClipboardText } from "react-icons/pi";
import { formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  title_en: Yup.string().required("Title English is required"),
  title_hi: Yup.string().required("Title Hindi is required"),
  position: Yup.string().required("Position is required"),
});

const FaqCategoryListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editingOption, setEditingOption] = useState(null);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/faqcategory/list");

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
      title_en: "",
      title_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/faqcategory/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/faqcategory/create", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchCategoryList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save user");
      }

      if (editingOption) {
        toast.success("Updated Successfully");
      } else{
        toast.success("Created Successfully");
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
            <PiClipboardText className="text-xl" />
            <span>Create Category</span>
          </button>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[200px]">Title (English)</th>
                    <th className="px-3 py-3 min-w-[200px]">Title (Hindi)</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Position</th>
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
                        <td className="px-3 py-3">{item?.title_en}</td>
                        <td className="px-3 py-3">{item?.title_hi}</td>
                        <td className="px-3 py-3 text-center">{item?.position}</td>
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
          <EditFaqCategoryModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default FaqCategoryListScreen;
