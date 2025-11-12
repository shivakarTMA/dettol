import React from "react";
import { IoMdClose } from "react-icons/io";
import Select from "react-select";
import { customStyles } from "../Helper/helper";

const RaiseTicketModal = ({
  setRaiseTicketModal,
  newTicket,
  setNewTicket,
  handleCreateTicket,
}) => {
  // ✅ Subject dropdown options
  const subjectOptions = [
    { value: "Issue related to address", label: "Issue related to address" },
    { value: "Need senior support", label: "Need senior support" },
    { value: "No reward stock", label: "No reward stock" },
    { value: "Others", label: "Others" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setRaiseTicketModal(false)}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-[20px] shadow-lg w-[400px] relative">
          <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
            <h3 className="text-lg font-semibold">Raise a Ticket</h3>
            {/* Close button */}
            <button
              className="text-2xl"
              onClick={() => setRaiseTicketModal(false)}
              aria-label="Close"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-3 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
            {/* ✅ Subject Dropdown */}
            <div>
              <label className="mb-2 block font-[500]">
                Select Subject<span className="text-red-500">*</span>
              </label>
              <Select
                options={subjectOptions}
                styles={customStyles}
                placeholder="Choose a subject"
                value={
                  subjectOptions.find(
                    (opt) => opt.value === newTicket.subject
                  ) || null
                }
                onChange={(selectedOption) =>
                  setNewTicket({
                    ...newTicket,
                    subject: selectedOption ? selectedOption.value : "",
                  })
                }
              />
            </div>

            {/* ✅ Message Field */}
            <div>
              <label className="mb-2 block font-[500]">
                Message<span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write your message here..."
                value={newTicket.message}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, message: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:border-[#008421]"
                rows={4}
              ></textarea>
            </div>

            {/* ✅ Submit Button */}
            <button
              onClick={handleCreateTicket}
              className="bg-[#008421] text-white px-4 py-2 rounded-md mt-2 hover:bg-[#006f1d] transition-all"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RaiseTicketModal;
