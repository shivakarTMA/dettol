import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import EditRewardModal from "../../Components/EditRewardModal";
import { toast } from "react-toastify";
import { PiMedalMilitary } from "react-icons/pi";
import { authAxios } from "../../Config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";

const validationSchema = Yup.object({
  image_url: Yup.mixed()
    .required("Reward image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (typeof value === "string") return true; // when editing existing image (URL)
      return value && value instanceof File;
    }),
  milestone_name_en: Yup.string().required("This is required"),
  milestone_name_hi: Yup.string().required("This is required"),
  name_en: Yup.string().required("Reward name (English) is required"),
  name_hi: Yup.string().required("Reward name (Hindi) is required"),
  description_en: Yup.string().required("Description (English) is required"),
  description_hi: Yup.string().required("Description (Hindi) is required"),
  // content: Yup.string().required("Content is required"),
  points_required: Yup.number()
    .typeError("Points must be a number")
    .required("Points are required")
    .min(1, "Points must be greater than 0"),
  position: Yup.number()
    .typeError("Position must be a number")
    .required("Position is required")
    .min(1, "Position must be greater than 0"),
  inventory: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number()
          .typeError("Item selection is required")
          .required("Item is required"),

        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .min(1, "Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one inventory item is required"),
});

const RewardsListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [rewardsList, setRewardsList] = useState([]);
  const [editingOption, setEditingOption] = useState(null);

  const fetchRewardsList = async () => {
    try {
      const res = await authAxios().get("/reward/fetch/all");

      let data = res.data?.data || [];
      setRewardsList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reward");
    }
  };

  useEffect(() => {
    fetchRewardsList();
  }, []);

  const formik = useFormik({
    initialValues: {
      image_url: "",
      milestone_name_en: "",
      milestone_name_hi: "",
      name_en: "",
      name_hi: "",
      description_en: "",
      description_hi: "",
      content: "",
      points_required: "",
      position: "",
      inventory: [{ id: "", quantity: "" }],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // try {
      //   const formData = new FormData();

      //   formData.append("milestone_name_en", values.milestone_name_en);
      //   formData.append("milestone_name_hi", values.milestone_name_hi);
      //   formData.append("name_en", values.name_en);
      //   formData.append("name_hi", values.name_hi);
      //   formData.append("description_en", values.description_en);
      //   formData.append("description_hi", values.description_hi);
      //   // formData.append("content", values.content);
      //   formData.append("points_required", values.points_required);
      //   formData.append("position", values.position);
      //   formData.append("inventory", values.inventory);

      //   if (values.image_url instanceof File) {
      //     formData.append("file", values.image_url);
      //   }

      //   if (editingOption) {
      //     await authAxios().put(`/reward/update/${editingOption}`, formData, {
      //       headers: { "Content-Type": "multipart/form-data" },
      //     });
      //     toast.success("Updated Successfully");
      //   } else {
      //     await authAxios().post(`/reward/create`, formData, {
      //       headers: { "Content-Type": "multipart/form-data" },
      //     });
      //     toast.success("Created Successfully");
      //   }

      //   fetchRewardsList();
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Failed to save reward");
      // }

      // resetForm();
      // setEditingOption(null);
      // setShowModal(false);
      console.log(values, "working");
    },
  });

  return (
    <div>
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
            <PiMedalMilitary className="text-xl" />
            <span>Create Reward</span>
          </button>
        </div> */}
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    {/* <th className="px-3 py-3 min-w-[100px]">Reward Image</th> */}
                    <th className="px-3 py-3 min-w-[120px]">
                      Milestone (English)
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">
                      Milestone (Hindi)
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Reward Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Reward Contents</th>
                    <th className="px-3 py-3 min-w-[120px]">Points</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardsList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    rewardsList.map((item, index) => (
                      <tr key={index} className="border-t">
                        {/* <td className="px-3 py-3">
                          <img
                            src={item?.image_url}
                            className="w-16 h-16 rounded-lg"
                          />
                        </td> */}
                        <td className="px-3 py-3">{item?.milestone_name_en}</td>
                        <td className="px-3 py-3">{item?.milestone_name_hi}</td>
                        <td className="px-3 py-3">{item?.name_en}</td>
                        <td className="px-3 py-3">{item?.content}</td>
                        <td className="px-3 py-3">{item?.points_required}</td>
                        <td className="px-3 py-3">
                          <Tooltip
                            id={`tooltip-edit-${item.id}`}
                            content={`${
                              userType === "ADMIN"
                                ? "Edit Milestone"
                                : "View Milestone"
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
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <EditRewardModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default RewardsListScreen;
