import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import phoneIcon from "../Assests/Images/icons/phone.svg";
import locationIcon from "../Assests/Images/icons/location.svg";
import checkIcon from "../Assests/Images/icons/check.svg";
import rejectIcon from "../Assests/Images/icons/reject.svg";
import { toast } from "react-toastify";

const milestoneDetailsSample = {
  studentName: "Ansh Yadav",
  phone: "+91 9876543210",
  address: "110, Gandhi nagar, Gorakhpur, Uttar Pradesh, 123456",
  milestoneTitle: "Milestone 3",
  coins: 50, // base coins
  tasks: [
    {
      id: 1,
      text: "Wash hands with soap for at least 20 seconds",
      coins: 10,
      completed: null,
    },
    {
      id: 2,
      text: "Use tissues for blowing nose and dispose properly",
      coins: 10,
      completed: null,
    },
    {
      id: 3,
      text: "Avoid sharing spoon/plate while eating food with classmates",
      coins: 10,
      completed: null,
    },
    {
      id: 4,
      text: "Use personal water bottle instead of drinking fountains",
      coins: 10,
      completed: null,
    },
    {
      id: 5,
      text: "Wipe down shared computer keyboards before use",
      coins: 10,
      completed: null,
    },
  ],
};

export default function MilestonePopup({
  setIsModalOpen,
  milestone = milestoneDetailsSample,
  onSubmit,
}) {
  const [tasks, setTasks] = useState([]);
  const [earnedCoins, setEarnedCoins] = useState(milestone?.coins || 0);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState(null);

  // ✅ Initialize tasks
  useEffect(() => {
    if (milestone) {
      setTasks(
        milestone.tasks.map((task) => ({
          ...task,
          completed: task.completed ?? null,
        }))
      );
      setEarnedCoins(milestone.coins);
    }
  }, [milestone]);

  // ✅ Recalculate total coins dynamically based on approved tasks
  const recalculateCoins = (updatedTasks) => {
    const baseCoins = milestone.coins || 0;
    const approvedCoins = updatedTasks
      .filter((t) => t.completed === true)
      .reduce((sum, t) => sum + t.coins, 0);
    setEarnedCoins(baseCoins + approvedCoins);
  };

  // ✅ Handle Check (Approve)
  const handleCheckTask = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, completed: t.completed === true ? null : true }
          : t
      );
      recalculateCoins(updated);
      return updated;
    });
  };

  // ✅ Handle Reject (Show confirmation first)
  const handleRejectClick = (id) => {
    setRejectTaskId(id);
    setShowConfirmReject(true);
  };

  const confirmRejectTask = () => {
    if (!rejectTaskId) return;
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === rejectTaskId ? { ...t, completed: false } : t
      );
      recalculateCoins(updated);
      return updated;
    });
    setShowConfirmReject(false);
    setRejectTaskId(null);
  };

  const cancelRejectTask = () => {
    setShowConfirmReject(false);
    setRejectTaskId(null);
  };

  // ✅ Submit logic
  const handleSubmit = () => {
    toast.success("Tasks submitted successfully!");

    if (typeof onSubmit === "function") {
      onSubmit(tasks);
    }

    // Reset
    setTasks(
      milestone.tasks.map((task) => ({
        ...task,
        completed: null,
      }))
    );
    setEarnedCoins(milestone.coins);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsModalOpen(false)}
      ></div>

      {/* Popup */}
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{milestone.milestoneTitle}</h3>

              {/* ✅ Show submit button only if coins >= 100 */}
              {earnedCoins >= 100 && (
                <button
                  onClick={handleSubmit}
                  className="bg-[#008421] text-white px-4 py-1 rounded"
                >
                  Submit
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center bg-[#F1F1F1] rounded-[5px] py-3 px-2 lg:gap-5 gap-2">
                <div className="text-center">
                  <span className="text-black font-[500]">Tasks</span>
                </div>
                <span className="block w-fit px-3 py-1 rounded-full capitalize bg-white text-[#008421]">
                  Coins: {earnedCoins}
                </span>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {tasks.map(({ id, text, completed }) => (
                  <div
                    key={id}
                    className="border-b border-[#D4D4D4] py-3 px-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-black md:text-md text-sm flex-1">
                        {text}
                      </div>
                      <div className="flex gap-0">
                        <button
                          onClick={() => handleCheckTask(id)}
                          className={` px-2 py-2 rounded-l-[5px] border ${
                            completed === true
                              ? "bg-[#008421] border-[#008421] text-white"
                              : "bg-white border-black"
                          }`}
                        >
                          <img
                            src={checkIcon}
                            className={`w-3 ${
                              completed === true
                                ? "brightness-0 invert-[1]"
                                : ""
                            }`}
                            alt="check"
                          />
                        </button>
                        <button
                          onClick={() => handleRejectClick(id)}
                          className={` px-2 py-2 rounded-r-[5px] border ${
                            completed === false
                              ? "bg-red-600 border-red-600 text-white"
                              : "bg-white border-black"
                          }`}
                        >
                          <img
                            src={rejectIcon}
                            className={`w-3 ${
                              completed === false
                                ? "brightness-0 invert-[1]"
                                : ""
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

      {/* ✅ Confirmation Popup for Rejection */}
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
