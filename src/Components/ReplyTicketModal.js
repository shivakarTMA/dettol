import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const ReplyTicketModal = ({ setShowModal, editingOption, formik }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Avinash Malhotra",
      type: "user",
      message:
        "Hello, I am unable to find the address of a student whose loyalty card number is 4567 7645 6472 65",
      time: "06 Nov, 2025, 11:34 am",
    },
    {
      id: 2,
      sender: "Admin",
      type: "admin",
      message:
        "Thanks for reaching us out, here is the complete address of this student.\nAddress: 110, XYZ road, Gorakhpur, Uttar Pradesh, India, 237142",
      time: "06 Nov, 2025, 12:55 am",
    },
    {
      id: 3,
      sender: "Avinash Malhotra",
      type: "user",
      message:
        "This address doesn’t seem to be correct, please verify and share the updated one.",
      time: "06 Nov, 2025, 11:34 am",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  // Send message function with validation and toast
  const handleSend = () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    const newMsg = {
      id: messages.length + 1,
      sender: "Admin",
      type: "admin",
      message: newMessage,
      time: new Date().toLocaleString(),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
    // toast.success("Message sent successfully.");
  };

  // Close modal only on mark buttons + toast
  const handleClose = (status) => {
    formik.resetForm();
    setShowModal(false);

    if (status === "closed") {
      toast.info("Ticket marked as closed.");
    } else if (status === "resolved") {
      toast.success("Ticket marked as resolved.");
    }
  };

  const getInitials = (name) => {
    const namesArray = name.trim().split(" ");
    if (namesArray.length === 1) {
      return namesArray[0].charAt(0).toUpperCase();
    } else {
      return (
        namesArray[0].charAt(0).toUpperCase() +
        namesArray[namesArray.length - 1].charAt(0).toUpperCase()
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => handleClose()}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px] shadow-lg">
            {/* Header */}
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                #TC-001 - Issue related to address
              </h3>
              <button
                className="text-2xl"
                onClick={() => handleClose()}
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>

            {/* Messages */}
            <div className="lg:px-5 px-3 lg:py-4 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`lg:pb-4 pb-3 flex flex-col ${
                    index === messages.length - 1
                      ? ""
                      : "border-b border-b-[#D4D4D4]"
                  } ${msg.type === "admin" ? "items-start" : "items-start"}`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-[500] ${
                        msg.type === "admin"
                          ? "bg-[#FFF9C6] text-[#847B00]"
                          : "bg-[#C8FFB9] text-[#008421]"
                      }`}
                    >
                      {getInitials(msg.sender)}
                    </div>
                    <div className="flex-1">
                      <div className="flex lg:flex-row flex-col lg:gap-2 lg:justify-between lg:items-center">
                        <p className="font-[500] lg:text-lg text-md">{msg.sender}</p>
                        <p className="text-xs text-gray-500">{msg.time}</p>
                      </div>
                      <p className="lg:mt-0 mt-1 text-gray-700 whitespace-pre-line lg:text-sm text-[14px]">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-5 pb-3 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FFF9C6] text-[#847B00] text-sm font-[500] flex items-center justify-center">
                A
              </div>
              <input
                type="text"
                placeholder="Your comment here"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-[#000] text-white lg:px-4 px-3 lg:py-2 py-[8px] rounded-[5px] lg:text-md text-[14px]"
              >
                Send
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 px-5 pb-4">
              <button
                onClick={() => handleClose("closed")}
                className="bg-[#F9EBEB] text-[#C70000] lg:px-4 px-2 lg:py-2 py-[8px] rounded-[5px] lg:text-md text-[14px] lg:w-auto w-full"
              >
                Mark as closed
              </button>
              <button
                onClick={() => handleClose("resolved")}
                className="bg-[#008421] text-white lg:px-4 px-2 lg:py-2 py-[8px] rounded-[5px] lg:text-md text-[14px] lg:w-auto w-full"
              >
                Mark as resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplyTicketModal;
