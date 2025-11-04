import React, { useEffect, useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import deleteIcon from "../../Assests/Images/icons/delete.svg";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import FilterStudentPanel from "../../Components/FilterStudentPanel";
import EditStudentModal from "../../Components/EditStudentModal";
import { studentData } from "../../Helper/dummyData";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import confirmIcon from "../../Assests/Images/icons/confirm.svg";

const StudentsScreen = () => {
  const [students, setStudents] = useState(studentData);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit & Delete states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    Gender: null,
    School: null,
    Age: null,
    Status: null,
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  // Open edit modal
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
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
                        <td className="px-3 py-3">{item.Name}</td>
                        <td className="px-3 py-3">{item.Gender}</td>
                        <td className="px-3 py-3">{item.school_id}</td>
                        <td className="px-3 py-3">
                          {String(item.Age).padStart(2, "0")}
                        </td>
                        <td className="px-3 py-3">{item.District}</td>
                        <td className="px-3 py-3">2025-10-01</td>
                        <td className="px-3 py-3">
                          <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item.Status === "Active" ? "bg-green-200" : ""
                            } ${item.Status === "Inactive" ? "bg-gray-200" : ""}
                            `}
                          >
                            {item.Status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <div
                              className="cursor-pointer w-5"
                              onClick={() => handleEdit(item?.id)}
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
        {editModalOpen && (
          <EditStudentModal
            student={selectedStudent}
            onClose={() => setEditModalOpen(false)}
          />
        )}

      </div>
    </div>
  );
};

export default StudentsScreen;
