import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import Pagination from "../../Components/Common/Pagination";
import EditTaskModal from "../../Components/EditTaskModal";
import { toast } from "react-toastify";
import { authAxios } from "../../Config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { customStyles, formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  category_id: Yup.string().required("Category is required"),
  title_en: Yup.string().required("Title English is required"),
  title_hi: Yup.string().required("Title Hindi is required"),
  loyalty_points: Yup.number()
    .typeError("Loyalty Points must be a number")
    .required("Loyalty Points is required"),
  position: Yup.number()
    .typeError("Position must be a number")
    .required("Position is required"),
  instructions_en: Yup.array()
    .of(Yup.string().required("Instruction (English) is required"))
    .min(1, "At least one instruction is required"),
  instructions_hi: Yup.array()
    .of(Yup.string().required("Instruction (Hindi) is required"))
    .min(1, "At least one instruction is required"),
});

const TaskListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    value: "All",
    label: "All",
  });

  const [editingOption, setEditingOption] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTasksList = async (
    currentPage = page,
    category_id = selectedCategory.value
  ) => {
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
      };

      if (category_id !== "All") {
        params.category_id = category_id;
      }

      const res = await authAxios().get("/task/fetch/all", { params });

      const data = res.data?.data || [];
      setTaskList(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      toast.error("Failed to fetch task");
    }
  };

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/category/fetch/all");
      const categories = res.data?.data || [];

      setCategoryList([
        { value: "All", label: "All" },
        ...categories.map((c) => ({ value: c.id, label: c.name_en })),
      ]);
    } catch (err) {
      toast.error("Failed to fetch category");
    }
  };

  useEffect(() => {
    fetchTasksList();
    fetchCategoryList();
  }, []);

  const formik = useFormik({
    initialValues: {
      category_id: null, // Category ID
      title_en: "", // English title
      instructions_en: [], // English instructions
      title_hi: "", // Hindi title
      instructions_hi: [], // Hindi instructions
      loyalty_points: "", // Loyalty points
      position: "", // Position
      status: "ACTIVE", // Default status
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/task/update/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/task/create", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchTasksList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save user");
      }

      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  console.log(taskList, "taskList");
  console.log(selectedCategory, "selectedCategory");

  return (
    <>
      <div className="">
        {/* <div className="max-w-[150px] w-full mb-3">
          <Select
            value={selectedCategory}
            onChange={(selected) => {
              setSelectedCategory(selected);
              setPage(1);
              fetchTasksList(1, selected.value);
            }}
            options={categoryList}
            styles={customStyles}
          />
        </div> */}
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[150px]">Category Name</th>
                    <th className="px-3 py-3 min-w-[170px]">Title</th>
                    <th className="px-3 py-3 min-w-[150px] text-center">
                      Loyalty Points
                    </th>
                    <th className="px-3 py-3 min-w-[150px] text-center">
                      Claim by Students
                    </th>
                    <th className="px-3 py-3 min-w-[110px]">Status</th>
                    <th className="px-3 py-3 min-w-[100px] text-center">
                      Position
                    </th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.category_name}</td>
                      <td className="px-3 py-3">{item?.title_en}</td>
                      <td className="px-3 py-3 text-center">
                        {item?.loyalty_points}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.student_claimed}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`block w-fit px-3 py-1 rounded-full capitalize ${
                            item?.status === "ACTIVE"
                              ? "bg-green-200"
                              : "bg-gray-200"
                          }`}
                        >
                          {formatCapitalText(item?.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.position}
                      </td>
                      <td className="px-3 py-3">
                        <Tooltip
                          id={`tooltip-edit-${item.id}`}
                          content={`${userType === "ADMIN" ? "Edit Task" : "View Task"}`}
                          place="left"
                        >
                          <div
                            className="cursor-pointer w-8"
                            onClick={() => {
                              setEditingOption(item?.id);
                              setShowModal(true);
                            }}
                          >
                            <img src={userType === "ADMIN" ? editIcon : viewIcon} alt="view" className="w-full" />
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
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
          currentDataLength={taskList.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchTasksList(newPage);
          }}
        />
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditTaskModal
          setShowModal={setShowModal}
          editingOption={editingOption}
          formik={formik}
        />
      )}
    </>
  );
};

export default TaskListScreen;
