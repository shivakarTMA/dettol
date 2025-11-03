import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customStyles } from "../../Helper/helper";
import { LuCalendar } from "react-icons/lu";
// Options for period dropdown
const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "monthToDate", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const SchoolWiseActiveStudentScreen = () => {
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

  const allActiveStudentsData = [
    {
      id: 1,
      name: "LN Public School",
      enrolled: 20,
      registered: 15,
      active: 10,
      date: "2025-10-31",
    },
    {
      id: 2,
      name: "Dewan Public School",
      enrolled: 25,
      registered: 20,
      active: 18,
      date: "2025-10-30",
    },
    {
      id: 3,
      name: "Miniland Convent School",
      enrolled: 15,
      registered: 12,
      active: 10,
      date: "2025-10-29",
    },
    {
      id: 4,
      name: "Little Flower Public School",
      enrolled: 18,
      registered: 14,
      active: 12,
      date: "2025-10-28",
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

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <Select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          options={periodOptions}
          styles={customStyles}
          className="lg:min-w-[150px] min-w-[100px]"
        />

        {/* Custom date picker fields shown conditionally */}
        {showCustomDate && (
          <div className="flex items-center gap-2 w-[60%]">
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
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              {filteredActiveStudentsData.length > 0 ? (
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[170px]">School Name</th>
                      <th className="px-3 py-3 min-w-[100px]">St. Enrolled</th>
                      <th className="px-3 py-3 min-w-[120px]">
                        St. Registered
                      </th>
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
    </div>
  );
};

export default SchoolWiseActiveStudentScreen;
