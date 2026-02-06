import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Common/Sidebar";
import Topbar from "../Components/Common/Topbar";
import { useLocation } from "react-router-dom";
import InstractionGuide from "../Components/InstractionGuide";
import pdfFile from "../Assests/Images/CRM-User-Flow-for-Coordinator.pdf"

export default function PrivateLayout({ children }) {
  const [toggleMenuBar, setToggleMenuBar] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setToggleMenuBar(false);
  }, [location.pathname]);

  // Map route paths to titles
  const pageTitles = {
    "/": "Dashboard",
    "/user-management": "User Management",
    "/tasks": "Tasks",
    "/school-management": "School Management",
    "/student-management": "Student Management",
    "/task-category": "Task Category",
    "/rewards-list": "Milestone Rewards",
    "/spin-rewards": "Spin Rewards",
    "/learn-module": "Learn Module",
    "/telemedicine": "Telemedicine",
    "/employee-feedback": "Employee Feedback",
    "/student-feedback": "Student Feedback",
    "/schoolwise-feedback": "Schoolwise Feedback",
    "/milestones-achieved": "School Wise Milestones Achieved",
    "/active-students": "School Wise Active Students",
    "/milestones-completion": "Milestones Completion",
    "/cordinator-performance": "Co-ordinator Performance",
    "/tickets": "Tickets",
    "/tickets-list": "My Tickets",
    "/inventory": "Inventory Management",
    "/school-mapping": "School Mapping",
    "/faq-management": "FAQ Management",
    "/faq-category": "FAQ Category",
  };

  const pageTitle = pageTitles[location.pathname] || "Page";

  const handleGuideClick = () => {
    setShowPdf(true);
  };

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
          handleGuideClick={handleGuideClick}
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

      {showPdf && (
        <InstractionGuide
          show={showPdf}
          onClose={() => setShowPdf(false)}
          pdfUrl={pdfFile}
        />
      )}
    </>
  );
}
