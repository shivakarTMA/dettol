import React, { useEffect, useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import deleteIcon from "../../Assests/Images/icons/delete.svg";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import EditSchoolModal from "../../Components/EditSchoolModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  address_en: Yup.string().required("Address English is required"),
  address_hi: Yup.string().required("Address Hindi is required"),
  city_en: Yup.string().required("City English is required"),
  city_hi: Yup.string().required("City Hindi is required"),
  pincode: Yup.number().required("Pincode is required"),
});

const SchoolsScreen = () => {
  const [schools, setSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editingOption, setEditingOption] = useState(null);
  
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSchoolList = async (currentPage = page) => {
    try {
      const res = await authAxios().get("/school/fetch/all", {
        params: {
          page: currentPage,
          limit: rowsPerPage,
        },
      });

      let data = res.data?.data || [];
      setSchools(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff");
    }
  };

  useEffect(() => {
    fetchSchoolList();
  }, []);

  const formik = useFormik({
    initialValues: {
      name_en: "",
      address_en: "",
      district_en: "",
      city_en: "",
      name_hi: "",
      address_hi: "",
      district_hi: "",
      city_hi: "",
      pincode: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/school/update/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/school/create", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchSchoolList();
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
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <div className="flex gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-[250px]">
              <img
                src={searchIcon}
                className="absolute top-[13px] left-[15px]"
              />
              <input
                type="text"
                placeholder="Search"
                className="pr-2 pl-[35px] py-2 rounded-full w-full"
              />
            </div>
          </div>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">City</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Students Enrolled
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Students Registered
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    schools.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name_en}</td>
                        <td className="px-3 py-3">{item.city_en}</td>
                        <td className="px-3 py-3 text-center">
                          {item.student_enrolled}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.student_registered}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
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

        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={schools.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSchoolList(newPage);
          }}
        />

        {/* Edit Modal */}
        {showModal && (
          <EditSchoolModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default SchoolsScreen;
