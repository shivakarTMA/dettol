import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import EditLearnModuleModal from "../../Components/EditLearnModuleModal";
import { MdImage } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import Tooltip from "../../Components/Common/Tooltip";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiMedalMilitary } from "react-icons/pi";
import { useSelector } from "react-redux";

const validationSchema = Yup.object({
  title_en: Yup.string().required("File Name (English) is required"),
  title_hi: Yup.string().required("File Name (Hindi) is required"),
  file_en: Yup.string().required("File (English) is required"),
  file_hi: Yup.string().required("File (Hindi) is required"),
  position: Yup.number()
    .typeError("Position must be a number")
    .required("Position is required")
    .min(1, "Position must be greater than 0"),
});

const LearnModuleListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [learnModule, setLearnModule] = useState([]);

  const fetchLearnModuleList = async () => {
    try {
      const res = await authAxios().get("/exam/stress/management/list");

      let data = res.data?.data || [];
      setLearnModule(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reward");
    }
  };

  useEffect(() => {
    fetchLearnModuleList();
  }, []);

  const formik = useFormik({
    initialValues: {
      title_en: "",
      file_en: "",
      title_hi: "",
      file_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();

        formData.append("title_en", values.title_en);
        formData.append("title_hi", values.title_hi);
        formData.append("position", values.position);
        formData.append("status", values.status);

        if (values.file_en instanceof File) {
          formData.append("file_en", values.file_en);
        }

        if (values.file_hi instanceof File) {
          formData.append("file_hi", values.file_hi);
        }

        if (editingOption) {
          await authAxios().put(
            `/exam/stress/management/${editingOption}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          toast.success("Updated Successfully");
        } else {
          await authAxios().post(`/exam/stress/management/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Created Successfully");
        }

        fetchLearnModuleList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save exam");
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
            <PiMedalMilitary className="text-xl" />
            <span>Create Learn Module</span>
          </button>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">
                      File Name (English)
                    </th>
                    <th className="px-3 py-3 min-w-[170px]">
                      File Name (HIndi)
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      File (English)
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      File (Hindi)
                    </th>
                    <th className="px-3 py-3 min-w-[50px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {learnModule.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">
                        {item?.title_en ? item?.title_en : "--"}
                      </td>
                      <td className="px-3 py-3">
                        {item?.title_hi ? item?.title_hi : "--"}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.file_en ? (
                          <Link
                            to={item?.file_en}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline"
                          >
                            {item?.file_en.endsWith(".pdf") ? (
                              <FaFilePdf className="text-xl mx-auto" />
                            ) : (
                              <MdImage className="text-xl mx-auto" />
                            )}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.file_hi ? (
                          <Link
                            to={item?.file_hi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline"
                          >
                            {item?.file_hi.endsWith(".pdf") ? (
                              <FaFilePdf className="text-xl mx-auto" />
                            ) : (
                              <MdImage className="text-xl mx-auto" />
                            )}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <Tooltip
                            id={`tooltip-edit-${item.id}`}
                            content={`${userType === "ADMIN" ? "Edit Learn Module" : "View Learn Module"}`}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <EditLearnModuleModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default LearnModuleListScreen;
