import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit-old.svg";
import deleteIcon from "../../Assests/Images/icons/delete.svg";
import EditUserManagementModal from "../../Components/EditUserManagementModal";
import { formatRole } from "../../Helper/helper";
import { IoMdPersonAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAxios } from "../../Config/config";
import Tooltip from "../../Components/Common/Tooltip";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name English is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  report_to: Yup.string().required("Report to is required"),
});

const UserManagementScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [userManagement, setUserManagement] = useState([]);

  // Edit & Delete states
  const [editingOption, setEditingOption] = useState(null);

  const fetchUserManagement = async () => {
    try {
      const res = await authAxios().get("/staff/fetch/all");

      let data = res.data?.data || [];
      setUserManagement(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff");
    }
  };

  useEffect(() => {
    fetchUserManagement();
  }, []);

  const handleDelete = async (id) => {
    try {
      await authAxios().delete(`/staff/delete/${id}`);
      toast.success("User deleted successfully");
      fetchUserManagement(); // Re-fetch the list after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      role: "",
      report_to: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/staff/update/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/staff/create", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchUserManagement();
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
            <IoMdPersonAdd />
            <span>Create User</span>
          </button>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[130px]">User Name</th>
                    <th className="px-3 py-3 min-w-[150px]">Mobile Number</th>
                    <th className="px-3 py-3 min-w-[120px]">Role</th>
                    <th className="px-3 py-3 min-w-[120px]">Reports To</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userManagement.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    userManagement.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3">{item.mobile}</td>
                        <td className="px-3 py-3">{item.role}</td>
                        <td className="px-3 py-3">{item.report_to}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-0">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content="Edit User"
                              place="left"
                            >
                              <button
                                className={`w-11 h-9 flex items-center justify-center rounded-l-[5px] border `}
                                onClick={() => {
                                  setEditingOption(item?.id);
                                  setShowModal(true);
                                }}
                              >
                                <img src={editIcon} className={`w-4 `} />
                              </button>
                            </Tooltip>
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content="Delete User"
                              place="left"
                            >
                              <button
                                className={`w-11 h-9 flex items-center justify-center rounded-r-[5px] border `}
                                onClick={() => handleDelete(item.id)}
                              >
                                <img src={deleteIcon} className={`w-4`} />
                              </button>
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
          <EditUserManagementModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementScreen;
