import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import EditCategoryModal from "../../Components/EditCategoryModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiClipboardText } from "react-icons/pi";
import { formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  position: Yup.string().required("Position is required"),
});

const CategoryListScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editingOption, setEditingOption] = useState(null);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/category/fetch/all");

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
      name_en: "",
      name_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/category/update/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/category/create", payload);
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
                    <th className="px-3 py-3 min-w-[100px]">ID</th>
                    <th className="px-3 py-3 min-w-[120px]">Name (English)</th>
                    <th className="px-3 py-3 min-w-[120px]">Name (Hindi)</th>
                    <th className="px-3 py-3 min-w-[120px]">Position</th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
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
                        <td className="px-3 py-3">{item?.id}</td>
                        <td className="px-3 py-3">{item?.name_en}</td>
                        <td className="px-3 py-3">{item?.name_hi}</td>
                        <td className="px-3 py-3">{item?.position}</td>
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
                              content="Edit Category"
                              place="left"
                            >
                              <div
                                className="cursor-pointer w-5"
                                onClick={() => {
                                  setEditingOption(item?.id);
                                  setShowModal(true);
                                }}
                              >
                                <img
                                  src={editIcon}
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
          <EditCategoryModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryListScreen;
