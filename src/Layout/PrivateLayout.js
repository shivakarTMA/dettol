import React, { useState } from "react";
import Sidebar from "../Components/Common/Sidebar";
import Topbar from "../Components/Common/Topbar";
import { useLocation } from "react-router-dom";

export default function PrivateLayout({ children }) {
  const [toggleMenuBar, setToggleMenuBar] = useState(false);
  const location = useLocation();

  // Map route paths to titles
  const pageTitles = {
    "/": "Dashboard",
    "/reports": "Reports",
    "/task-list": "Tasks",
    "/school-list": "Schools",
    "/student-list": "Students",
    "/category-list": "Categories",
    "/rewards-list": "Rewards",
    "/spin-awards": "Spin Awards",
    "/learn-module": "Learn Module",
    "/telemedicine": "Telemedicine",
    "/employee-feedback": "Employee Feedback",
    "/user-feedback": "User Feedback",
    "/school-wise-milestones": "School Wise Milestones",
  };

  const pageTitle = pageTitles[location.pathname] || "Page";

  return (
    <>
      <div className="flex  h-full w-full">
        {toggleMenuBar && (
          <div
            className="overlay--sidebar"
            onClick={() => setToggleMenuBar(false)}
          ></div>
        )}
        <Sidebar
          toggleMenuBar={toggleMenuBar}
          setToggleMenuBar={setToggleMenuBar}
        />
        <div
          className={`${
            toggleMenuBar ? "w-[calc(100%-100px)]" : "w-[calc(100%-250px)]"
          } ml-[auto] side--content--area transition duration-150]`}
        >
          <Topbar
            setToggleMenuBar={setToggleMenuBar}
            toggleMenuBar={toggleMenuBar}
            pageTitle={pageTitle}
          />
          <div className="content--area lg:p-5 p-3">{children}</div>
        </div>
      </div>
    </>
  );
}
