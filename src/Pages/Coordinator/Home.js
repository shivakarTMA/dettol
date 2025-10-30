import React, { useState, useMemo } from "react"; // Import React hooks
import Highcharts from "highcharts"; // Import Highcharts
import HighchartsReact from "highcharts-react-official"; // Import React wrapper for Highcharts
import Select from "react-select"; // Import react-select for dropdowns
import DatePicker from "react-datepicker"; // Import datepicker for custom date selection
import "react-datepicker/dist/react-datepicker.css"; // Import default datepicker styles
import { customStyles } from "../../Helper/helper";
import { Link } from "react-router-dom";
import viewIcon from "../../Assests/Images/icons/view.svg";
import shippingIcon from "../../Assests/Images/icons/shipping.svg";
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

const CoordinatorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
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
      height: "60%",
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

  const milestonesSummary = [
    {
      name: "Student 1",
      school: "LN PUBLIC SCHOOL",
      reward: "Milestone 1",
      status: "shipped",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 2",
      school: "MINILAND CONVENT SCHOOL",
      reward: "Milestone 3 + 1 dettol soap",
      status: "in route",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 3",
      school: "DEWAN PUBLIC SCHOOL",
      reward: "Milestone 2",
      status: "in route",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 4",
      school: "LITTLE FLOWER PUBLIC SCHOOL",
      reward: "Milestone 2 + 3 dettol soap",
      status: "shipped",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
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

  const handleViewClick = (milestone) => {
    setSelectedMilestone(milestone.details);
    setIsModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="custom--shodow bg-white lg:p-4 p-2 rounded-[10px] mb-3">
          <h2 className="lg:text-lg text-[16px] font-bold text-black lg:mb-3 mb-2">
            Quick Reports
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 ">
            <StatCard title="Schools Assigned" value="09" />
            <StatCard title="Students Enrolled" value="1250" />
            <StatCard title="Total Students" value="213" />
            <StatCard title="Verification Pending" value="234" />
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

        <div className="mt-5">
          <div className="bg-white custom--shodow rounded-[10px] lg:p-4 p-2">
            <div className="flex justify-between items-center mb-3 flex-wrap">
              <h3 className="lg:text-lg text-[16px] font-semibold text-gray-900">
                Milestones Achieved Summary
              </h3>
              <Link to="#" className="underline text-[#009EB2] text-lg">
                <small>View All</small>
              </Link>
            </div>

            <div className="sm:hidden block space-y-2">
              {milestonesSummary.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#D4D4D4] p-[10px] rounded-[10px]"
                >
                  <div className="flex gap-2 items-start justify-between">
                    <div>
                      <span
                        className={` text-sm block w-fit px-3 py-1 rounded-full capitalize ${
                          item.status === "shipped"
                            ? "bg-[#F9F2EB] text-[#C78100]"
                            : ""
                        } ${item.status === "delivered" ? "bg-green-200" : ""}
                            ${
                              item.status === "in route"
                                ? "bg-[#EBF9F1] text-[#1F9254]"
                                : ""
                            }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-nowrap gap-1 w-full items-center">
                        <div
                          className="bg-[#4D57EE] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center cursor-pointer p-[6px]"
                          onClick={() => handleViewClick(item)}
                        >
                          <img
                            src={viewIcon}
                            alt="view"
                            className="w-full brightness-[0] invert-[1]"
                          />
                        </div>
                        <div
                          className={`bg-[#4D57EE] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center p-[8px]
    ${
      item.status === "in route"
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }`}
                        >
                          <img
                            src={shippingIcon}
                            alt="view"
                            className="w-full brightness-[0] invert-[1]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h2 className="text-black font-semibold text-lg">
                      {item.name}
                    </h2>
                    <h3 className="text-black text-sm">{item.school}</h3>

                    <p className="text-[#6F6F6F] text-sm">{item.address}</p>

                    <div className="bg-[#EAEAEA] rounded-[5px] p-[8px] mt-2">
                      <p className="text-black text-sm">
                        <span className="font-[500]">Reward</span> :{" "}
                        {item.reward}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[10px] overflow-hidden sm:block hidden">
              <div className="relative overflow-x-auto ">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[120px]">Name</th>
                      <th className="px-3 py-3 min-w-[170px]">School Name</th>
                      <th className="px-3 py-3 min-w-[170px]">Address</th>
                      <th className="px-3 py-3 min-w-[120px]">Reward Status</th>
                      <th className="px-3 py-3 min-w-[120px]">Status</th>
                      <th className="px-3 py-3 min-w-[120px]">View Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestonesSummary.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3">{item.school}</td>
                        <td className="px-3 py-3">{item.address}</td>
                        <td className="px-3 py-3">{item.reward}</td>
                        <td className="px-3 py-3">
                          <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item.status === "shipped"
                                ? "bg-[#F9F2EB] text-[#C78100]"
                                : ""
                            } ${
                              item.status === "delivered" ? "bg-green-200" : ""
                            }
                            ${
                              item.status === "in route"
                                ? "bg-[#EBF9F1] text-[#1F9254]"
                                : ""
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-nowrap w-full items-center">
                            <div
                              className="bg-[#F1F1F1] border border-[#D4D4D4] rounded-l-[5px] w-9 h-8 flex items-center justify-center cursor-pointer p-[6px]"
                              onClick={() => handleViewClick(item)}
                            >
                              <img
                                src={viewIcon}
                                alt="view"
                                className="w-full"
                              />
                            </div>
                            <div
                              className={`bg-[#F1F1F1] border border-[#D4D4D4] rounded-r-[5px] w-9 h-8 flex items-center justify-center p-[8px]
                                ${
                                item.status === "in route"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                            >
                              <img
                                src={shippingIcon}
                                alt="view"
                                className="w-full"
                              />
                            </div>
                          </div>
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

      {selectedMilestone && (
        <MilestonePopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
        />
      )}
    </>
  );
};

export default CoordinatorDashboard;
