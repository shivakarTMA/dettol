import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../Assests/Images/logo.png";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import rewardsIcon from "../../Assests/Images/icons/rewards.svg";
import supportIcon from "../../Assests/Images/icons/support.svg";
import dashboardIcon from "../../Assests/Images/icons/dashboard.svg";
import milestoneIcon from "../../Assests/Images/icons/milestone.svg";
import userIcon from "../../Assests/Images/icons/user.svg";
import reportIcon from "../../Assests/Images/icons/report.svg";

const Sidebar = ({ toggleMenuBar, setToggleMenuBar }) => {
  const location = useLocation();
  // const { accessToken } = useSelector((state) => state.auth);
  // const userType = useSelector((state) => state.auth?.user?.userType);

  const [dropdownToggles, setDropdownToggles] = useState({});

  const toggleMenu = (menuKey) => {
    setDropdownToggles((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
    setToggleMenuBar(false);
  };

  useEffect(() => {
    if (toggleMenuBar) {
      setDropdownToggles({});
    }
  }, [toggleMenuBar]);

  useEffect(() => {
    setToggleMenuBar(false);
    setDropdownToggles({});
  }, [location.pathname]);

  return (
    <div className={`sidebar ${toggleMenuBar ? "activetoggle" : ""}`}>
      <div className="sidebar-logo d-flex align-items-center">
        <Link to="/">
          <img src={Logo} alt="logo" width="100px" height="50px" />
        </Link>
      </div>

      <div className="mt-0 sidebar--menu--list">
        <p className="text-[#949494] text-uppercase menu--head mb-3 px-[17px]">Overview</p>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Dashboard</span>
        </Link>

        <p className="text-[#949494] text-uppercase menu--head my-5 mb-3 px-[17px]">GENERAL SETTINGS</p>

        <Link
          to="#"
          className={`nav-link mb-2 ${
            location.pathname === "#" ? "active" : ""
          }`}
        >
          <img src={rewardsIcon} alt="rewardsIcon" className="menu--icon" />
          <span className="nav-text">Rewards</span>
        </Link>
        <Link
          to="#"
          className={`nav-link mb-2 ${
            location.pathname === "#" ? "active" : ""
          }`}
        >
          <img src={milestoneIcon} alt="milestoneIcon" className="menu--icon" />
          <span className="nav-text">Milestones</span>
        </Link>
        <Link
          to="/reports"
          className={`nav-link mb-2 ${
            location.pathname === "/reports" ? "active" : ""
          }`}
        >
          <img src={reportIcon} alt="reportIcon" className="menu--icon" />
          <span className="nav-text">Reports</span>
        </Link>
        <Link
          to="#"
          className={`nav-link mb-2 ${
            location.pathname === "#" ? "active" : ""
          }`}
        >
          <img src={userIcon} alt="userIcon" className="menu--icon" />
          <span className="nav-text">User Management</span>
        </Link>
        <Link
          to="#"
          className={`nav-link mb-2 ${
            location.pathname === "#" ? "active" : ""
          }`}
        >
          <img src={supportIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Help & Support</span>
        </Link>
        <Link
          to="/task-list"
          className={`nav-link mb-2 ${
            location.pathname === "/task-list" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Tasks</span>
        </Link>
        <Link
          to="/school-list"
          className={`nav-link mb-2 ${
            location.pathname === "/school-list" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Schools</span>
        </Link>
        <Link
          to="/student-list"
          className={`nav-link mb-2 ${
            location.pathname === "/student-list" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Students</span>
        </Link>
        <Link
          to="/category-list"
          className={`nav-link mb-2 ${
            location.pathname === "/category-list" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Categories</span>
        </Link>
        <Link
          to="/rewards-list"
          className={`nav-link mb-2 ${
            location.pathname === "/rewards-list" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Rewards</span>
        </Link>
        <Link
          to="/spin-awards"
          className={`nav-link mb-2 ${
            location.pathname === "/spin-awards" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Spin Awards</span>
        </Link>
        <Link
          to="/learn-module"
          className={`nav-link mb-2 ${
            location.pathname === "/learn-module" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Learn Module</span>
        </Link>
        <Link
          to="/telemedicine"
          className={`nav-link mb-2 ${
            location.pathname === "/telemedicine" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Telemedicine</span>
        </Link>
        <Link
          to="/employee-feedback"
          className={`nav-link mb-2 ${
            location.pathname === "/employee-feedback" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">Employee Feedback</span>
        </Link>
        <Link
          to="/user-feedback"
          className={`nav-link mb-2 ${
            location.pathname === "/user-feedback" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">User Feedback</span>
        </Link>
        <Link
          to="/school-wise-milestones"
          className={`nav-link mb-2 ${
            location.pathname === "/school-wise-milestones" ? "active" : ""
          }`}
        >
          <img src={dashboardIcon} alt="dashboardIcon" className="menu--icon" />
          <span className="nav-text">School Wise Milestones</span>
        </Link>

        {/* <div
          className="nav-link d-flex justify-between align-items-center mb-2"
          onClick={() => toggleMenu("workoutplans")}
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center">
            <TbGymnastics className="menu--icon" />
            <span className="nav-text">Workout Plans</span>
          </div>
          <FaAngleDown
            className={`downmenu transition ${
              dropdownToggles["workoutplans"] ? "rotate-[180deg]" : ""
            }`}
          />
        </div>

        {dropdownToggles["workoutplans"] && (
          <div className="mt-2 pl-5 relative">
            <div className="absolute h-[calc(100%-15px)] w-[2px] bg-white left-[23px] top-[8px]"></div>
            <Link
              to="/workout-plans"
              className="text-white flex items-center gap-[5px] mb-2 text-sm"
            >
              <FaCircle className="menu--icon !text-[10px]" />
              <span className="nav-text">All Workout Plans</span>
            </Link>
            <Link
              to="/create-workout-plan"
              className="text-white flex items-center gap-[5px] mb-2 text-sm"
            >
              <FaCircle className="menu--icon !text-[10px]" />
              <span className="nav-text">Create Workout Plan</span>
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
