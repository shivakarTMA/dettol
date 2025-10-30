import React, { useState, useMemo } from "react"; // Import React hooks
import Highcharts from "highcharts"; // Import Highcharts
import HighchartsReact from "highcharts-react-official"; // Import React wrapper for Highcharts
import Select from "react-select"; // Import react-select for dropdowns
import DatePicker from "react-datepicker"; // Import datepicker for custom date selection
import "react-datepicker/dist/react-datepicker.css"; // Import default datepicker styles
import { customStyles } from "../../Helper/helper";
import { Link } from "react-router-dom";
import viewIcon from "../../Assests/Images/icons/view.svg";
import MilestonePopup from "../../Components/MilestonePopup";
import { LuCalendar } from "react-icons/lu";
import SchoolDashboardTables from "../../Components/SchoolDashboardTables";

const milestoneDetailsSample = {
  studentName: "Name of Student",
  phone: "+91 9876543210",
  address: "110, Gandhi nagar, Gorakhpur, Uttar Pradesh, 123456",
  milestoneTitle: "Milestone 3",
  verificationPending: true,
  tasks: [
    {
      id: 1,
      text: "Wash hands with soap for at least 20 seconds",
      completed: true,
      action: null,
    },
    {
      id: 2,
      text: "Use tissues for blowing nose and dispose properly",
      completed: true,
      action: null,
    },
    {
      id: 3,
      text: "Avoid sharing spoon/plate while eating food with classmates",
      completed: true,
      action: null,
    },
    {
      id: 4,
      text: "Use personal water bottle instead of drinking fountains",
      completed: false,
      action: null,
    },
    {
      id: 5,
      text: "Wipe down shared computer keyboards before use",
      completed: false,
      action: null,
    },
  ],
};

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState({
    value: "last7days",
    label: "Last 7 days",
  });

  const [verificationFilter, setVerificationFilter] = useState({
    value: "last7days",
    label: "Last 7 days",
  });

  // Custom dates for both filters
  const [pipelineCustomFrom, setPipelineCustomFrom] = useState(null);
  const [pipelineCustomTo, setPipelineCustomTo] = useState(null);
  const [verificationCustomFrom, setVerificationCustomFrom] = useState(null);
  const [verificationCustomTo, setVerificationCustomTo] = useState(null);

  // Dropdown filter options
  const filterOptions = [
    { value: "today", label: "Today" },
    { value: "last7days", label: "Last 7 days" },
    { value: "monthToDate", label: "Month till date" },
    { value: "custom", label: "Custom Date" },
  ];

  // Function to generate pipeline data based on selected filter
  const generatePipelineData = (filter, from, to) => {
    const base = { shipped: 12, delivered: 24, delayed: 5, inRoute: 10 };
    if (filter === "today")
      return { shipped: 3, delivered: 8, delayed: 1, inRoute: 2 };
    if (filter === "monthToDate")
      return { shipped: 45, delivered: 89, delayed: 15, inRoute: 32 };
    if (filter === "custom" && from && to) {
      const days = Math.max(1, Math.floor((to - from) / (1000 * 60 * 60 * 24)));
      return {
        shipped: days * 2,
        delivered: days * 3,
        delayed: days,
        inRoute: days * 1.5,
      };
    }
    return base;
  };

  // Function to generate verification data and dynamic date labels based on filter
  const generateVerificationData = (filter, from, to) => {
    let categories = [];
    let data = [];

    // Helper to format date as 'dd MMM'
    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
    };

    if (filter === "today") {
      const today = new Date();
      categories = [formatDate(today)];
      data = [Math.floor(Math.random() * 80) + 10];
    } else if (filter === "last7days") {
      const today = new Date();
      categories = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return formatDate(d);
      });
      data = Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 80) + 20
      );
    } else if (filter === "monthToDate") {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      categories = Array.from({ length: diffDays }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return formatDate(d);
      });
      data = Array.from(
        { length: diffDays },
        () => Math.floor(Math.random() * 90) + 10
      );
    } else if (filter === "custom" && from && to) {
      const diffDays =
        Math.max(1, Math.floor((to - from) / (1000 * 60 * 60 * 24))) + 1;
      categories = Array.from({ length: diffDays }, (_, i) => {
        const d = new Date(from);
        d.setDate(from.getDate() + i);
        return formatDate(d);
      });
      data = Array.from(
        { length: diffDays },
        () => Math.floor(Math.random() * 90) + 10
      );
    } else {
      // Default case (last 7 days)
      const today = new Date();
      categories = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return formatDate(d);
      });
      data = [20, 28, 68, 48, 62, 28, 45];
    }

    return { categories, data };
  };

  // Memoized pipeline and verification data
  const pipelineData = useMemo(
    () =>
      generatePipelineData(
        pipelineFilter.value,
        pipelineCustomFrom,
        pipelineCustomTo
      ),
    [pipelineFilter, pipelineCustomFrom, pipelineCustomTo]
  );

  const { categories, data: verificationData } = useMemo(
    () =>
      generateVerificationData(
        verificationFilter.value,
        verificationCustomFrom,
        verificationCustomTo
      ),
    [verificationFilter, verificationCustomFrom, verificationCustomTo]
  );

  // Pie Chart Configuration
  const pieChartOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: "60%",
      spacing: [10, 10, 10, 10],
      style: { maxWidth: "100%", margin: "auto" },
    },
    title: { text: "" },
    credits: { enabled: false },
    tooltip: { pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)" },
    plotOptions: {
      pie: {
        innerSize: "40%",
        size: "80%",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
          style: { fontSize: "14px", color: "#333" },
        },
        showInLegend: false,
      },
    },
    series: [
      {
        name: "Status",
        data: [
          { name: "Shipped", y: pipelineData.shipped, color: "#0A6BA8" },
          { name: "In route", y: pipelineData.inRoute, color: "#A8D8F0" },
          { name: "Delayed", y: pipelineData.delayed, color: "#0098D9" },
          { name: "Delivered", y: pipelineData.delivered, color: "#7DD3F5" },
        ],
      },
    ],
  };

  // Line Chart Configuration with dynamic categories
  const lineChartOptions = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height:"60%",
      spacing: [20, 20, 20, 20],
      style: { maxWidth: "100%" },
    },
    title: { text: "" },
    credits: { enabled: false },
    xAxis: {
      categories: categories, // Dynamic date categories
      lineColor: "#E5E7EB",
      tickColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: "11px" } },
    },
    yAxis: {
      title: { text: "" },
      gridLineColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: "11px" } },
      min: 0,
    },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "#1F2937",
      borderColor: "#1F2937",
      style: { color: "#FFFFFF" },
      formatter: function () {
        return (
          "<b>" + this.x + "</b><br/>" + "Verifications: <b>" + this.y + "</b>"
        );
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
          fillColor: "#0A6BA8",
          lineWidth: 2,
          lineColor: "#FFFFFF",
        },
        lineWidth: 2,
      },
    },
    series: [
      { name: "Verifications", data: verificationData, color: "#0A6BA8" },
    ],
  };

  const coordinatorPerformance = [
    {
      name: "Kshitiz Bali",
      inPreparation: 9,
      inTransit: 13,
      delivered: 42,
      delayed: 5,
    },
    {
      name: "Shivakar Sharma",
      inPreparation: 18,
      inTransit: 24,
      delivered: 25,
      delayed: 6,
    },
    {
      name: "Puneet Yadav",
      inPreparation: 14,
      inTransit: 12,
      delivered: 34,
      delayed: 4,
    },
    {
      name: "Ajeet Singh",
      inPreparation: 35,
      inTransit: 12,
      delivered: 23,
      delayed: 2,
    },
  ];

  const milestonesSummary = [
    {
      name: "Student 1",
      school: "LN PUBLIC SCHOOL",
      reward: "Milestone 1",
      status: "shipped",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 2",
      school: "MINILAND CONVENT SCHOOL",
      reward: "Milestone 3 + 1 dettol soap",
      status: "in route",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 3",
      school: "DEWAN PUBLIC SCHOOL",
      reward: "Milestone 2",
      status: "delivered",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 4",
      school: "LITTLE FLOWER PUBLIC SCHOOL",
      reward: "Milestone 2 + 3 dettol soap",
      status: "shipped",
      details: milestoneDetailsSample,
    },
  ];

  const schoolwiseFeedBack = [
    {
      name: "LN PUBLIC SCHOOL",
      totalStudent: 146,
      feedback_submitted: 162,
      average_rating: 4.2,
    },
    {
      name: "MINILAND CONVENT SCHOOL",
      totalStudent: 163,
      feedback_submitted: 152,
      average_rating: 4.6,
    },
    {
      name: "DEWAN PUBLIC SCHOOL",
      totalStudent: 251,
      feedback_submitted: 186,
      average_rating: 4.0,
    },
    {
      name: "LITTLE FLOWER PUBLIC SCHOOL",
      totalStudent: 143,
      feedback_submitted: 128,
      average_rating: 3.9,
    },
  ];

  const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-[10px] border border-[#D4D4D4] overflow-hidden">
      <div className="text-sm text-black mb-2 font-[500] border-b border-b-[#D4D4D4] bg-[#F1F1F1] px-3 py-2">
        {title}
      </div>
      <div className="lg:text-3xl text-xl font-[800] text-[var(--primarycolor)] px-3 lg:py-2 pb-2">
        {value}
      </div>
    </div>
  );

  return (
    <>
      <div>
        <div className="custom--shodow bg-white lg:p-4 p-2 rounded-[10px] mb-3">
          <h2 className="lg:text-xl text-lg font-bold text-black lg:mb-3 mb-2">
            Quick Reports
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 ">
            <StatCard title="Schools Assigned" value="09" />
            <StatCard title="Students Enrolled" value="1250" />
            <StatCard title="Students Registered" value="850" />
            <StatCard title="Active Students" value="213" />
            <StatCard title="Verification Pending" value="234" />
            <StatCard title="Rewards Delivered" value="125" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Rewards Pipeline Card */}
          <div className="bg-white rounded-lg custom--shodow lg:p-4 p-2">
            <div className="flex justify-between lg:items-center mb-0 flex-wrap gap-4">
              <h2 className="lg:text-lg text-[16px] font-semibold text-gray-900">
                Rewards Pipeline
              </h2>
              <div className="lg:w-44">
                <Select
                  value={pipelineFilter}
                  onChange={setPipelineFilter}
                  options={filterOptions}
                  styles={customStyles}
                />
              </div>
            </div>

            {pipelineFilter.value === "custom" && (
              <div className="my-2 mb-0 lg:p-4 p-2 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
                <div>
                  <div className="custom--date relative">
                    <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                      <LuCalendar />
                    </span>
                    <DatePicker
                      selected={pipelineCustomFrom}
                      onChange={setPipelineCustomFrom}
                      dateFormat="yyyy-MM-dd"
                      className="input--icon"
                      placeholderText="From Date"
                    />
                  </div>
                </div>
                <div>
                  <div className="custom--date relative">
                    <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                      <LuCalendar />
                    </span>
                    <DatePicker
                      selected={pipelineCustomTo}
                      onChange={setPipelineCustomTo}
                      dateFormat="yyyy-MM-dd"
                      className="input--icon"
                      placeholderText="To Date"
                    />
                  </div>
                </div>
              </div>
            )}

            <HighchartsReact
              highcharts={Highcharts}
              options={pieChartOptions}
            />
          </div>

          {/* Verifications Done Card */}
          <div className="bg-white rounded-lg custom--shodow lg:p-4 p-2">
            <div className="flex justify-between items-center mb-0 flex-wrap gap-4">
              <h2 className="lg:text-lg text-[16px] font-semibold text-gray-900">
                Verifications Done
              </h2>
              <div className="lg:w-44">
                <Select
                  value={verificationFilter}
                  onChange={setVerificationFilter}
                  options={filterOptions}
                  styles={customStyles}
                />
              </div>
            </div>

            {verificationFilter.value === "custom" && (
              <div className="my-2 mb-0 lg:p-4 p-2 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
                <div>
                  <div className="custom--date relative">
                    <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                      <LuCalendar />
                    </span>
                    <DatePicker
                      selected={verificationCustomFrom}
                      onChange={setVerificationCustomFrom}
                      dateFormat="yyyy-MM-dd"
                      className="input--icon"
                      placeholderText="From Date"
                    />
                  </div>
                </div>
                <div>
                  <div className="custom--date relative">
                    <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                      <LuCalendar />
                    </span>
                    <DatePicker
                      selected={verificationCustomTo}
                      onChange={setVerificationCustomTo}
                      dateFormat="yyyy-MM-dd"
                      className="input--icon"
                      placeholderText="To Date"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <HighchartsReact
                highcharts={Highcharts}
                options={lineChartOptions}
              />
            </div>
          </div>
        </div>

        <SchoolDashboardTables />

        <div className="mt-3">
          <div className="bg-white custom--shodow rounded-[10px] lg:p-4 p-2">
            <div className="flex justify-between items-center mb-3 flex-wrap">
              <h3 className="lg:text-lg text-[16px] font-semibold text-gray-900">
                Co-ordinator Performance
              </h3>
              <Link to="#" className="underline text-[#009EB2] text-lg">
                <small>View All</small>
              </Link>
            </div>
            <div className="rounded-[10px] overflow-hidden">
              <div className="relative overflow-x-auto ">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[150px]">Name</th>
                      <th className="px-3 py-3 min-w-[120px]">
                        In Preparation
                      </th>
                      <th className="px-3 py-3 min-w-[120px]">In Transit</th>
                      <th className="px-3 py-3 min-w-[120px]">Delivered</th>
                      <th className="px-3 py-3 min-w-[120px]">Delayed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinatorPerformance.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3">{item.inPreparation}</td>
                        <td className="px-3 py-3">{item.inTransit}</td>
                        <td className="px-3 py-3">{item.delivered}</td>
                        <td className="px-3 py-3">{item.delayed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="bg-white custom--shodow rounded-[10px] lg:p-4 p-2">
            <div className="flex justify-between items-center mb-3 flex-wrap">
              <h3 className="lg:text-lg text-[16px] font-semibold text-gray-900">
                Schoolwise Feedback
              </h3>
              <Link to="#" className="underline text-[#009EB2] text-lg">
                <small>View All</small>
              </Link>
            </div>
            <div className="rounded-[10px] overflow-hidden">
              <div className="relative overflow-x-auto ">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[170px]">School Name</th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Total Students
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Feedback Submitted
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Average Rating Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolwiseFeedBack.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3 text-center">
                          {item.totalStudent}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.feedback_submitted}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.average_rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
