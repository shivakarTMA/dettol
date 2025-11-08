import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import phoneIcon from "../Assests/Images/icons/phone.svg";
import locationIcon from "../Assests/Images/icons/location.svg";
import checkIcon from "../Assests/Images/icons/check.svg";
import rejectIcon from "../Assests/Images/icons/reject.svg";
import { toast } from "react-toastify";

export default function MilestonePopup({
  setIsModalOpen,
  milestone,
  onSubmit,
}) {
  const [tasks, setTasks] = useState([]);

  // ✅ Initialize tasks
  useEffect(() => {
    if (milestone) {
      setTasks(
        milestone.tasks.map((task) => ({
          ...task,
          completed: task.completed ?? null,
        }))
      );
    }
  }, [milestone]);

  // ✅ Approve (checked)
  const handleCheckTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  };

  const handleRejectTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
    );
  };

  // ✅ Submit logic
  const handleSubmit = () => {
    toast.success("Tasks submitted successfully!");

    if (typeof onSubmit === "function") {
      console.log("✅ Submitted Tasks:", tasks);
      onSubmit(tasks);
    } else {
      console.error("❌ onSubmit prop is not a function");
    }

    // ✅ Reset all tasks
    setTasks(
      milestone.tasks.map((task) => ({
        ...task,
        completed: null,
      }))
    );

    // ✅ Close popup
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
              <button
                onClick={handleSubmit}
                className="bg-[#008421] text-white px-4 py-1 rounded"
              >
                Verify
              </button>
            </div>
            <div>
              <div className="flex items-center bg-[#F1F1F1] rounded-[5px] py-3 px-2 lg:gap-5 gap-2">
                <div className="text-center">
                  <span className="text-black font-[500]">Tasks</span>
                </div>
              </div>
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
                        className={`lg:px-3 lg:py-2 px-2 py-2 rounded-l-[5px] border ${
                          completed === true
                            ? "bg-[#008421] border-[#008421] text-white"
                            : "bg-white border-black"
                        }`}
                      >
                        <img
                          src={checkIcon}
                          className={`lg:w-4 w-3 ${
                            completed === true ? "brightness-0 invert-[1]" : ""
                          }`}
                          alt="check"
                        />
                      </button>
                      <button
                        onClick={() => handleRejectTask(id)}
                        className={`lg:px-3 lg:py-2 px-2 py-2 rounded-r-[5px] border ${
                          completed === false
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-white border-black"
                        }`}
                      >
                        <img
                          src={rejectIcon}
                          className={`lg:w-4 w-3 ${
                            completed === false ? "brightness-0 invert-[1]" : ""
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
    </>
  );
}
