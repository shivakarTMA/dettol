import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { customStyles } from "../Helper/helper";
import { IoTriangle } from "react-icons/io5";

const FilterStudentPanel = ({
  filters,
  handleFilterChange,
  onApply,
  onClose,
  students,
}) => {
  const modalRef = useRef(null);

  const genderOptions = [...new Set(students.map((s) => s.Gender))].map(
    (g) => ({
      value: g,
      label: g,
    })
  );

  const schoolOptions = [...new Set(students.map((s) => s.school_id))].map(
    (s) => ({
      value: s,
      label: s,
    })
  );

  const ageOptions = [...new Set(students.map((s) => s.Age))].map((a) => ({
    value: a,
    label: a,
  }));

  const statusOptions = [...new Set(students.map((s) => s.Status))].map(
    (st) => ({
      value: st,
      label: st,
    })
  );

//  useEffect(() => {
//     const handleClickOutside = (event) => {
//       // If the click is inside the modal, ignore it
//       if (modalRef.current && modalRef.current.contains(event.target)) return;

//       // If the click is inside any react-select element, ignore it
//       if (event.target.closest(".react-select")) return;

//       onClose();
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="bg-white mt-4 absolute z-10 top-[100%] p-4 min-w-[400px] rounded-[10px] custom--shodow"
    >
      <div className="absolute top-[-15px] left-[20px]">
            <IoTriangle />
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 ">
        <Select
          value={filters.Gender}
          onChange={(selected) => handleFilterChange("Gender", selected)}
          options={genderOptions}
          placeholder="Gender"
          styles={customStyles}
          isClearable
        />
        <Select
          value={filters.School}
          onChange={(selected) => handleFilterChange("School", selected)}
          options={schoolOptions}
          placeholder="School"
          styles={customStyles}
          isClearable
        />
        <Select
          value={filters.Age}
          onChange={(selected) => handleFilterChange("Age", selected)}
          options={ageOptions}
          placeholder="Age"
          styles={customStyles}
          isClearable
        />
        <Select
          value={filters.Status}
          onChange={(selected) => handleFilterChange("Status", selected)}
          options={statusOptions}
          placeholder="Status"
          styles={customStyles}
          isClearable
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onApply}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterStudentPanel;
