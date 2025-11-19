import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import Pagination from "../../Components/Common/Pagination";
import { FaPlus } from "react-icons/fa";
import EditSpinAwardsModal from "../../Components/EditSpinAwardsModal";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdOutlineInventory2 } from "react-icons/md";
import { formatStatus } from "../../Helper/helper";

const validationSchema = Yup.object().shape({
  icon_image: Yup.mixed()
    .required("Icon image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (typeof value === "string") return true; // when editing existing image (URL)
      return value && value instanceof File;
    }),
  badge_image: Yup.mixed().when("type", {
    is: (val) => val === "BADGE",
    then: (schema) =>
      schema
        .required("Badge image is required")
        .test("fileType", "Only image files are allowed", (value) => {
          if (typeof value === "string") return true; // URL for editing
          return value && value instanceof File;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  name_en: Yup.string().required("Award Name English is required"),
  name_hi: Yup.string().required("Award Name Hindi is required"),
  position: Yup.number()
    .typeError("Position must be a number")
    .required("Position is required"),
  description_en: Yup.array()
    .of(Yup.string().required("Description (English) is required"))
    .min(1, "At least one instruction is required"),
  description_hi: Yup.array()
    .of(Yup.string().required("Description (Hindi) is required"))
    .min(1, "At least one instruction is required"),
  is_stop: Yup.boolean().nullable().required("Please select an option"),
});

const SpinAwardsScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [spinAwards, setSpinAwards] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSpinAwardsList = async () => {
    try {
      const res = await authAxios().get("/spinaward/list");

      let data = res.data?.data || [];
      setSpinAwards(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch myreward");
    }
  };

  useEffect(() => {
    fetchSpinAwardsList();
  }, []);

  const formik = useFormik({
    initialValues: {
      name_en: "",
      name_hi: "",
      description_en: [],
      description_hi: [],
      icon_image: "",
      badge_image: "",
      won: "",
      position: "",
      status: "ACTIVE",
      type: "",
      is_stop: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();

        formData.append("name_en", values.name_en);
        formData.append("name_hi", values.name_hi);
        formData.append(
          "description_en",
          JSON.stringify(values.description_en)
        );
        formData.append(
          "description_hi",
          JSON.stringify(values.description_hi)
        );
        formData.append("position", values.position);
        formData.append("status", values.status);
        formData.append("is_stop", values.is_stop);

        if (values.icon_image instanceof File) {
          formData.append("file", values.icon_image);
        }
        if (values.badge_image instanceof File) {
          formData.append("file", values.badge_image);
        }

        if (editingOption) {
          // Update
          await authAxios().put(`/spinaward/${editingOption}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/spinaward/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchSpinAwardsList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save spin award");
      }

      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  return (
    <>
      <div className="">
        {/* <div className="mb-3 flex">
          <button
            className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
            onClick={() => {
              setEditingOption(null);
              formik.resetForm();
              setShowModal(true);
            }}
          >
            <MdOutlineInventory2 className="text-xl" />
            <span>Add Award</span>
          </button>
        </div> */}
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[150px]">Award Name</th>
                    <th className="px-3 py-3 min-w-[300px]">
                      Award Description
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Icon</th>
                    <th className="px-3 py-3 min-w-[80px]">Badge</th>
                    <th className="px-3 py-3 min-w-[80px] text-center">
                      Pos.
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Won</th>
                    <th className="px-3 py-3 min-w-[130px]">Type</th>
                    <th className="px-3 py-3 min-w-[100px]">Is Stop</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {spinAwards.length > 0 ? (
                    spinAwards.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.name_en}</td>
                        <td className="px-3 py-3">
                          <ul className="list-disc pl-[15px]">
                            {item?.description_en &&
                              item?.description_en.map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                          </ul>
                        </td>
                        <td className="px-3 py-3">
                          {item?.icon_image ? (
                            <img
                              src={item?.icon_image}
                              className="w-12 h-12 object-cover object-center rounded-[5px]"
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {item?.badge_image ? (
                            <img
                              src={item?.badge_image}
                              className="w-12 h-12 object-contain object-center"
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.position}
                        </td>
                        <td className="px-3 py-3">{item?.won}</td>
                        <td className="px-3 py-3">
                          {formatStatus(item?.type)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item?.is_stop === true ? "bg-green-200" : ""
                            } ${item?.is_stop === false ? "bg-gray-200" : ""}
                            `}
                          >
                            {item.is_stop === true ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <Tooltip
                            id={`tooltip-edit-${item.id}`}
                            content={`${
                              userType === "ADMIN"
                                ? "Edit Spin Reward"
                                : "View Spin Reward"
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
                                src={userType === "ADMIN" ? editIcon : viewIcon}
                                alt="view"
                                className="w-full"
                              />
                            </div>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditSpinAwardsModal
          setShowModal={setShowModal}
          editingOption={editingOption}
          formik={formik}
        />
      )}
    </>
  );
};

export default SpinAwardsScreen;
