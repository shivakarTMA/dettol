import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import phoneIcon from "../Assests/Images/icons/phone.svg";
import locationIcon from "../Assests/Images/icons/location.svg";
import uncheckIcon from "../Assests/Images/icons/uncheck.svg";
import checkIcon from "../Assests/Images/icons/checkblue.svg";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

export default function MilestonePopup({ isOpen, onClose, milestone }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (milestone) {
      setTasks(
        milestone.tasks.map((task) => ({
          ...task,
          completed: task.completed || false,
          action: task.action || null,
        }))
      );
    }
  }, [milestone]);

  if (!isOpen) return null;

  // Are all tasks selected?
  const allSelected = tasks.length > 0 && tasks.every((task) => task.completed);

  // Toggle single task checkbox
  const toggleTaskCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Toggle all tasks checkbox (mark all)
  const toggleAllTasks = () => {
    const newCompletedStatus = !allSelected;
    setTasks(tasks.map((task) => ({ ...task, completed: newCompletedStatus })));
  };

  // Bulk action on selected tasks
  const bulkAction = (actionType) => {
    // Filter out all tasks that are checked (completed)
    const selectedTasks = tasks.filter((task) => task.completed);

    // Log selected tasks in the console
    console.log("✅ Selected tasks for verification:", selectedTasks);
    toast.success("Verify Task Completed!");
    onClose();

    // Apply bulk action to checked tasks
    setTasks(
      tasks.map((task) =>
        task.completed ? { ...task, action: actionType } : task
      )
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="bg-white shadow-lg w-full max-w-3xl mx-4 relative rounded-[20px] overflow-hidden">
          <div className="lg:p-5 p-4 pb-1 border border-[#D4D4D4]">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
              onClick={onClose}
              aria-label="Close"
            >
              <IoMdClose />
            </button>

            {/* Header info */}
            <h2 className="text-xl font-semibold mb-3">Shivakar Sharma</h2>
            <p className="text-black flex items-center gap-2 mb-3">
              <span role="img" aria-label="phone">
                <img src={phoneIcon} className="w-4" />
              </span>{" "}
              {milestone.phone}
            </p>
            <p className="text-black flex items-center gap-2 mb-4">
              <span role="img" aria-label="location">
                <img src={locationIcon} className="w-4" />
              </span>{" "}
              {milestone.address}
            </p>
          </div>

          <div className="lg:p-5 p-4 pt-3">
            {/* Milestone Title */}
            <div className="flex items-center gap-2 mb-3 justify-between">
              <h3 className="font-bold text-lg ">{milestone.milestoneTitle}</h3>

              <div className="">
                <button
                  onClick={() => bulkAction("check")}
                  className="bg-[#4D57EE] text-white px-4 py-1 rounded "
                >
                  Verify
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center bg-[#F1F1F1] rounded-[5px] py-3 px-2 lg:gap-5 gap-2">
                <div className="text-center lg:w-10 w-8">
                  <div className="flex items-center justify-center relative">
                    <img
                      src={allSelected ? checkIcon : uncheckIcon}
                      alt={allSelected ? "Checked" : "Unchecked"}
                      className="w-5 h-5"
                    />
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAllTasks}
                      aria-label="Select all tasks"
                      className="w-5 h-5 absolute z-[1] opacity-0"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-black font-[500]">Tasks</span>
                </div>
              </div>

              {tasks.map(({ id, text, completed, action }, index) => (
                <div
                  key={id}
                  className={` flex items-center px-2 py-3 lg:gap-5 gap-2 ${
                    index === tasks.length - 1
                      ? ""
                      : "border-b border-[#D4D4D4]"
                  }`}
                >
                  <div className="text-center  w-10">
                    <div className="flex items-center justify-center relative">
                      <img
                        src={completed ? checkIcon : uncheckIcon}
                        alt={completed ? "Checked" : "Unchecked"}
                        className="w-5 h-5"
                      />
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => toggleTaskCompleted(id)}
                        aria-label={`Select task: ${text}`}
                        className="w-5 h-5 absolute z-[1] opacity-0"
                      />
                    </div>
                  </div>
                  <div className="text-black md:text-md text-sm">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
