import React, { useEffect, useRef, useState } from "react";
import notificationBell from "../../Assests/Images/icons/bell.svg";
import profileIcon from "../../Assests/Images/icons/user.svg";
import settingIcon from "../../Assests/Images/icons/setting.svg";
import ToggleMenu from "../../Assests/Images/icons/togglemenu.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Reducers/authSlice";

const Topbar = ({ setToggleMenuBar, toggleMenuBar, pageTitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setToggleMenuBar(!toggleMenuBar);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className="top--bar p-3 border-b border-b-[#D4D4D4]">
        <div className="inner--container flex justify-between gap-3">
          {/* Left Section */}
          <div className="topbar--left flex items-center gap-3 w-full flex-1">
            <div className="toggle--bar w-[32px]" onClick={handleToggleMenu}>
              <img src={ToggleMenu} className="cursor-pointer w-8" />
            </div>
            <h2 className="font-semibold lg:text-2xl text-xl">{pageTitle}</h2>
          </div>

          {/* Right Section */}
          <div className="top--bar--menu flex items-center gap-3">
            <div className="flex gap-2 items-center">
              <div className="bg-[#EAEAEA] rounded-full flex items-center justify-center w-[36px] h-[36px] cursor-pointer">
                <img src={notificationBell} />
              </div>
              <div className="bg-[#EAEAEA] rounded-full flex items-center justify-center w-[36px] h-[36px] cursor-pointer">
                <img src={settingIcon} />
              </div>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="bg-[#EAEAEA] rounded-full flex items-center justify-center w-[40px] h-[40px] cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <img src={profileIcon} alt="profile" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        My Profile
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Settings
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topbar;
