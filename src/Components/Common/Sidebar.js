import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../Assests/Images/logo.png";
import dashboardIcon from "../../Assests/Images/icons/dashboard.svg";
import schoolIcon from "../../Assests/Images/sidebar/schoolmanagement.svg";
import schoolmapIcon from "../../Assests/Images/sidebar/school.svg";
import studentIcon from "../../Assests/Images/sidebar/studentmanagement.svg";
import CategoryIcon from "../../Assests/Images/sidebar/taskcategory.svg";
import tasksIcon from "../../Assests/Images/sidebar/tasks.svg";
import milestoneIcon from "../../Assests/Images/sidebar/milestonerewards.svg";
import spinIcon from "../../Assests/Images/sidebar/spinrewards.svg";
import learnIcon from "../../Assests/Images/sidebar/learnmodule.svg";
import telemedicineIcon from "../../Assests/Images/sidebar/telemedicine.svg";
import feedbackIcon from "../../Assests/Images/sidebar/feedback.svg";
import reportsIcon from "../../Assests/Images/sidebar/reports.svg";
import userIcon from "../../Assests/Images/sidebar/usermanagement.svg";
import ticketIcon from "../../Assests/Images/sidebar/ticket.svg";
import inventoryIcon from "../../Assests/Images/sidebar/inventory.svg";
import guideIcon from "../../Assests/Images/icons/guide.svg";
import { useSelector } from "react-redux";
import { FaAngleDown, FaCircle } from "react-icons/fa";

