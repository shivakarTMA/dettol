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

const validationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required("Reward image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (typeof value === "string") return true; // when editing existing image (URL)
      return value && value instanceof File;
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
  won: Yup.string().required("Won is required"),
});

const SpinAwardsScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [spinAwards, setSpinAwards] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSpinAwardsList = async (currentPage = page) => {
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
      };
      const res = await authAxios().get("/spinaward/list", { params });

      let data = res.data?.data || [];
      setSpinAwards(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
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
      image: "",
      won: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const formData = new FormData();

        formData.append("name_en", values.name_en);
        formData.append("name_hi", values.name_hi);
        formData.append("description_en", JSON.stringify(values.description_en));
        formData.append("description_hi", JSON.stringify(values.description_hi));
        formData.append("won", values.won);
        formData.append("position", values.position);
        formData.append("status", values.status);

        if (values.image instanceof File) {
          formData.append("file", values.image);
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
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">Award Name</th>
                    <th className="px-3 py-3 min-w-[150px]">
                      Award Description
                    </th>
                    <th className="px-3 py-3 min-w-[150px]">Award Image</th>
                    <th className="px-3 py-3 min-w-[150px]">Position</th>
                    <th className="px-3 py-3 min-w-[150px]">Won</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {spinAwards.length > 0 ? (
                    spinAwards.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name_en}</td>
                        <td className="px-3 py-3">
                          <ul className="list-disc pl-[15px]">
                            {item.description_en &&
                              item.description_en.map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                          </ul>
                        </td>
                        <td className="px-3 py-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              className="w-12 h-12 object-cover object-center rounded-[5px]"
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                        <td className="px-3 py-3">{item.position}</td>
                        <td className="px-3 py-3">{item.won}</td>
                        {/* <td className="px-3 py-3">
                          <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item.Stop === true ? "bg-green-200" : ""
                            } ${item.Stop === false ? "bg-gray-200" : ""}
                            `}
                          >
                            {item.Stop === true ? "Yes" : "No"}
                          </span>
                        </td> */}
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
        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={spinAwards.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSpinAwardsList(newPage);
          }}
        />
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
