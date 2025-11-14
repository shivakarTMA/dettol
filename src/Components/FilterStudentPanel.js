import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { IoTriangle } from "react-icons/io5";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";

const FilterStudentPanel = ({
  filters,
  handleFilterChange,
  onApply,
  onClose,
}) => {
  // Ref to detect clicks outside modal
  const modalRef = useRef(null);

  // Local state for school list options
  const [schoolList, setSchoolList] = useState([]);

  // Fetch list of schools from API
  const fetchSchoolList = async () => {
    try {
      const res = await authAxios().get("/school/fetch/all");
      const schoolMap = res.data?.data || [];

      // Add "All" as a default option
      setSchoolList([
        ...schoolMap.map((c) => ({
          value: c.id,
          label: c.name_en,
        })),
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch school list");
    }
  };

  useEffect(() => {
    fetchSchoolList();
  }, []);

  // ✅ Static filter options
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const ageOptions = [
    { value: "6-8", label: "6-8 Years" },
    { value: "9-11", label: "9-11 Years" },
    { value: "12-14", label: "12-14 Years" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) return;
      if (event.target.closest(".react-select")) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="bg-white mt-4 absolute z-10 top-[100%] p-4 min-w-[400px] rounded-[10px] custom--shodow"
    >
      {/* Triangle icon for dropdown pointer */}
      <div className="absolute top-[-15px] left-[20px]">
        <IoTriangle />
      </div>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Gender Filter */}
        <Select
          value={filters.gender_en}
          onChange={(selected) => handleFilterChange("gender_en", selected)}
          options={genderOptions}
          placeholder="Gender"
          styles={customStyles}
        />

        {/* School Filter */}
        <Select
          value={filters.school_id}
          onChange={(selected) => handleFilterChange("school_id", selected)}
          options={schoolList}
          placeholder="School"
          styles={customStyles}
        />

        {/* Age Filter */}
        <Select
          value={filters.age_range}
          onChange={(selected) => handleFilterChange("age_range", selected)}
          options={ageOptions}
          placeholder="Age"
          styles={customStyles}
        />

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(selected) => handleFilterChange("status", selected)}
          options={statusOptions}
          placeholder="Status"
          styles={customStyles}
        />
      </div>

      {/* Apply button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            // Ensure current school selection is also applied
            onApply();
          }}
          className="px-4 py-2 rounded-lg bg-[#008421] text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterStudentPanel;
