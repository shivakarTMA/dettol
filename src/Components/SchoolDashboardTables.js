// Importing necessary dependencies and libraries
import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customStyles } from "../Helper/helper";
import { Link } from "react-router-dom";
import { LuCalendar } from "react-icons/lu";
import { toast } from "react-toastify";
import { authAxios } from "../Config/config";

const milestoneOptions = [
  { value: "Milestone 1", label: "Milestone 1" },
  { value: "Milestone 2", label: "Milestone 2" },
  { value: "Milestone 3", label: "Milestone 3" },
  { value: "Milestone 4", label: "Milestone 4" },
  { value: "Milestone 5", label: "Milestone 5" },
  { value: "Milestone 6", label: "Milestone 6" },
  { value: "Milestone 7", label: "Milestone 7" },
  { value: "Milestone 8", label: "Milestone 8" },
  { value: "Milestone 9", label: "Milestone 9" },
  { value: "Milestone 10", label: "Milestone 10" },
  { value: "Milestone 11", label: "Milestone 11" },
  { value: "Milestone 12", label: "Milestone 12" },
];

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "month_till_date", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const SchoolDashboardTables = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(
    milestoneOptions[0]
  );
  const [schoolWiseMilestones, setSchoolWiseMilestones] = useState([]);

  const [activeStudentsData, setActiveStudentsData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[1]);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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

  const fetchSchoolMilestonesList = async (
    milestone_name = selectedMilestone.value
  ) => {
    try {
      const res = await authAxios().get(
        `/dashboard/school/milestone/list?milestone_name=${milestone_name}`
      );

      let data = res.data?.data || [];
      setSchoolWiseMilestones(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch milestone");
    }
  };

  useEffect(() => {
    fetchSchoolMilestonesList(selectedMilestone.value);
  }, [selectedMilestone]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      {/* Milestones Table Section */}
      <div className="bg-white rounded-lg custom--shodow lg:p-4 p-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="lg:text-lg text-[16px] font-semibold text-gray-900">
            School Wise Milestones Achieved
          </h2>
          <Link
            to={`/milestones-achieved`}
            className="underline text-[#008421] text-lg"
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
                {schoolWiseMilestones.length > 0 ? (
                  schoolWiseMilestones.slice(0, 4).map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.school_name}</td>
                      <td className="px-3 py-3">{item?.total_student_count}</td>
                      <td className="px-3 py-3">{item?.male_count}</td>
                      <td className="px-3 py-3">{item?.female_count}</td>
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
          <Link
            to="/active-students"
            className="underline text-[#008421] text-lg"
          >
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

        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
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
                {activeStudentsData.length > 0 ? (
                  activeStudentsData.slice(0, 4).map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.school_name}</td>
                      <td className="px-3 py-3">
                        {item?.enrolled_student_count}
                      </td>
                      <td className="px-3 py-3">
                        {item?.student_registered_count}
                      </td>
                      <td className="px-3 py-3">
                        {item?.total_active_student_count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-gray-500">
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
  );
};

// Exporting component as default export
export default SchoolDashboardTables;
