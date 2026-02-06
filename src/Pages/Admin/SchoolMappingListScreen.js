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
  schools: Yup.array()
    .of(
      Yup.object().shape({
        district: Yup.object().nullable().required("District is required"),
        school: Yup.object().nullable().required("School is required"),
      })
    )
    .min(1, "At least one school must be selected"),

  schoolIds: Yup.array()
    .of(Yup.number())
    .min(1, "Please select at least one school"),
});

const SchoolMappingListScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editingOption, setEditingOption] = useState(null);

  const fetchCoodinatorMapList = async () => {
    try {
      const res = await authAxios().get("/staff/coordinator/list");

      let data = res.data?.data || [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch coordinator");
    }
  };

  useEffect(() => {
    fetchCoodinatorMapList();
  }, []);

  const formik = useFormik({
    initialValues: {
      schools: [{ district: null, school: null }],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const schoolIds = values.schools.map((s) => s.school.value);

        const payload = { schoolIds };

        // UPDATE API
        await authAxios().put(`/school/mapping/${editingOption}`, payload);

        toast.success("Updated Successfully");
        fetchCoodinatorMapList();
        resetForm();
        setShowModal(false);
      } catch (err) {
        toast.error("Failed to save mapping");
      }
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
                    <th className="px-3 py-3 min-w-[150px]">
                      Coordinator Name
                    </th>
                    <th className="px-3 py-3 min-w-[170px]">
                      District Assigned
                    </th>
                    <th className="px-3 py-3 min-w-[150px] text-center">
                      No. of students
                    </th>
                    {/* <th className="px-3 py-3 min-w-[120px]">Status</th> */}
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.name}</td>
                        <td className="px-3 py-3">{item?.district_assigned}</td>
                        <td className="px-3 py-3 text-center">
                          {item?.total_student}
                        </td>
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