const Sidebar = ({ toggleMenuBar, setToggleMenuBar, handleGuideClick }) => {
  const location = useLocation();
  const { userType } = useSelector((state) => state.auth);

  const [dropdownToggles, setDropdownToggles] = useState({});

  const toggleMenu = (menuKey) => {
    setDropdownToggles((prev) => {
      const newState = {};

      // If the same menu is clicked, toggle it; otherwise, open the new one only
      if (!prev[menuKey]) {
        newState[menuKey] = true;
      }

      return newState;
    });

    if (window.innerWidth > 1200) {
      setToggleMenuBar(false);
    }
  };
  useEffect(() => {
    if (toggleMenuBar) {
      setDropdownToggles({});
    }
  }, [toggleMenuBar]);

  const handlePdfControl = () =>{
    handleGuideClick();
    setToggleMenuBar(false);
  }

  return (
    <div className={`sidebar ${toggleMenuBar ? "activetoggle" : ""}`}>
      <div className="sidebar-logo d-flex align-items-center">
        <Link to="/" className="text-center">
          <img
            src={Logo}
            alt="logo"
            width="122"
            height="120"
            className="mx-auto"
          />
        </Link>
      </div>

      <div className="mt-0 sidebar--menu--list">
        <p className="text-[#949494] text-uppercase menu--head mb-3 px-[17px]">
          Overview
        </p>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Dashboard</span>
        </Link>

        {userType !== "TELEMEDICINE" && (
          <p className="text-[#949494] text-uppercase menu--head my-5 mb-3 px-[17px]">
            GENERAL SETTINGS
          </p>
        )}

        {userType === "ADMIN" && (
          <>
            <Link
              to="/school-management"
              className={`nav-link mb-2 ${
                location.pathname === "/school-management" ? "active" : ""
              }`}
            >
              <img src={schoolIcon} alt="schoolIcon" className="menu--icon" />
              <span className="nav-text">School Management</span>
            </Link>
            <Link
              to="/student-management"
              className={`nav-link mb-2 ${
                location.pathname === "/student-management" ? "active" : ""
              }`}
            >
              <img src={studentIcon} alt="studentIcon" className="menu--icon" />
              <span className="nav-text">Student Management</span>
            </Link>
            <Link
              to="/milestones-completion"
              className={`nav-link mb-2 ${
                location.pathname === "/milestones-completion" ? "active" : ""
              }`}
            >
              <img
                src={milestoneIcon}
                alt="milestoneIcon"
                className="menu--icon"
              />
              <span className="nav-text">Milestones Completion</span>
            </Link>
            <Link
              to="/task-category"
              className={`nav-link mb-2 ${
                location.pathname === "/task-category" ? "active" : ""
              }`}
            >
              <img
                src={CategoryIcon}
                alt="CategoryIcon"
                className="menu--icon"
              />
              <span className="nav-text">Task Category</span>
            </Link>
            <Link
              to="/tasks"
              className={`nav-link mb-2 ${
                location.pathname === "/tasks" ? "active" : ""
              }`}
            >
              <img src={tasksIcon} alt="tasksIcon" className="menu--icon" />
              <span className="nav-text">Tasks</span>
            </Link>
            <Link
              to="/rewards-list"
              className={`nav-link mb-2 ${
                location.pathname === "/rewards-list" ? "active" : ""
              }`}
            >
              <img
                src={milestoneIcon}
                alt="milestoneIcon"
                className="menu--icon"
              />
              <span className="nav-text">Milestone Rewards</span>
            </Link>
            <Link
              to="/spin-rewards"
              className={`nav-link mb-2 ${
                location.pathname === "/spin-rewards" ? "active" : ""
              }`}
            >
              <img src={spinIcon} alt="spinIcon" className="menu--icon" />
              <span className="nav-text">Spin Rewards</span>
            </Link>
            <Link
              to="/learn-module"
              className={`nav-link mb-2 ${
                location.pathname === "/learn-module" ? "active" : ""
              }`}
            >
              <img src={learnIcon} alt="learnIcon" className="menu--icon" />
              <span className="nav-text">Learn Module</span>
            </Link>
            <Link
              to="/telemedicine"
              className={`nav-link mb-2 ${
                location.pathname === "/telemedicine" ? "active" : ""
              }`}
            >
              <img
                src={telemedicineIcon}
                alt="telemedicineIcon"
                className="menu--icon"
              />
              <span className="nav-text">Telemedicine</span>
            </Link>
            <Link
              to="/school-mapping"
              className={`nav-link mb-2 ${
                location.pathname === "/school-mapping" ? "active" : ""
              }`}
            >
              <img
                src={schoolmapIcon}
                alt="schoolmapIcon"
                className="menu--icon"
              />
              <span className="nav-text">School Mapping</span>
            </Link>

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("feedback")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={feedbackIcon}
                  alt="feedbackIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Feedback</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["feedback"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["feedback"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/employee-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Employee Feedback</span>
                </Link>
                <Link
                  to="/student-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Student Feedback</span>
                </Link>
              </div>
            )}

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("reports")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={reportsIcon}
                  alt="reportsIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Reports</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["reports"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["reports"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/milestones-achieved"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Milestones Achieved</span>
                </Link>
                <Link
                  to="/active-students"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Active Students</span>
                </Link>
                <Link
                  to="/cordinator-performance"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Coordinator Performance</span>
                </Link>
                <Link
                  to="/schoolwise-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Schoolwise Feedback</span>
                </Link>
              </div>
            )}
            <Link
              to="/inventory"
              className={`nav-link mb-2 ${
                location.pathname === "/inventory" ? "active" : ""
              }`}
            >
              <img
                src={inventoryIcon}
                alt="inventoryIcon"
                className="menu--icon"
              />
              <span className="nav-text">Inventory Management</span>
            </Link>
            <Link
              to="/user-management"
              className={`nav-link mb-2 ${
                location.pathname === "/user-management" ? "active" : ""
              }`}
            >
              <img src={userIcon} alt="userIcon" className="menu--icon" />
              <span className="nav-text">User Management</span>
            </Link>
            <Link
              to="/tickets"
              className={`nav-link mb-2 ${
                location.pathname === "/tickets" ? "active" : ""
              }`}
            >
              <img src={ticketIcon} alt="userIcon" className="menu--icon" />
              <span className="nav-text">Tickets</span>
            </Link>
          </>
        )}

        {userType === "LEADERSHIP" && (
          <>
            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("feedback")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={feedbackIcon}
                  alt="feedbackIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Feedback</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["feedback"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["feedback"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/employee-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Employee Feedback</span>
                </Link>
                <Link
                  to="/student-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Student Feedback</span>
                </Link>
              </div>
            )}

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("reports")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={reportsIcon}
                  alt="reportsIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Reports</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["reports"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["reports"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/milestones-achieved"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Milestones Achieved</span>
                </Link>
                <Link
                  to="/active-students"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Active Students</span>
                </Link>
                <Link
                  to="/cordinator-performance"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Coordinator Performance</span>
                </Link>
                <Link
                  to="/schoolwise-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Schoolwise Feedback</span>
                </Link>
              </div>
            )}
          </>
        )}

        {userType === "COORDINATOR" && (
          <>
            <Link
              to="/milestones-completion"
              className={`nav-link mb-2 ${
                location.pathname === "/milestones-completion" ? "active" : ""
              }`}
            >
              <img
                src={milestoneIcon}
                alt="milestoneIcon"
                className="menu--icon"
              />
              <span className="nav-text">Milestones Completion</span>
            </Link>

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("reports")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={reportsIcon}
                  alt="reportsIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Reports</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["reports"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["reports"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/milestones-achieved"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Milestones Achieved</span>
                </Link>
                <Link
                  to="/active-students"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Active Students</span>
                </Link>
              </div>
            )}

            <Link
              to="/tickets-list"
              className={`nav-link mb-2 ${
                location.pathname === "/tickets-list" ? "active" : ""
              }`}
            >
              <img src={ticketIcon} alt="userIcon" className="menu--icon" />
              <span className="nav-text">Tickets</span>
            </Link>

            <div
              className={`nav-link mb-2 cursor-pointer`} onClick={handlePdfControl}
            >
              <img src={guideIcon} alt="guideIcon" className="menu--icon" />
              <span className="nav-text">Instruction Manual</span>
            </div>
          </>
        )}

        {userType === "PROJECT_MANAGER" && (
          <>
            <Link
              to="/school-management"
              className={`nav-link mb-2 ${
                location.pathname === "/school-management" ? "active" : ""
              }`}
            >
              <img src={schoolIcon} alt="schoolIcon" className="menu--icon" />
              <span className="nav-text">School Management</span>
            </Link>
            <Link
              to="/student-management"
              className={`nav-link mb-2 ${
                location.pathname === "/student-management" ? "active" : ""
              }`}
            >
              <img src={studentIcon} alt="studentIcon" className="menu--icon" />
              <span className="nav-text">Student Management</span>
            </Link>
            <Link
              to="/task-category"
              className={`nav-link mb-2 ${
                location.pathname === "/task-category" ? "active" : ""
              }`}
            >
              <img
                src={CategoryIcon}
                alt="CategoryIcon"
                className="menu--icon"
              />
              <span className="nav-text">Task Category</span>
            </Link>
            <Link
              to="/tasks"
              className={`nav-link mb-2 ${
                location.pathname === "/tasks" ? "active" : ""
              }`}
            >
              <img src={tasksIcon} alt="tasksIcon" className="menu--icon" />
              <span className="nav-text">Tasks</span>
            </Link>
            <Link
              to="/rewards-list"
              className={`nav-link mb-2 ${
                location.pathname === "/rewards-list" ? "active" : ""
              }`}
            >
              <img
                src={milestoneIcon}
                alt="milestoneIcon"
                className="menu--icon"
              />
              <span className="nav-text">Milestone Rewards</span>
            </Link>
            <Link
              to="/spin-rewards"
              className={`nav-link mb-2 ${
                location.pathname === "/spin-rewards" ? "active" : ""
              }`}
            >
              <img src={spinIcon} alt="spinIcon" className="menu--icon" />
              <span className="nav-text">Spin Rewards</span>
            </Link>
            <Link
              to="/learn-module"
              className={`nav-link mb-2 ${
                location.pathname === "/learn-module" ? "active" : ""
              }`}
            >
              <img src={learnIcon} alt="learnIcon" className="menu--icon" />
              <span className="nav-text">Learn Module</span>
            </Link>
            <Link
              to="/telemedicine"
              className={`nav-link mb-2 ${
                location.pathname === "/telemedicine" ? "active" : ""
              }`}
            >
              <img
                src={telemedicineIcon}
                alt="telemedicineIcon"
                className="menu--icon"
              />
              <span className="nav-text">Telemedicine</span>
            </Link>

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("feedback")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={feedbackIcon}
                  alt="feedbackIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Feedback</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["feedback"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["feedback"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/employee-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Employee Feedback</span>
                </Link>
                <Link
                  to="/student-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Student Feedback</span>
                </Link>
              </div>
            )}

            <div
              className="nav-link d-flex justify-between align-items-center mb-2 dropdown--menu"
              onClick={() => toggleMenu("reports")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center">
                <img
                  src={reportsIcon}
                  alt="reportsIcon"
                  className="menu--icon"
                />
                <span className="nav-text">Reports</span>
              </div>
              <FaAngleDown
                className={`downmenu transition ${
                  dropdownToggles["reports"] ? "rotate-[180deg]" : ""
                }`}
              />
            </div>

            {dropdownToggles["reports"] && (
              <div className="mt-2 pl-[40px] relative">
                <div className="absolute h-[calc(100%-15px)] w-[2px] bg-black left-[44px] top-[8px]"></div>
                <Link
                  to="/milestones-achieved"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Milestones Achieved</span>
                </Link>
                <Link
                  to="/active-students"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Active Students</span>
                </Link>
                <Link
                  to="/cordinator-performance"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Coordinator Performance</span>
                </Link>
                <Link
                  to="/schoolwise-feedback"
                  className="text-black flex items-center gap-[5px] mb-2 text-sm"
                >
                  <FaCircle className="menu--icon !text-[10px]" />
                  <span className="nav-text">Schoolwise Feedback</span>
                </Link>
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  );
};

export default Sidebar;
