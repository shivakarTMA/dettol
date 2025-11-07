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
import { formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";

const validationSchema = Yup.object().shape({
  profile_pic: Yup.mixed()
    .required("Profile Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (typeof value === "string") return true;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOption, setEditingOption] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [cardSearch, setCardSearch] = useState("");
  const [cardError, setCardError] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    gender_en: null,
    school_id: null,
    age: null,
    status: null,
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // 🧠 Fetch all students once
  const fetchStudentList = async () => {
    try {
      const res = await authAxios().get("/student/fetch/all");
      const data = res.data?.data || [];
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students");
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

  // 🧠 Filter logic (case-insensitive)
  const filteredStudents = students.filter((student) => {
    const genderMatch = filters.gender_en
      ? student.gender_en?.toLowerCase() ===
        filters.gender_en.value?.toLowerCase()
      : true;

    const schoolMatch = filters.school_id
      ? String(student.school_id) === String(filters.school_id.value)
      : true;

    const ageMatch = filters.age
      ? Number(student.age) === Number(filters.age.value)
      : true;

    const statusMatch = filters.status
      ? student.status?.toLowerCase() === filters.status.value?.toLowerCase()
      : true;

    const searchMatch = searchTerm
      ? student.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile?.toString().includes(searchTerm)
      : true;

    // ✅ Card number search
    const cardMatch = cardSearch
      ? student.card_no
          ?.toString()
          .replace(/-/g, "")
          .includes(cardSearch.replace(/-/g, ""))
      : true;

    return (
      genderMatch &&
      schoolMatch &&
      ageMatch &&
      statusMatch &&
      searchMatch &&
      cardMatch
    );
  });

  // 🧮 Pagination logic on filtered data
  const totalFilteredPages =
    Math.ceil(filteredStudents.length / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // 🔄 Auto reset to page 1 if data shrinks
  useEffect(() => {
    if (page > totalFilteredPages) {
      setPage(1);
    }
  }, [filteredStudents.length]);

  // 🧩 Handle Filter Apply
  const applyFilters = () => {
    setFilters(tempFilters);
    setPage(1);
    setShowFilterModal(false);
  };

  // 🧩 Clear individual filter
  const clearFilter = (field) => {
    const newFilters = { ...filters, [field]: null };
    setFilters(newFilters);
    setTempFilters(newFilters);
    setPage(1);
  };

  const formatCardNumber = (cardNo) => {
    const str = cardNo?.toString().padStart(16, "0");
    return `${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(
      8,
      12
    )}-${str.slice(12, 16)}`;
  };

  const handleCardSearchChange = (e) => {
    let value = e.target.value.replace(/[^0-9-]/g, ""); // allow only digits & dashes
    let numericValue = value.replace(/-/g, ""); // remove dashes for comparison

    // Auto-format as xxxx-xxxx-xxxx-xxxx
    if (numericValue.length > 0) {
      value = numericValue
        .substring(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1-")
        .slice(0, 19);
    }

    setCardSearch(value);

    if (!numericValue) {
      setCardError("");
      return;
    }

    if (numericValue.length !== 16) {
      setCardError("Please enter 16 digits");
    } else {
      setCardError("");
    }

    // Always reset to first page
    setPage(1);
  };

  console.log(paginatedStudents, "paginatedStudents");

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
        <div className="relative">
          <div className="flex gap-2 items-center">
            <button
              className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
              onClick={() => {
                setEditingOption(null);
                setShowModal(true);
              }}
            >
              <PiStudentLight className="text-xl" />
              <span>Create student</span>
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="w-[34px] h-[30px] bg-white text-black rounded-[5px] flex items-center justify-center border-[#D4D4D4] border-[2px]"
            >
              <HiOutlineAdjustmentsHorizontal className="text-lg" />
            </button>
            <span className="text-md">Filters</span>
          </div>

          {showFilterModal && (
            <FilterStudentPanel
              filters={tempFilters}
              handleFilterChange={(field, value) =>
                setTempFilters((prev) => ({ ...prev, [field]: value }))
              }
              onApply={applyFilters}
              onClose={() => setShowFilterModal(false)}
            />
          )}
        </div>

        <div className="flex gap-3 flex-1 justify-end">
          <div className="relative w-full max-w-[250px]">
            <img src={searchIcon} className="absolute top-[13px] left-[15px]" />
            <input
              type="text"
              className="pr-2 pl-[35px] py-2 rounded-full w-full"
              placeholder="Search by card number"
              value={cardSearch}
              onChange={handleCardSearchChange}
              maxLength={19}
            />
            {cardError && (
              <span className="text-red-500 text-sm mt-1">{cardError}</span>
            )}
          </div>
          <div className="relative w-full max-w-[250px]">
            <img src={searchIcon} className="absolute top-[13px] left-[15px]" />
            <input
              type="text"
              placeholder="Search by name or mobile"
              className="pr-2 pl-[35px] py-2 rounded-full w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {Object.values(filters).some((v) => v) && (
        <div className="flex gap-2 mb-5 flex-wrap">
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

      {/* Table */}
      <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F1F1F1]">
              <tr>
                <th className="px-3 py-3 min-w-[170px]">Card No.</th>
                <th className="px-3 py-3 min-w-[120px]">Student Name</th>
                <th className="px-3 py-3 min-w-[90px]">Gender</th>
                <th className="px-3 py-3 min-w-[110px]">School</th>
                <th className="px-3 py-3 min-w-[50px]">Age</th>
                <th className="px-3 py-3 min-w-[90px]">District</th>
                <th className="px-3 py-3 min-w-[80px]">Status</th>
                <th className="px-3 py-3 min-w-[70px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-3">
                      {formatCardNumber(item.card_no)}
                    </td>
                    <td className="px-3 py-3">{item.name_en}</td>
                    <td className="px-3 py-3">{item.gender_en}</td>
                    <td className="px-3 py-3">{item.school_name}</td>
                    <td className="px-3 py-3">
                      {String(item.age).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-3">{item.district_en}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`block w-fit px-3 py-1 rounded-full capitalize ${
                          item.status === "ACTIVE"
                            ? "bg-green-200"
                            : "bg-gray-200"
                        }`}
                      >
                        {formatCapitalText(item.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Tooltip
                        id={`tooltip-edit-${item.id}`}
                        content="Edit Student"
                        place="left"
                      >
                        <div
                          className="cursor-pointer w-5"
                          onClick={() => {
                            setEditingOption(item?.id);
                            setShowModal(true);
                          }}
                        >
                          <img src={editIcon} alt="view" className="w-full" />
                        </div>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-3">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Pagination visible when >1 page */}
      {totalFilteredPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalFilteredPages}
          rowsPerPage={rowsPerPage}
          totalCount={filteredStudents.length}
          currentDataLength={paginatedStudents.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Edit Modal */}
      {showModal && (
        <EditStudentModal
          setShowModal={setShowModal}
          editingOption={editingOption}
          formik={formik}
        />
      )}
    </div>
  );
};

export default StudentsScreen;
