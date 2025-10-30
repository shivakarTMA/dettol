// Import necessary React and utility libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IsLoadingHOC from "./IsLoadingHOC";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setIsAuthenticated,
  setUser,
  setUserType,
} from "../../Redux/Reducers/authSlice";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Logo from "../../Assests/Images/logo.png";

// Login component
const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { setLoading } = props;

  // Step 1 = enter phone, Step 2 = enter OTP
  const [data, setData] = useState({ identifier: "", otp: "" });
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

  // Dummy users list (replace API with this)
  const users = [
    {
      identifier: "9999990001",
      otp: "111111",
      name: "Admin User",
      token: "admin-token",
      userType: "admin",
    },
    {
      identifier: "9999990002",
      otp: "222222",
      name: "Coordinator User",
      token: "coordinator-token",
      userType: "coordinator",
    },
    {
      identifier: "9999990003",
      otp: "333333",
      name: "Student User",
      token: "student-token",
      userType: "student",
    },
  ];

  // Redirect to home if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit for login and OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Step 1: validate phone number
      setLoading(true);
      try {
        const foundUser = users.find((u) => u.identifier === data.identifier);
        if (foundUser) {
          setCurrentUser(foundUser);
          toast.success(`OTP sent successfully.`);
          console.log(`Mock OTP for ${data.identifier}: ${foundUser.otp}`);
          setStep(2);
        } else {
          toast.error("Identifier not found. Please enter a valid phone number.");
        }
      } catch (error) {
        toast.error("Something went wrong while sending OTP");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // Step 2: verify OTP
      setLoading(true);
      try {
        if (currentUser && data.otp === currentUser.otp) {
          dispatch(setAccessToken(currentUser.token));
          dispatch(setUser(currentUser));
          dispatch(setUserType(currentUser.userType));
          dispatch(setIsAuthenticated(true));
          toast.success(`Welcome, ${currentUser.name}!`);
          navigate("/");
        } else {
          toast.error("Invalid OTP. Please try again.");
        }
      } catch (error) {
        toast.error("Error verifying OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm z-[3]">
        <div className="logo--login">
          <img
            src={Logo}
            alt="logo"
            width={150}
            height={30}
          />
        </div>
        <h2 className="text-center tracking-tight heading--login">Sign in</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm login--form--admin">
        <form onSubmit={handleSubmit} className="space-y-3">
          {step === 1 && (
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <div className="filter--input--search flex items-center bg-white rounded-[5px] h-[45px] border border-bordergray px-[15px]">
                  <span className="border-r border-bordergray pr-[15px]">
                    <FaPhoneAlt />
                  </span>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    value={data.identifier}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={10}
                    pattern="\d{10}"
                    title="Phone number must be exactly 10 digits"
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 focus:outline-none sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-900"
              >
                OTP
              </label>
              <div className="mt-2">
                <div className="filter--input--search flex items-center bg-white rounded-[5px] h-[45px] border border-bordergray px-[15px]">
                  <span className="border-r border-bordergray pr-[15px]">
                    <RiLockPasswordFill />
                  </span>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={data.otp}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 focus:outline-none sm:text-sm"
                    placeholder="Enter your OTP"
                    minLength={6}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-black text-white py-2 px-4 h-[45px] rounded-[5px] hover:text-textcolor border border-buttonbg font-semibold"
            >
              {step === 1 ? "Next" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IsLoadingHOC(Login);
