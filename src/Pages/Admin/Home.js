import React, { useState, useMemo, useEffect } from "react"; // Import React hooks
import Highcharts from "highcharts"; // Import Highcharts
import HighchartsReact from "highcharts-react-official"; // Import React wrapper for Highcharts
import Select from "react-select"; // Import react-select for dropdowns
import DatePicker from "react-datepicker"; // Import datepicker for custom date selection
import "react-datepicker/dist/react-datepicker.css"; // Import default datepicker styles
import { customStyles } from "../../Helper/helper";
import { Link } from "react-router-dom";
import { LuCalendar } from "react-icons/lu";
import SchoolDashboardTables from "../../Components/SchoolDashboardTables";
import RatingBar from "../../Components/Common/RatingBar";
import { toast } from "react-toastify";
import { authAxios } from "../../Config/config";
import CordinatorPerformanceDashboard from "./CordinatorPerformanceDashboard";

const filterOptions = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "month_till_date", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const AdminDashboard = () => {
  const [quickLinks, setQuickLinks] = useState([]);
  const [studentFeedback, setStudentFeedback] = useState({});
  const [staffFeedback, setStaffFeedback] = useState({});

  // Rewards Pipeline
  const [pipelineFilter, setPipelineFilter] = useState({
    value: "last_7_days",
    label: "Last 7 days",
  });
  const [pipelineCustomFrom, setPipelineCustomFrom] = useState(null);
  const [pipelineCustomTo, setPipelineCustomTo] = useState(null);
  const [pipelineData, setPipelineData] = useState({
    SHIPPED: 0,
    DELIVERED: 0,
    DELAYED: 0,
    IN_ROUTE: 0,
    REJECT: 0,
  });

  // Verifications Done
  const [dateCategories, setDateCategories] = useState([]);
  const [verificationFilter, setVerificationFilter] = useState({
    value: "last_7_days", // Default filter value
    label: "Last 7 days",
  });
  const [verificationData, setVerificationData] = useState({
    date: "",
    delivered_count: 0,
  });
  const [verificationCustomFrom, setVerificationCustomFrom] = useState(null);
  const [verificationCustomTo, setVerificationCustomTo] = useState(null);

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
      DELIVERED: 42,
      DELAYED: 5,
      date: "2025-10-31",
    },
    {
      name: "Shivakar Sharma",
      inPreparation: 18,
      inTransit: 24,
      DELIVERED: 25,
      DELAYED: 6,
      date: "2025-10-30",
    },
    {
      name: "Puneet Yadav",
      inPreparation: 14,
      inTransit: 12,
      DELIVERED: 34,
      DELAYED: 4,
      date: "2025-10-29",
    },
    {
      name: "Ajeet Singh",
      inPreparation: 35,
      inTransit: 12,
      DELIVERED: 23,
      DELAYED: 2,
      date: "2025-10-28",
    },
  ];

  // ✅ Fetch pipeline data from API
  const fetchPipelineData = async () => {
    try {
      let url = "/dashboard/reward/pipeline";

      if (pipelineFilter.value !== "custom") {
        url += `?dateFilter=${pipelineFilter.value}`;
      } else if (pipelineCustomFrom && pipelineCustomTo) {
        const startDate = pipelineCustomFrom.toISOString().split("T")[0];
        const end = new Date(pipelineCustomTo);
        end.setDate(end.getDate() + 1);
        const endDate = end.toISOString().split("T")[0];

        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else {
        return; // no custom dates yet
      }

      const res = await authAxios().get(url);
      const data = res.data?.data || {};

      setPipelineData({
        SHIPPED: data.SHIPPED ?? 0,
        DELIVERED: data.DELIVERED ?? 0,
        DELAYED: data.DELAYED ?? 0,
        IN_ROUTE: data.IN_ROUTE ?? 0,
        REJECT: data.REJECT ?? 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pipeline data");
    }
  };

  useEffect(() => {
    fetchPipelineData();
  }, [pipelineFilter, pipelineCustomFrom, pipelineCustomTo]);

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

  // ✅ Fetch verification data from API
  const fetchVerificationData = async () => {
    try {
      let url = "/dashboard/verification/done";

      if (verificationFilter.value !== "custom") {
        url += `?dateFilter=${verificationFilter.value}`;
      } else if (verificationCustomFrom && verificationCustomTo) {
        const startDate = verificationCustomFrom.toISOString().split("T")[0];

        const end = new Date(verificationCustomTo);
        end.setDate(end.getDate() + 1);
        const endDate = end.toISOString().split("T")[0];

        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else {
        return;
      }

      const res = await authAxios().get(url);
      const data = res.data?.data || [];

      if (!data.length) {
        // ✨ Fallback → keep chart working
        setDateCategories(["No Data"]);
        setVerificationData([0]);
        return;
      }

      const categories = data.map((item) => item.date);
      const counts = data.map((item) => item.delivered_count);

      setDateCategories(categories);
      setVerificationData(counts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch verification data");
    }
  };

  useEffect(() => {
    fetchVerificationData();
  }, [verificationFilter, verificationCustomFrom, verificationCustomTo]);

  const lineChartOptions = useMemo(() => ({
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
      categories: dateCategories,
      lineColor: "#E5E7EB",
      tickColor: "#E5E5E5",
      labels: {
        style: { color: "#000000", fontSize: "11px" },
        formatter: function () {
          const date = new Date(this.value);

          // If invalid date -> show fallback text
          if (isNaN(date.getTime())) {
            return "No data found";
          }

          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        },
      },
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
        return "<b>" + "Verifications: <b>" + this.y + "</b>";
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
  }));

  // Handle period dropdown selection change
  const handlePeriodChange = (selected) => {
    setSelectedPeriod(selected);
    setShowCustomDate(selected.value === "custom");
  };

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

  return (
    <>
      <div>
        <div className="custom--shodow bg-white lg:p-4 p-2 rounded-[10px] mb-3">
          <h2 className="lg:text-xl text-lg font-bold text-black lg:mb-3 mb-2">
            Quick Reports
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 ">
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
                  onChange={(selectedOption) => {
                    setVerificationFilter(selectedOption);
                  }}
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
                      onChange={(date) => {
                        setVerificationCustomFrom(date);
                        if (
                          verificationCustomTo &&
                          date &&
                          verificationCustomTo < date
                        ) {
                          setVerificationCustomTo(null);
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
                      selected={verificationCustomTo}
                      onChange={setVerificationCustomTo}
                      dateFormat="yyyy-MM-dd"
                      className="input--icon"
                      placeholderText="To Date"
                      minDate={verificationCustomFrom || null}
                      maxDate={new Date()}
                      disabled={!verificationCustomFrom}
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
              <Link
                to="/cordinator-performance"
                className="underline text-[#008421] text-lg"
              >
                <small>View All</small>
              </Link>
            </div>
{/* 
            <div className="flex gap-2 md:flex-row flex-col items-start mb-4">
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={filterOptions}
                styles={customStyles}
                className="lg:min-w-[150px] min-w-[100px]"
              />

              {showCustomDate && (
                <div className="flex items-center gap-2 lg:w-[60%] w-full">
                  <div className="custom--date relative">
                    <span className="absolute top-[50%] translate-y-[-50%] left-[15px] z-[1]">
                      <LuCalendar />
                    </span>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => {
                        setFromDate(date);
                        if (toDate && date && toDate < date) {
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
                      minDate={fromDate || null}
                      maxDate={new Date()}
                      disabled={!fromDate}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[10px] overflow-hidden">
              <div className="relative overflow-x-auto ">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[150px]">Name</th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Shipped
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        In Route
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Delivered
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Rejected
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {codinatorPerformanceData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3 text-center">
                          {item.inPreparation}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.inTransit}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.DELIVERED}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.DELAYED}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}

            <CordinatorPerformanceDashboard />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
