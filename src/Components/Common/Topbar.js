import React from "react";
import logoutIcon from "../../Assests/Images/icons/logout.svg";
import ToggleMenu from "../../Assests/Images/icons/togglemenu.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Reducers/authSlice";

const Topbar = ({ setToggleMenuBar, toggleMenuBar, pageTitle }) => {
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
              <div className="flex bg-[var(--primarycolor)] rounded-full items-center justify-center cursor-pointer gap-2 py-2 px-4" onClick={handleLogout}>
                <img src={logoutIcon} className="brightness-0 invert-[1]" />
                <span className="text-white text-sm">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topbar;
