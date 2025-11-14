import React, { useState } from "react";
import userIcon from "../../Assests/Images/icons/user.svg";
import logoutIcon from "../../Assests/Images/icons/logout.svg";
import ToggleMenu from "../../Assests/Images/icons/togglemenu.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Reducers/authSlice";
import Tooltip from "./Tooltip";

const Topbar = ({ setToggleMenuBar, toggleMenuBar, pageTitle }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setToggleMenuBar(!toggleMenuBar);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <>
      <section className="top--bar p-3 border-b border-b-[#D4D4D4]">
        <div className="inner--container flex justify-between gap-3">
          {/* Left Section */}
          <div className="topbar--left flex items-center gap-3 w-full flex-1">
            <div className="toggle--bar w-[32px]" onClick={handleToggleMenu}>
              <img src={ToggleMenu} className="cursor-pointer w-8" />
            </div>
            <h2 className="font-semibold lg:text-2xl text-lg">{pageTitle}</h2>
          </div>

          {/* Right Section */}
          <div className="top--bar--menu flex items-center gap-3">
            <div className="flex gap-2 items-center">
              <div className=" bg-[#EAEAEA] rounded-full items-center justify-center w-10 h-10 md:flex hidden">
                <img src={userIcon} className="w-4" />
              </div>

              <p className="text-sm ">{user?.name}</p>

              <Tooltip id={`tooltip-guide`} content={`Logout`} place="left">
                <div
                  className="flex bg-[#EAEAEA] rounded-full items-center justify-center cursor-pointer w-10 h-10"
                  onClick={handleLogout}
                >
                  <img src={logoutIcon} className="w-4" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topbar;
