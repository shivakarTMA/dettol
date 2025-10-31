import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
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
import Logo from "../../Assests/Images/logo.png";
import bgLogin from "../../Assests/Images/bg-login.png";

const Login = (props) => {
  const { setLoading } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);


  const [data, setData] = useState({ identifier: "", otp: "" });
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


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
          toast.error("Please enter a valid phone number.");
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
    <div className="min-h-screen bg-whtie flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-center"
        style={{
          backgroundImage: `url('${bgLogin}')`,
        }}
      >
        <div className="absolute inset-0 bg-gray-300 backdrop-blur-sm opacity-[0.5]"></div>
      </div>


      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center  mb-4 ">
              <img
                src={Logo}
                alt="logo"
                width={150}
                height={30}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-2 animate-fadeIn">
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative group">
           
                  <div className="relative flex items-center bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 overflow-hidden">
                    <span className="flex items-center justify-center w-12 h-14 text-gray-500 pl-2">
                      <FaPhoneAlt className="w-5 h-5" />
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
                      className="flex-1 h-14 px-2 text-gray-900 focus:outline-none bg-transparent"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2 animate-fadeIn">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                  Enter OTP
                </label>
                <div className="relative group">
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div> */}
                  <div className="relative flex items-center bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 overflow-hidden">
                    <span className="flex items-center justify-center w-12 h-14 text-gray-500 pl-2">
                      <RiLockPasswordFill className="w-5 h-5" />
                    </span>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      value={data.otp}
                      onChange={handleChange}
                      required
                      minLength={6}
                      maxLength={6}
                      className="flex-1 h-14 px-2 text-gray-900 focus:outline-none bg-transparent tracking-widest text-lg"
                      placeholder="000000"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  OTP has been sent to your phone number
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full h-14 bg-[var(--primarycolor)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>{step === 1 ? 'Send OTP' : 'Verify & Login'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {step === 2 && (
              <button
                onClick={() => {
                  setStep(1);
                  setData({ identifier: "", otp: "" });
                  setCurrentUser(null);
                }}
                className="w-full text-sm text-gray-600  font-medium transition-colors"
              >
                ← Change phone number
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default IsLoadingHOC(Login);