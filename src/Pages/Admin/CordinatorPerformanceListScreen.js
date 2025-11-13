import React, { useState, useMemo, useEffect } from "react"; // Import React hooks
import Select from "react-select"; // Import react-select for dropdowns
import DatePicker from "react-datepicker"; // Import datepicker for custom date selection
import "react-datepicker/dist/react-datepicker.css"; // Import default datepicker styles
import { customStyles } from "../../Helper/helper";
import { LuCalendar } from "react-icons/lu";

// Options for period dropdown
const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "monthToDate", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const CordinatorPerformanceListScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({
    value: "last7days",
    label: "Last 7 days",
  });

  // State to toggle custom date selection fields
  const [showCustomDate, setShowCustomDate] = useState(false);

  // States for from and to dates
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Dummy data for School Wise Active Students
  const codinatorPerformanceData = [
    {
      name: "Kshitiz Bali",
      inPreparation: 9,
      inTransit: 13,
      delivered: 42,
      delayed: 5,
      date: "2025-10-31",
    },
    {
      name: "Shivakar Sharma",
      inPreparation: 18,
      inTransit: 24,
      delivered: 25,
      delayed: 6,
      date: "2025-10-30",
    },
    {
      name: "Puneet Yadav",
      inPreparation: 14,
      inTransit: 12,
      delivered: 34,
      delayed: 4,
      date: "2025-10-29",
    },
    {
      name: "Ajeet Singh",
      inPreparation: 35,
      inTransit: 12,
      delivered: 23,
      delayed: 2,
      date: "2025-10-28",
    },
  ];

  // State for active students data categorized by time period
  // const [activeStudentsData, setActiveStudentsData] = useState({
  //   today: codinatorPerformanceData.filter(
  //     (d) => d.date === new Date().toISOString().split("T")[0]
  //   ),
  //   last7days: codinatorPerformanceData.filter((d) => {
  //     const diff = (new Date() - new Date(d.date)) / (1000 * 60 * 60 * 24);
  //     return diff >= 0 && diff < 7;
  //   }),
  //   monthToDate: codinatorPerformanceData.filter(
  //     (d) => new Date(d.date).getMonth() === new Date().getMonth()
  //   ),
  //   custom: [],
  // });

  // Handle period dropdown selection change
  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
    setShowCustomDate(selected.value === "custom");
  };

  // Automatically update custom filtered data when fromDate or toDate changes
  // useEffect(() => {
  //   if (showCustomDate && fromDate && toDate) {
  //     const filtered = codinatorPerformanceData.filter((row) => {
  //       const rowDate = new Date(row.date);
  //       return rowDate >= fromDate && rowDate <= toDate;
  //     });
  //     setActiveStudentsData((prev) => ({ ...prev, custom: filtered }));
  //     setSelectedPeriod({ value: "custom", label: "Custom Date" });
  //   }
  // }, [fromDate, toDate, showCustomDate]);

  // // Memoized filtered active students data
  // const filteredCodinatorPerformanceData = useMemo(() => {
  //   return activeStudentsData[selectedPeriod.value] || [];
  // }, [selectedPeriod, activeStudentsData]);

  return (
    <>
      <div>
        <div className="flex gap-2 items-center mb-4">
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
        <div className="bg-white custom--shodow rounded-[10px] p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[150px]">Name</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">In Preparation</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">In Transit</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Delivered</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Delayed</th>
                  </tr>
                </thead>
                <tbody>
                  {codinatorPerformanceData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3 text-center">{item.inPreparation}</td>
                      <td className="px-3 py-3 text-center">{item.inTransit}</td>
                      <td className="px-3 py-3 text-center">{item.delivered}</td>
                      <td className="px-3 py-3 text-center">{item.delayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CordinatorPerformanceListScreen;
