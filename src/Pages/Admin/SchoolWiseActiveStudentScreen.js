import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customStyles } from "../../Helper/helper";
import { LuCalendar } from "react-icons/lu";
import { toast } from "react-toastify";
import { authAxios } from "../../Config/config";

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "month_till_date", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const SchoolWiseActiveStudentScreen = () => {
  const [activeStudentsData, setActiveStudentsData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[1]);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Handle period dropdown selection change
  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
    setShowCustomDate(selected.value === "custom");
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchSchoolActiveStudentList = async () => {
    try {
      let params = {};

      if (selectedPeriod) {
        if (selectedPeriod.value === "custom") {
          if (fromDate && toDate) {
            const startDate = formatDate(fromDate);
            const endDate = formatDate(toDate);

            params = {
              ...params,
              dateFilter: "custom",
              startDate,
              endDate,
            };
          } else {
            return;
          }
        } else {
          // Use pre-defined date filters like 'today', 'last_7_days', 'month_till_date'
          params = { dateFilter: selectedPeriod.value };
        }
      }

      // Fetch data with the parameters
      const res = await authAxios().get(
        "/dashboard/school/active/student/list",
        { params }
      );

      let data = res.data?.data || [];
      setActiveStudentsData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch active students.");
    }
  };

  useEffect(() => {
    if (selectedPeriod?.value === "custom") {
      // wait until both dates selected
      if (fromDate && toDate) fetchSchoolActiveStudentList();
    } else {
      fetchSchoolActiveStudentList();
    }
  }, [selectedPeriod, fromDate, toDate]);

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
                onChange={(date) => {
                  setFromDate(date);
                  if (fromDate && date && fromDate < date) {
                    setToDate(null);
                  }
                }}
                dateFormat="dd-MM-yyyy"
                className="input--icon"
                placeholderText="From Date"
                maxDate={new Date()}
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
                dateFormat="dd-MM-yyyy"
                className="input--icon"
                minDate={fromDate || null} // cannot select before start
                maxDate={new Date()} // cannot select future
                disabled={!fromDate} // disable until start date chosen
              />
            </div>
          </div>
        )}
      </div>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">St. Registered</th>
                    <th className="px-3 py-3 min-w-[100px] text-center">St. Enrolled</th>
                    <th className="px-3 py-3 min-w-[100px] text-center">Active St.</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStudentsData.length > 0 ? (
                    activeStudentsData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.school_name}</td>
                        <td className="px-3 py-3 text-center">
                          {item?.student_registered_count}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.enrolled_student_count}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.total_active_student_count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-3 text-gray-500"
                      >
                        No data available for the selected date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolWiseActiveStudentScreen;
