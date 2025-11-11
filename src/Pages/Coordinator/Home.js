import React, { useState, useMemo, useEffect } from "react"; // Import React hooks
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
import SubmitRatingPopup from "../../Components/SubmitRatingPopup";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import RatingBar from "../../Components/Common/RatingBar";

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
      completed: null,
    },
    {
      id: 2,
      text: "Use tissues for blowing nose and dispose properly",
      completed: null,
    },
    {
      id: 3,
      text: "Avoid sharing spoon/plate while eating food with classmates",
      completed: null,
    },
    {
      id: 4,
      text: "Use personal water bottle instead of drinking fountains",
      completed: null,
    },
    {
      id: 5,
      text: "Wipe down shared computer keyboards before use",
      completed: null,
    },
  ],
};

const CoordinatorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [quickLinks, setQuickLinks] = useState([]);
  const [studentFeedback, setStudentFeedback] = useState({});
  const [staffFeedback, setStaffFeedback] = useState({});
  const [pipelineFilter, setPipelineFilter] = useState({
    value: "last_7_days",
    label: "Last 7 days",
  });

  const [verificationFilter, setVerificationFilter] = useState({
    value: "last7days",
    label: "Last 7 days",
  });

  // Custom dates for both filters
  const [pipelineCustomFrom, setPipelineCustomFrom] = useState(null);
  const [pipelineCustomTo, setPipelineCustomTo] = useState(null);
  const [pipelineData, setPipelineData] = useState({
    SHIPPED: 0,
    DELIVERED: 0,
    DELAYED: 0,
    IN_ROUTE: 0,
    REJECT: 0,
  });
  const [verificationCustomFrom, setVerificationCustomFrom] = useState(null);
  const [verificationCustomTo, setVerificationCustomTo] = useState(null);

  // Dropdown filter options
  const filterOptions = [
    { value: "today", label: "Today" },
    { value: "last_7_days", label: "Last 7 days" },
    { value: "month_till_date", label: "Month till date" },
    { value: "custom", label: "Custom Date" },
  ];

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

  // ✅ Fetch pipeline data from API
  const fetchPipelineData = async () => {
    try {
      let url = "/dashboard/reward/pipeline";

      // Add query params based on selected filter
      if (pipelineFilter.value === "today") {
        url += "?dateFilter=today";
      } else if (pipelineFilter.value === "last_7_days") {
        url += "?dateFilter=last_7_days";
      } else if (pipelineFilter.value === "month_till_date") {
        url += "?dateFilter=month_till_date";
      } else if (
        pipelineFilter.value === "custom" &&
        pipelineCustomFrom &&
        pipelineCustomTo
      ) {
        const startDate = pipelineCustomFrom.toISOString().split("T")[0];

        // Backend expects endDate to be exclusive — add one day
        const endDateObj = new Date(pipelineCustomTo);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const endDate = endDateObj.toISOString().split("T")[0];

        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else {
        return; // Don’t fetch if custom dates not chosen
      }

      const res = await authAxios().get(url);
      const data = res.data?.data || {};

      setPipelineData({
        SHIPPED: data.SHIPPED || 0,
        DELIVERED: data.DELIVERED || 0,
        DELAYED: data.DELAYED || 0,
        IN_ROUTE: data.IN_ROUTE || 0,
        REJECT: data.REJECT || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pipeline data");
    }
  };

  // 🔁 Fetch when filter or custom dates change
  useEffect(() => {
    fetchPipelineData();
  }, [pipelineFilter, pipelineCustomFrom, pipelineCustomTo]);

  // Pie Chart Configuration
  const pieChartOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        height: "60%",
        spacing: [20, 20, 20, 20],
        style: { maxWidth: "100%", margin: "auto" },
      },
      title: { text: "" },
      credits: { enabled: false },
      tooltip: { pointFormat: "<b>{point.y}</b>" },
      // tooltip: { pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)" },
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
            { name: "Shipped", y: pipelineData.SHIPPED, color: "#FFC107" },
            { name: "In route", y: pipelineData.IN_ROUTE, color: "#FFA500" },
            { name: "Delivered", y: pipelineData.DELIVERED, color: "#008421" },
            { name: "Delayed", y: pipelineData.DELAYED, color: "#087FFE" },
            { name: "Reject", y: pipelineData.REJECT, color: "#DC3545" },
          ],
        },
      ],
    }),
    [pipelineData]
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
      tickColor: "#E5E5E5",
      labels: { style: { color: "#000000", fontSize: "11px" } },
    },
    yAxis: {
      title: { text: "" },
      gridLineColor: "#E5E5E5",
      labels: { style: { color: "#000000", fontSize: "11px" } },
      min: 0,
    },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "#008421",
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
          fillColor: "#008421",
          lineWidth: 2,
          lineColor: "#FFFFFF",
        },
        lineWidth: 1,
      },
    },
    series: [
      { name: "Verifications", data: verificationData, color: "#000000" },
    ],
  };

  const milestonesSummary = [
    {
      name: "Student 1",
      school: "LN PUBLIC SCHOOL",
      reward: "Milestone 1",
      status: "SHIPPED",
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
      status: "SHIPPED",
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

  const fetchQuickLinks = async () => {
    try {
      const res = await authAxios().get("/dashboard/quick/report");

      let data = res.data?.data || [];
      setQuickLinks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch quick links");
    }
  };

  const fetchStudentFeedback = async () => {
    try {
      const res = await authAxios().get("/dashboard/student/feedback");

      const data = res.data?.data || {}; // default to object
      setStudentFeedback(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch student feedback");
    }
  };
  const fetchStaffFeedback = async () => {
    try {
      const res = await authAxios().get("/dashboard/employee/feedback");

      const data = res.data?.data || {}; // default to object
      setStaffFeedback(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff feedback");
    }
  };

  useEffect(() => {
    fetchQuickLinks();
    fetchStudentFeedback();
    fetchStaffFeedback();
  }, []);

  const handleViewClick = (milestone) => {
    setSelectedMilestone(milestone.details);
    setIsModalOpen(true);
  };

  const handlePopupSubmit = (tasks) => {
    console.log("📦 Received in parent:", tasks);
    const allCompleted = tasks.every((task) => task.completed === true);
    console.log(allCompleted, "allCompleted");
    if (allCompleted) {
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <>
      <div>
        <div className="custom--shodow bg-white lg:p-4 p-2 rounded-[10px] mb-3">
          <h2 className="lg:text-lg text-[16px] font-bold text-black lg:mb-3 mb-2">
            Quick Reports
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 ">
            <StatCard
              title="Schools Assigned"
              value={quickLinks?.schools_assigned_count}
            />
            <StatCard
              title="Students Registered"
              value={quickLinks?.student_registered_count}
            />
            <StatCard
              title="Students Enrolled"
              value={quickLinks?.student_enrolled_count}
            />
            <StatCard
              title="Verification Pending"
              value={quickLinks?.verification_pending_count}
            />
          </div>
        </div>

        <div className="custom--shodow bg-white lg:p-4 p-2 rounded-[10px] mb-3">
          <h2 className="lg:text-xl text-lg font-bold text-black lg:mb-3 mb-2">
            Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
            <RatingBar
              title="Student Feedback"
              rating={Number(studentFeedback?.student_rating_average) || 0}
            />
            <RatingBar
              title="Employee Feedback"
              rating={Number(staffFeedback?.employee_rating_average) || 0}
            />
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
                      onChange={(date) => {
                        setPipelineCustomFrom(date);
                        // If end date is before new start date, clear or adjust it
                        if (
                          pipelineCustomTo &&
                          date &&
                          pipelineCustomTo < date
                        ) {
                          setPipelineCustomTo(null);
                        }
                      }}
                      dateFormat="dd-MM-yyyy"
                      className="input--icon"
                      placeholderText="From Date"
                      maxDate={new Date()}
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
                      dateFormat="dd-MM-yyyy"
                      className="input--icon"
                      placeholderText="To Date"
                      minDate={pipelineCustomFrom || null} // cannot select before start
                      maxDate={new Date()} // cannot select future
                      disabled={!pipelineCustomFrom} // disable until start date chosen
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
                Milestones Completion
              </h3>
              <Link
                to="/milestones-completion"
                className="underline text-[#008421] text-lg"
              >
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
                          item.status === "SHIPPED"
                            ? "bg-[#F9F2EB] text-[#C78100]"
                            : ""
                        } ${item.status === "DELIVERED" ? "bg-green-200" : ""}
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
                          className="bg-[#008421] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center cursor-pointer p-[6px]"
                          onClick={() => handleViewClick(item)}
                        >
                          <img
                            src={viewIcon}
                            alt="view"
                            className="w-full brightness-[0] invert-[1]"
                          />
                        </div>
                        <div
                          className={`bg-[#008421] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center p-[8px]
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
                              item.status === "SHIPPED"
                                ? "bg-[#F9F2EB] text-[#C78100]"
                                : ""
                            } ${
                              item.status === "DELIVERED" ? "bg-green-200" : ""
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

      {isModalOpen && (
        <MilestonePopup
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          milestone={selectedMilestone}
          onSubmit={handlePopupSubmit} // ✅ MUST be here
        />
      )}
      {/* ✅ Success / Rating Popup */}
      {isSuccessModalOpen && (
        <SubmitRatingPopup
          isOpen={isSuccessModalOpen} // ✅ Add this line
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}
    </>
  );
};

export default CoordinatorDashboard;
