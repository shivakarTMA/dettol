import React, { useState, useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customStyles, formatStatus } from "../../Helper/helper";
import { Link } from "react-router-dom";
import MilestonePopup from "../../Components/MilestonePopup";
import { LuCalendar } from "react-icons/lu";
import SchoolDashboardTables from "../../Components/SchoolDashboardTables";
import SubmitRatingPopup from "../../Components/SubmitRatingPopup";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";

const filterOptions = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "month_till_date", label: "Month till date" },
  { value: "custom", label: "Custom Date" },
];

const CoordinatorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [quickLinks, setQuickLinks] = useState([]);
  const [milestoneList, setMilestonesList] = useState([]);

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

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  // Milestones functions
  const fetchMilestonesList = async () => {
    try {
      const res = await authAxios().get("/myreward/list");

      let data = res.data?.data || [];
      setMilestonesList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch myreward");
    }
  };

  useEffect(() => {
    fetchMilestonesList();
  }, []);

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
                <small>Take Action</small>
              </Link>
            </div>
            {/* Mobile */}
            <div className="sm:hidden block space-y-2">
              {milestoneList.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="border border-[#D4D4D4] p-[10px] rounded-[10px]"
                >
                  <div className="flex gap-2 items-start justify-between">
                    <div>
                      <span
                        className={` text-sm block w-fit px-3 py-1 rounded-full capitalize 
                        ${
                          item?.status === "SHIPPED"
                            ? "bg-[#FFFBEE] text-[#FFC107]"
                            : ""
                        } ${
                          item?.status === "IN_ROUTE"
                            ? "bg-[#FFFAF2] text-[#FFA500]"
                            : ""
                        }
                        ${
                          item?.status === "DELAYED"
                            ? "bg-[#E6F3FF] text-[#087FFE]"
                            : ""
                        }
                        ${
                          item?.status === "DELIVERED"
                            ? "bg-[#F2FFF5] text-[#008421]"
                            : ""
                        }
                        ${
                          item?.status === "REJECT"
                            ? "bg-[#FFECEE] text-[#DC3545]"
                            : ""
                        }
                        `}
                      >
                        {formatStatus(item?.status)}
                      </span>
                    </div>
                    {/* <div>
                      <div className="flex flex-nowrap gap-1 w-full items-center">
                        {item?.status === "REJECT" ? (
                          <span
                            className={`block text-sm w-fit px-3 py-1 rounded-full capitalize bg-[#FFECEE] text-[#DC3545] 
                          
                        `}
                          >
                            Rejected
                          </span>
                        ) : (
                          <>
                            {item?.status === "DELIVERED" ? null : (
                              <>
                                <div
                                  className={`bg-[#008421] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center p-[6px] ${
                                    ["REJECT"].includes(item?.status)
                                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                                      : "cursor-pointer"
                                  }`}
                                  onClick={() => {
                                    setEditingOption(item?.id);
                                    setIsModalOpen(true);
                                  }}
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
                          [
                            "IN_ROUTE",
                            "DELIVERED",
                            "DELAYED",
                            "REJECT",
                          ].includes(item?.status)
                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                            : "cursor-pointer"
                        }
                        `}
                                  onClick={() =>
                                    handleShippingClick(item?.id, "IN_ROUTE")
                                  }
                                >
                                  <img
                                    src={shippingIcon}
                                    alt="view"
                                    className="w-full brightness-[0] invert-[1]"
                                  />
                                </div>
                                <div
                                  className={`bg-[#008421] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center p-[8px] cursor-pointer
                        `}
                                  onClick={() => {
                                    setSelectedItemId(item?.id);
                                    setShowConfirmReject(true);
                                  }}
                                >
                                  <img
                                    src={closeIcon}
                                    alt="view"
                                    className="w-full brightness-[0] invert-[1]"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-2">
                    <h2 className="text-black font-semibold text-lg">
                      {item?.student_name}
                    </h2>
                    <h3 className="text-black text-sm">{item?.school_name}</h3>

                    <p className="text-[#6F6F6F] text-sm">
                      {item?.student_address}
                    </p>

                    <div className="bg-[#EAEAEA] rounded-[5px] p-[8px] mt-2">
                      <p className="text-black text-sm">
                        <span className="font-[500]">Reward</span> :{" "}
                        {item?.milestone_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="rounded-[10px] overflow-hidden sm:block hidden">
              <div className="relative overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#F1F1F1]">
                    <tr>
                      <th className="px-3 py-3 min-w-[120px]">Name</th>
                      <th className="px-3 py-3 min-w-[170px]">School Name</th>
                      <th className="px-3 py-3 min-w-[170px]">Address</th>
                      <th className="px-3 py-3 min-w-[120px]">
                        Milestones Achieved
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Status
                      </th>
                      {/* <th className="px-3 py-3 min-w-[120px]">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {milestoneList.length > 0 ? (
                      milestoneList.slice(0, 4).map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-3 py-3">{item?.student_name}</td>
                          <td className="px-3 py-3">{item?.school_name}</td>
                          <td className="px-3 py-3">{item?.student_address}</td>
                          <td className="px-3 py-3">{item?.milestone_name}</td>
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`mx-auto block w-fit px-3 py-1 rounded-full capitalize 
                          ${
                            item?.status === "SHIPPED"
                              ? "bg-[#FFFBEE] text-[#FFC107]"
                              : ""
                          } ${
                                item?.status === "IN_ROUTE"
                                  ? "bg-[#FFFAF2] text-[#FFA500]"
                                  : ""
                              }
                        ${
                          item?.status === "DELAYED"
                            ? "bg-[#E6F3FF] text-[#087FFE]"
                            : ""
                        }
                        ${
                          item?.status === "DELIVERED"
                            ? "bg-[#F2FFF5] text-[#008421]"
                            : ""
                        }
                        ${
                          item?.status === "REJECT"
                            ? "bg-[#FFECEE] text-[#DC3545]"
                            : ""
                        }
                        `}
                            >
                              {formatStatus(item?.status)}
                            </span>
                          </td>
                          {/* <td className="px-3 py-3">
                            {item?.status === "REJECT" ? (
                              <span
                                className={`block w-fit px-3 py-1 rounded-full capitalize bg-[#FFECEE] text-[#DC3545] 
                          
                        `}
                              >
                                Rejected
                              </span>
                            ) : (
                              <>
                                {item?.status === "DELIVERED" ? ("--") : (
                                  <div className="flex flex-nowrap w-full items-center">
                                    <Tooltip
                                      id={`tooltip-edit-${item.id}`}
                                      content="View Milestones"
                                      place="left"
                                    >
                                      <div
                                        className={`bg-[#F1F1F1] border border-[#D4D4D4] rounded-l-[5px] w-9 h-8 flex items-center justify-center p-[6px] ${
                                          ["REJECT"].includes(item?.status)
                                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                                            : "cursor-pointer"
                                        }`}
                                        // onClick={() => handleViewClick(item)}
                                        onClick={() => {
                                          setEditingOption(item?.id);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        <img
                                          src={viewIcon}
                                          alt="view"
                                          className="w-full"
                                        />
                                      </div>
                                    </Tooltip>

                                    <Tooltip
                                      id={`tooltip-edit-${item.id}`}
                                      content="In Route"
                                      place="left"
                                    >
                                      <div
                                        className={`bg-[#F1F1F1] border border-[#D4D4D4] w-9 h-8 flex items-center justify-center p-[8px] ${
                                          [
                                            "IN_ROUTE",
                                            "DELIVERED",
                                            "DELAYED",
                                            "REJECT",
                                          ].includes(item?.status)
                                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                                            : "cursor-pointer"
                                        }`}
                                        onClick={() =>
                                          handleShippingClick(
                                            item?.id,
                                            "IN_ROUTE"
                                          )
                                        }
                                      >
                                        <img
                                          src={shippingIcon}
                                          alt="view"
                                          className="w-full"
                                        />
                                      </div>
                                    </Tooltip>
                                    <Tooltip
                                      id={`tooltip-edit-${item.id}`}
                                      content="Reject Milestone"
                                      place="left"
                                    >
                                      <div
                                        className={`bg-[#F1F1F1] border border-[#D4D4D4] rounded-r-[5px] w-9 h-8 flex items-center justify-center p-[10px] cursor-pointer`}
                                        onClick={() => {
                                          setSelectedItemId(item?.id);
                                          setShowConfirmReject(true);
                                        }}
                                      >
                                        <img
                                          src={closeIcon}
                                          alt="view"
                                          className="w-full"
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                )}
                              </>
                            )}
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No data found
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

      {isModalOpen && (
        <MilestonePopup
          setIsModalOpen={setIsModalOpen}
          fetchMilestonesList={fetchMilestonesList}
        />
      )}
      {/* ✅ Success / Rating Popup */}
      {isSuccessModalOpen && (
        <SubmitRatingPopup
          isOpen={isSuccessModalOpen} // ✅ Add this line
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}

      {/* {showConfirmReject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3">
              Are you sure you want to reject this milestones?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRejectTask}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Reject
              </button>
              <button
                onClick={cancelRejectTask}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default CoordinatorDashboard;
