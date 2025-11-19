import React, { useEffect, useState } from "react";
import viewIcon from "../../Assests/Images/icons/view.svg";
import closeIcon from "../../Assests/Images/icons/close.svg";
import shippingIcon from "../../Assests/Images/icons/shipping.svg";
import MilestonePopup from "../../Components/MilestonePopup";
import SubmitRatingPopup from "../../Components/SubmitRatingPopup";
import Tooltip from "../../Components/Common/Tooltip";
import SubmitRemarksPopup from "../../Components/SubmitRemarksPopup";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { formatStatus } from "../../Helper/helper";
import Pagination from "../../Components/Common/Pagination";
import searchIcon from "../../Assests/Images/icons/search.svg";
import Select from "react-select";
import { customStyles } from "../../Helper/helper";

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

const statusOptions = [
  { value: "IN_ROUTE", label: "In Route" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "REJECT", label: "Reject" },
];

const MilestonesCompletionScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [milestoneList, setMilestonesList] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [cardSearch, setCardSearch] = useState("");
  const [cardError, setCardError] = useState("");

  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMilestonesList = async (currentPage = page) => {
  try {
    const params = {
      page: currentPage,
      limit: rowsPerPage,
    };

    // Add milestone filter
    if (selectedMilestone?.value) {
      params.milestone_name = selectedMilestone.value;
    }

    // Add status filter
    if (selectedStatus?.value) {
      params.status = selectedStatus.value;
    }

    // Add card search filter (numeric only)
    const cleanSearch = cardSearch.replace(/-/g, ""); 
    if (cleanSearch.length === 16) {
      params.search = cleanSearch;
    }

    const res = await authAxios().get("/myreward/list", { params });

    let data = res.data?.data || [];

    setMilestonesList(data);
    setPage(res.data?.currentPage || 1);
    setTotalPages(res.data?.totalPage || 1);
    setTotalCount(res.data?.totalCount || data.length);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch myreward");
  }
};

  console.log(cardSearch,'cardSearch')

useEffect(() => {
  setPage(1);
  fetchMilestonesList(1);
}, [selectedMilestone, selectedStatus, cardSearch]);

  const handleShippingClick = async (itemId, status) => {
    try {
      // Pass the status in the request payload
      const res = await authAxios().put(`/myreward/${itemId}`, {
        status: status,
      });
      toast.success(`Status updated to ${formatStatus(status)} successfully!`);
      fetchMilestonesList(); // Assuming this reloads or updates the milestones list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update milestone status");
    }
  };

  const confirmRejectTask = async () => {
    if (!selectedItemId) return;

    try {
      await handleShippingClick(selectedItemId, "REJECT");
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirmReject(false);
      setSelectedItemId(null);
    }
  };

  const cancelRejectTask = () => {
    setShowConfirmReject(false);
    setSelectedItemId(null);
  };

  const handleCardSearchChange = (e) => {
  let value = e.target.value.replace(/[^0-9-]/g, ""); 
  let numericValue = value.replace(/-/g, "");

  // Auto-format display (xxxx-xxxx-xxxx-xxxx)
  if (numericValue.length > 0) {
    value = numericValue
      .substring(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1-")
      .slice(0, 19);
  }

  setCardSearch(value);

  if (!numericValue) {
    setCardError("");
    return;
  }

  if (numericValue.length !== 16) {
    setCardError("Please enter 16 digits");
  } else {
    setCardError("");
  }

  setPage(1);
};

  return (
    <>
      <div className="flex lg:flex-row flex-col justify-between lg:items-center flex-wrap gap-3 mb-5">
        <div className="flex gap-2 flex-1 items-center">
          <Select
            value={selectedMilestone}
            options={milestoneOptions}
            onChange={setSelectedMilestone}
            styles={customStyles}
            className="w-full lg:max-w-[160px]"
            isClearable
          />
          <Select
            value={selectedStatus}
            options={statusOptions}
            onChange={setSelectedStatus}
            styles={customStyles}
            className="w-full lg:max-w-[160px]"
            isClearable
          />
        </div>
        <div className="flex gap-3 lg:justify-end">
          <div className="relative w-full lg:max-w-[250px]">
            <img src={searchIcon} className="absolute top-[13px] left-[15px]" />
            <input
              type="text"
              className="pr-2 pl-[35px] py-2 rounded-full w-full"
              placeholder="Search by card number"
              value={cardSearch}
              onChange={handleCardSearchChange}
              maxLength={19}
            />
            {cardError && (
              <span className="text-red-500 text-sm mt-1">{cardError}</span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white custom--shodow rounded-[10px] p-3">
        {/* Mobile */}
        <div className="sm:hidden block space-y-2">
          {milestoneList.map((item, index) => (
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
                <div>
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
                </div>
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
                    {item?.milestone_name_en}
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
                  <th className="px-3 py-3 min-w-[120px]">Status</th>
                  <th className="px-3 py-3 min-w-[120px]">View Details</th>
                </tr>
              </thead>
              <tbody>
                {milestoneList.length > 0 ? (
                  milestoneList.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.student_name}</td>
                      <td className="px-3 py-3">{item?.school_name}</td>
                      <td className="px-3 py-3">{item?.student_address}</td>
                      <td className="px-3 py-3">{item?.milestone_name_en}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`block w-fit px-3 py-1 rounded-full capitalize 
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
                      <td className="px-3 py-3">
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
                                      handleShippingClick(item?.id, "IN_ROUTE")
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
                      </td>
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
      <Pagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        currentDataLength={milestoneList.length}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchMilestonesList(newPage);
        }}
      />

      {isModalOpen && (
        <MilestonePopup
          setIsModalOpen={setIsModalOpen}
          editingOption={editingOption}
          fetchMilestonesList={fetchMilestonesList}
          setIsSuccessModalOpen={setIsSuccessModalOpen}
        />
      )}

      {/* ✅ Success / Rating Popup */}
      {isSuccessModalOpen && (
        <SubmitRatingPopup
          setIsSuccessModalOpen={setIsSuccessModalOpen}
        />
      )}

      {showConfirmReject && (
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
      )}
    </>
  );
};

export default MilestonesCompletionScreen;
