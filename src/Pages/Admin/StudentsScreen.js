import React, { useEffect, useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import FilterStudentPanel from "../../Components/FilterStudentPanel";
import EditStudentModal from "../../Components/EditStudentModal";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiStudentLight } from "react-icons/pi";

const validationSchema = Yup.object().shape({
  profile_pic: Yup.mixed()
    .required("Profile Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (typeof value === "string") return true; // when editing existing image (URL)
      return value && value instanceof File;
    }),
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  parent_name_en: Yup.string().required("Parent Name English is required"),
  parent_name_hi: Yup.string().required("Parent Name Hindi is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  gender_en: Yup.string().required("Gender English is required"),
  gender_hi: Yup.string().required("Gender Hindi is required"),
  age: Yup.number()
    .min(3, "Age must be at least 3")
    .required("Age is required"),
  class_name: Yup.string().required("Class is required"),
  section: Yup.string().required("Section is required"),
  address_en: Yup.string().required("Address English is required"),
  address_hi: Yup.string().required("Address Hindi is required"),
  district_en: Yup.string().required("District English is required"),
  district_hi: Yup.string().required("District Hindi is required"),
  city_en: Yup.string().required("City English is required"),
  city_hi: Yup.string().required("City Hindi is required"),

  pincode: Yup.number().required("Pincode is required"),
  card_no: Yup.string().required("Card No. is required"),
  school_id: Yup.string().required("School Name is required"),
});

const StudentsScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    Gender: null,
    School: null,
    Age: null,
    Status: null,
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchStudentList = async (currentPage = page) => {
    try {
      const res = await authAxios().get("/student/fetch/all", {
        params: {
          page: currentPage,
          limit: rowsPerPage,
        },
      });

      let data = res.data?.data || [];
      setStudents(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reward");
    }
  };

  useEffect(() => {
    fetchStudentList();
  }, []);

  const formik = useFormik({
    initialValues: {
      profile_pic: null,
      name_en: "",
      parent_name_en: "",
      parent_name_hi: "",
      name_hi: "",
      mobile: "",
      gender_en: "",
      gender_hi: "",
      age: null,
      class_name: null,
      section: "",
      address_en: "",
      address_hi: "",
      district_en: "",
      district_hi: "",
      city_en: "",
      city_hi: "",
      pincode: "",
      card_no: "",
      school_id: null,
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();

        formData.append("name_en", values.name_en);
        formData.append("name_hi", values.name_hi);
        formData.append("parent_name_en", values.parent_name_en);
        formData.append("parent_name_hi", values.parent_name_hi);
        formData.append("mobile", values.mobile);
        formData.append("gender_en", values.gender_en);
        formData.append("gender_hi", values.gender_hi);
        formData.append("age", values.age);
        formData.append("class_name", values.class_name);
        formData.append("section", values.section);
        formData.append("address_en", values.address_en);
        formData.append("address_hi", values.address_hi);
        formData.append("district_en", values.district_en);
        formData.append("district_hi", values.district_hi);
        formData.append("city_en", values.city_en);
        formData.append("city_hi", values.city_hi);
        formData.append("pincode", values.pincode);
        formData.append("card_no", values.card_no);
        formData.append("school_id", values.school_id);
        formData.append("status", values.status);

        if (values.profile_pic instanceof File) {
          formData.append("file", values.profile_pic);
        }

        let response;

        if (editingOption) {
          await authAxios().put(`/student/update/${editingOption}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Updated Successfully");
        } else {
          await authAxios().post(`/student/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Created Successfully");
        }

        if (response?.data?.status === false) {
          const message = response.data.message;
          if (
            message.includes("already exists") ||
            message.includes("already exists for this card number")
          ) {
            toast.error(message);
            // 🚫 Stop here — don't reset form or close modal
            return;
          }
        }

        fetchStudentList();
        resetForm();
        setEditingOption(null);
        setShowModal(false);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || err.message);
      }
    },
  });

  useEffect(() => {
    if (showFilterModal) {
      setTempFilters(filters);
    }
  }, [showFilterModal]);

  const handleTempFilterChange = (field, selectedOption) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: selectedOption,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const clearFilter = (field) => {
    const newFilters = { ...filters, [field]: null };
    setFilters(newFilters);
    setTempFilters(newFilters);
  };

  // Filtered student data
  const filteredStudents = students.filter((student) => {
    const genderMatch = filters.Gender
      ? student.Gender === filters.Gender.value
      : true;
    const schoolMatch = filters.School
      ? student.school_id === filters.School.value
      : true;
    const ageMatch = filters.Age ? student.Age === filters.Age.value : true;
    const statusMatch = filters.Status
      ? student.Status === filters.Status.value
      : true;
    return genderMatch && schoolMatch && ageMatch && statusMatch;
  });

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
          <div className="relative">
            <div className="flex gap-2 items-center">
              <button
                className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
                onClick={() => {
                  setEditingOption(null);
                  formik.resetForm();
                  setShowModal(true);
                }}
              >
                <PiStudentLight className="text-xl" />
                <span>Create student</span>
              </button>
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-[34px] h-[30px] bg-white text-black rounded-[5px] flex items-center justify-center gap-2 min-h-[30px] border-[#D4D4D4] border-[2px]"
              >
                <HiOutlineAdjustmentsHorizontal className="text-lg" />
              </button>
              <span className="text-md">Filters</span>
            </div>
            {showFilterModal && (
              <FilterStudentPanel
                filters={tempFilters}
                handleFilterChange={handleTempFilterChange}
                onClose={() => setShowFilterModal(false)}
                onApply={applyFilters}
                students={students}
              />
            )}
          </div>
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
        {Object.values(filters).some((value) => value) && (
          <div className="flex gap-2 mb-5">
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="flex items-center bg-[#0072CE] text-white px-3 py-1 rounded-full text-sm"
                >
                  {value.label}
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-2 text-white"
                  >
                    ×
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}

        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[150px]">Student Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Gender</th>
                    <th className="px-3 py-3 min-w-[120px] ">School Name</th>
                    <th className="px-3 py-3 min-w-[80px]">Age</th>
                    <th className="px-3 py-3 min-w-[120px]">District</th>
                    <th className="px-3 py-3 min-w-[120px] ">Last Logged in</th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents?.length > 0 ? (
                    filteredStudents.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name_en}</td>
                        <td className="px-3 py-3">{item.gender_en}</td>
                        <td className="px-3 py-3">{item.school_name}</td>
                        <td className="px-3 py-3">
                          {String(item.age).padStart(2, "0")}
                        </td>
                        <td className="px-3 py-3">{item.district_en}</td>
                        <td className="px-3 py-3">2025-10-01</td>
                        <td className="px-3 py-3">
                          <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item.status === "ACTIVE" ? "bg-green-200" : ""
                            } ${item.status === "INACTIVE" ? "bg-gray-200" : ""}
                            `}
                          >
                            {item.status}
                          </span>
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
                  ) : (
                    <tr>
                      <td className="text-center pt-2" colSpan={9}>
                        No data available
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
          currentDataLength={students.length}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />

        {/* Edit Modal */}
        {showModal && (
          <EditStudentModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default StudentsScreen;
