// Importing necessary dependencies and libraries
import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customStyles } from "../Helper/helper";
import { Link } from "react-router-dom";
import { LuCalendar } from "react-icons/lu";

// Options for milestone dropdown
const milestoneOptions = [
  { value: "milestone1", label: "Milestone 1" },
  { value: "milestone2", label: "Milestone 2" },
  { value: "milestone3", label: "Milestone 3" },
];

// Options for period dropdown
const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "monthToDate", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

// Defining main functional component for the School Dashboard Tables
const SchoolDashboardTables = () => {
  // State to store selected milestone filter option
  const [selectedMilestone, setSelectedMilestone] = useState({
    value: "milestone1",
    label: "Milestone 1",
  });

  // State to store selected period filter option
  const [selectedPeriod, setSelectedPeriod] = useState({
    value: "last7days",
    label: "Last 7 days",
  });

  // State to toggle custom date selection fields
  const [showCustomDate, setShowCustomDate] = useState(false);

  // States for from and to dates
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Dummy JSON data for milestones achieved

  const [schoolWiseMilestones, setSchoolWiseMilestones] = useState([
    {
      id: 1,
      name: "LN Public School",
      total: 52,
      male: 32,
      female: 20,
      milestone: "milestone1",
    },
    {
      id: 2,
      name: "Dewan Public School",
      total: 60,
      male: 38,
      female: 22,
      milestone: "milestone2",
    },
    {
      id: 3,
      name: "Miniland Convent School",
      total: 48,
      male: 30,
      female: 18,
      milestone: "milestone3",
    },
    {
      id: 4,
      name: "Little Flower Public School",
      total: 50,
      male: 25,
      female: 25,
      milestone: "milestone3",
    },
  ]);

  const filteredData = schoolWiseMilestones.filter(
    (item) => item.milestone === selectedMilestone.value
  );

  // Dummy data for School Wise Active Students
  const allActiveStudentsData = [
    {
      id: 1,
      name: "LN Public School",
      enrolled: 20,
      registered: 15,
      active: 10,
      date: "2025-10-20",
    },
    {
      id: 2,
      name: "Dewan Public School",
      enrolled: 25,
      registered: 20,
      active: 18,
      date: "2025-10-21",
    },
    {
      id: 3,
      name: "Miniland Convent School",
      enrolled: 15,
      registered: 12,
      active: 10,
      date: "2025-10-22",
    },
    {
      id: 4,
      name: "Little Flower Public School",
      enrolled: 18,
      registered: 14,
      active: 12,
      date: "2025-10-23",
    },
  ];

  // State for active students data categorized by time period
  const [activeStudentsData, setActiveStudentsData] = useState({
    today: allActiveStudentsData.filter(
      (d) => d.date === new Date().toISOString().split("T")[0]
    ),
    last7days: allActiveStudentsData.filter((d) => {
      const diff = (new Date() - new Date(d.date)) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < 7;
    }),
    monthToDate: allActiveStudentsData.filter(
      (d) => new Date(d.date).getMonth() === new Date().getMonth()
    ),
    custom: [],
  });

  // Handle period dropdown selection change
  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
    setShowCustomDate(selected.value === "custom");
  };

  // Automatically update custom filtered data when fromDate or toDate changes
  useEffect(() => {
    if (showCustomDate && fromDate && toDate) {
      const filtered = allActiveStudentsData.filter((row) => {
        const rowDate = new Date(row.date);
        return rowDate >= fromDate && rowDate <= toDate;
      });
      setActiveStudentsData((prev) => ({ ...prev, custom: filtered }));
      setSelectedPeriod({ value: "custom", label: "Custom Date" });
    }
  }, [fromDate, toDate, showCustomDate]);

  // Memoized filtered active students data
  const filteredActiveStudentsData = useMemo(() => {
    return activeStudentsData[selectedPeriod.value] || [];
  }, [selectedPeriod, activeStudentsData]);

  // JSX UI structure rendering tables and filters
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      {/* Milestones Table Section */}
      <div className="bg-white rounded-lg custom--shodow lg:p-4 p-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="lg:text-lg text-[16px] font-semibold text-gray-900">
            School Wise Milestones Achieved
          </h2>
          <Link
            to={`/school-wise-milestones?milestone=${selectedMilestone.value}`}
            className="underline text-[#009EB2] text-lg"
          >
            <small>View All</small>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Select
            value={selectedMilestone}
            options={milestoneOptions}
            onChange={setSelectedMilestone}
            styles={customStyles}
            className="lg:min-w-[150px] min-w-[100px]"
          />
        </div>

        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th className="px-3 py-3 min-w-[170px]">School Name</th>
                  <th className="px-3 py-3 min-w-[120px]">Total Students</th>
                  <th className="px-3 py-3 min-w-[90px]">Male</th>
                  <th className="px-3 py-3 min-w-[90px]">Female</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3">{item.total}</td>
                      <td className="px-3 py-3">{item.male}</td>
                      <td className="px-3 py-3">{item.female}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-gray-500">
                      No data available for this milestone.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Students Table Section */}
      <div className="bg-white rounded-lg custom--shodow lg:p-4 p-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="lg:text-lg text-[16px] font-semibold text-gray-900">
            School Wise Active Students
          </h2>
          <Link to="#" className="underline text-[#009EB2] text-lg">
            <small>View All</small>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            options={periodOptions}
            styles={customStyles}
            className="lg:min-w-[150px] min-w-[100px]"
          />

          {/* Custom date picker fields shown conditionally */}
          {showCustomDate && (
            <div className="flex items-center gap-3 w-[60%]">
              <div className="custom--date relative">
                <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                  <LuCalendar />
                </span>
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  dateFormat="yyyy-MM-dd"
                  className="input--icon"
                  placeholderText="From Date"
                />
              </div>
              <div className="custom--date relative">
                <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                  <LuCalendar />
                </span>
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  placeholderText="To Date"
                  dateFormat="yyyy-MM-dd"
                  className="input--icon"
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
            {filteredActiveStudentsData.length > 0 ? (
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">School Name</th>
                    <th className="px-3 py-3 min-w-[100px]">St. Enrolled</th>
                    <th className="px-3 py-3 min-w-[120px]">St. Registered</th>
                    <th className="px-3 py-3 min-w-[100px]">Active St.</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveStudentsData.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-3">{row.name}</td>
                      <td className="px-3 py-3">{row.enrolled}</td>
                      <td className="px-3 py-3">{row.registered}</td>
                      <td className="px-3 py-3">{row.active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No data available for the selected date range.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting component as default export
export default SchoolDashboardTables;
