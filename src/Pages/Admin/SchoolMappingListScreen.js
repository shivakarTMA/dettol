import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import EditSchoolMappingModal from "../../Components/EditSchoolMappingModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Tooltip from "../../Components/Common/Tooltip";
import { IoAdd } from "react-icons/io5";

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  position: Yup.string().required("Position is required"),
});

const dummyStockData = [
  {
    id: 1,
    CoordinatorName: "Avinash Malhotra",
    DistrictAssigned: "Piprauli, Nagar Kshetra",
    NoOfStudents: 234,
  },
  {
    id: 2,
    CoordinatorName: "Sharmila Yadav",
    DistrictAssigned: "Piprauli",
    NoOfStudents: 16,
  },
  {
    id: 3,
    CoordinatorName: "Avinash Malhotra",
    DistrictAssigned: "Piprauli",
    NoOfStudents: 34,
  },
  {
    id: 4,
    CoordinatorName: "Avinash Malhotra",
    DistrictAssigned: "Piprauli",
    NoOfStudents: 25,
  },
  {
    id: 5,
    CoordinatorName: "Avinash Malhotra",
    DistrictAssigned: "Piprauli, Bhathat",
    NoOfStudents: 25,
  },
];

const SchoolMappingListScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState(dummyStockData);

  const [editingOption, setEditingOption] = useState(null);

  //   const fetchInventoryList = async () => {
  //     try {
  //       const res = await authAxios().get("/category/fetch/all");

  //       let data = res.data?.data || [];
  //       setCategories(data);
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to fetch category");
  //     }
  //   };

  //   useEffect(() => {
  //     fetchInventoryList();
  //   }, []);

  const formik = useFormik({
    initialValues: {
    coordinator: null,
    schools: [{ district: null, school: null }],
    },
    // validationSchema,
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
        // fetchInventoryList();
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
        {/* <div className="mb-3 flex">
          <button
            className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
            onClick={() => {
              setEditingOption(null);
              formik.resetForm();
              setShowModal(true);
            }}
          >
            <IoAdd className="text-xl" />
            <span>Add Mapping</span>
          </button>
        </div> */}
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[120px]">S.No.</th>
                    <th className="px-3 py-3 min-w-[150px]">
                      Coordinator Name
                    </th>
                    <th className="px-3 py-3 min-w-[170px]">
                      District Assigned
                    </th>
                    <th className="px-3 py-3 min-w-[150px] text-center">No. of students</th>
                    {/* <th className="px-3 py-3 min-w-[120px]">Status</th> */}
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
                        <td className="px-3 py-3">{item?.id}</td>
                        <td className="px-3 py-3">{item?.CoordinatorName}</td>
                        <td className="px-3 py-3">{item?.DistrictAssigned}</td>
                        <td className="px-3 py-3 text-center">{item?.NoOfStudents}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content="Edit School Mapping"
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
          <EditSchoolMappingModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default SchoolMappingListScreen;
