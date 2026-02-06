import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import phoneIcon from "../Assests/Images/icons/phone.svg";
import locationIcon from "../Assests/Images/icons/location.svg";
import checkIcon from "../Assests/Images/icons/check.svg";
import rejectIcon from "../Assests/Images/icons/reject.svg";
import { toast } from "react-toastify";
import { authAxios } from "../Config/config";
import { useSelector } from "react-redux";
import otpIcon from "../Assests/Images/icons/password.svg";

export default function MilestonePopup({
  setIsModalOpen,
  editingOption,
  fetchMilestonesList,
  setIsSuccessModalOpen,
}) {
  const { user } = useSelector((state) => state.auth);
  const [milestone, setMilestone] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  // This array will be sent in Submit API
  const [approvedIds, setApprovedIds] = useState([]);

  // ============================================================
  // ✅ Fetch milestone by ID
  // ============================================================
  useEffect(() => {
    if (!editingOption) return;

    const fetchMilestone = async () => {
      try {
        const res = await authAxios().get(`/myreward/mytask/${editingOption}`);
        const data = res.data?.data;

        if (!data) return toast.error("No milestone found");

        const student = data.student;
        const ms = data.milestone;

        const formattedTasks = ms.mytasks.map((t) => ({
          id: t.id,
          text: t.task,
          coins: t.points_required,
          completed: null, // null = not touched, true = approve, false = reject
        }));

        setMilestone({
          studentName: student.name,
          phone: student.mobile,
          address: student.address,
          title_en: ms.title_en,
          baseCoins: student.reward_points,
          tasks: formattedTasks,
        });

        setTasks(formattedTasks);
        setEarnedCoins(student.reward_points);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch milestone details");
      }
    };

    fetchMilestone();
  }, [editingOption]);

  const fetchStaffById = async () => {
    const id = user?.id;
    try {
      const res = await authAxios().get(`/staff/${id}`);
      const data = res.data?.data?.rating_submitted;
      console.log(data, "data");
      setRatingSubmitted(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff details");
    }
  };

  useEffect(() => {
    fetchStaffById();
  }, []);

  // ============================================================
  // ✅ Recalculate coins
  // ============================================================
  const recalculateCoins = (updatedTasks) => {
    const taskCoins = updatedTasks
      .filter((t) => t.completed === true)
      .reduce((sum, t) => sum + t.coins, 0);

    setEarnedCoins((milestone?.baseCoins || 0) + taskCoins);
  };

  // ============================================================
  // ✅ Approve (local only, API on Submit)
  // ============================================================
  const handleCheckTask = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, completed: t.completed === true ? null : true }
          : t
      );

      // Update approved IDs
      const approved = updated
        .filter((t) => t.completed === true)
        .map((t) => t.id);

      setApprovedIds(approved);
      recalculateCoins(updated);

      return updated;
    });
  };

  // ============================================================
  // ❌ Reject (Immediate API call)
  // ============================================================
  const handleRejectClick = (id) => {
    setRejectTaskId(id);
    setShowConfirmReject(true);
  };

  const confirmRejectTask = async () => {
    if (!rejectTaskId) return;

    try {
      await authAxios().put(`/myreward/mytask/reject/${rejectTaskId}`);
      toast.success("Task rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject task");
    }

    // Update UI
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === rejectTaskId ? { ...t, completed: false } : t
      );
      recalculateCoins(updated);
      return updated;
    });

    // Remove from approved if exists
    setApprovedIds((prev) => prev.filter((id) => id !== rejectTaskId));

    setShowConfirmReject(false);
    setRejectTaskId(null);
  };

  const cancelRejectTask = () => {
    setShowConfirmReject(false);
    setRejectTaskId(null);
  };

  const handleOtpChange = (e) => {
    let value = e.target.value;

    // Prevent entering more than 4 digits
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    setOtpValue(value);

    // Dynamic error handling
    if (value.length === 0) {
      setOtpError("Delivery OTP is required.");
    } else if (value.length < 4) {
      setOtpError("Delivery OTP must be 4 digits long.");
    } else {
      setOtpError("");
    }
  };

  // ============================================================
  // ✅ Submit (Approve all tasks)
  // ============================================================
  const handleSubmit = async () => {
    if (approvedIds.length === 0) {
      toast.error("Please approve at least one task");
      return;
    }

    if (!otpValue) {
      setOtpError("Delivery OTP is required.");
      return;
    }

    if (otpValue.length !== 4) {
      setOtpError("Delivery OTP must be 4 digits long.");
      return;
    }

    try {
      await authAxios().put("/myreward/mytask/approved", {
        my_reward_id: editingOption,
        id: approvedIds,
        delivery_otp: otpValue,
      });

      toast.success("Tasks submitted successfully!");
      setOtpError("");
      setOtpValue("");
      fetchMilestonesList();
      setIsModalOpen(false);

      setIsSuccessModalOpen(!ratingSubmitted);
    } catch (error) {
      console.error(error);
      const apiMessage = error?.response?.data?.message;
      if (apiMessage) {
        setOtpError(apiMessage);
      } else {
        setOtpError("");
      }
    }
  };

  if (!milestone) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsModalOpen(false)}
      ></div>

      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="bg-white shadow-lg w-full max-w-3xl mx-4 relative rounded-[20px] overflow-hidden">
          <div className="lg:p-5 p-3 pb-1 border border-[#D4D4D4]">
            <button
              className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold mb-3">
              {milestone.studentName}
            </h2>
            <p className="text-black flex items-center gap-2 mb-3">
              <img src={phoneIcon} className="w-4" alt="phone" />{" "}
              {milestone.phone}
            </p>
            <p className="text-black flex items-center gap-2 mb-4">
              <img src={locationIcon} className="w-4" alt="location" />{" "}
              {milestone.address}
            </p>
          </div>

          <div className="lg:p-5 p-3 pt-3">
            <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between mb-3 gap-2">
              <h3 className="font-bold text-lg">{milestone?.title_en}</h3>
              {earnedCoins >= 100 && (
                <div className="flex lg:flex-row flex-col-reverse lg:items-center gap-1">
                  {otpError && (
                    <span className="text-red-500 text-sm block">
                      {otpError}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="relative w-full lg:max-w-[190px] max-w-[130px]">
                      <img
                        src={otpIcon}
                        className="absolute top-[9px] left-[10px] w-6 h-6"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        className="pr-2 pl-[35px] py-2 rounded-full w-full border"
                        placeholder="Enter Delivery OTP"
                        value={otpValue}
                        onChange={handleOtpChange}
                        maxLength={4}
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="bg-[#008421] text-white md:px-4 py-2 px-6 rounded-full"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center bg-[#F1F1F1] rounded-[5px] py-3 px-2 lg:gap-5 gap-2">
                <span className="text-black font-[500]">Tasks</span>
                <span className="block px-3 py-1 rounded-full bg-white text-[#008421]">
                  Coins: {earnedCoins}
                </span>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {tasks.map(({ id, text, completed }) => (
                  <div
                    key={id}
                    className="border-b border-[#D4D4D4] py-3 px-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-black text-sm flex-1">{text}</div>

                      <div className="flex gap-0">
                        {/* Approve */}
                        {completed !== false && (
                          <button
                            onClick={() => handleCheckTask(id)}
                            className={`px-2 py-2 rounded-l-[5px] border ${
                              completed === true
                                ? "bg-[#008421] border-[#008421] text-white"
                                : "bg-white border-black"
                            }`}
                          >
                            <img
                              src={checkIcon}
                              className={`w-3 ${
                                completed === true ? "brightness-0 invert" : ""
                              }`}
                              alt="approve"
                            />
                          </button>
                        )}

                        {/* Reject */}
                        <button
                          onClick={() => handleRejectClick(id)}
                          className={`px-2 py-2 rounded-r-[5px] border ${
                            completed === false
                              ? "bg-red-600 border-red-600 text-white cursor-not-allowed pointer-events-none"
                              : "bg-white border-black"
                          }`}
                        >
                          <img
                            src={rejectIcon}
                            className={`w-3 ${
                              completed === false ? "brightness-0 invert" : ""
                            }`}
                            alt="reject"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Confirmation */}
      {showConfirmReject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3">
              Are you sure you want to reject this task?
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
}
