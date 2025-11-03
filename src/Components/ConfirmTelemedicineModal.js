import React from "react";
import checkIcon from "../Assests/Images/icons/check.svg";
import rejectIcon from "../Assests/Images/icons/reject.svg";
import confirmIcon from "../Assests/Images/icons/confirm.svg";

const ConfirmTelemedicineModal = ({
  isOpen,
  header,
  btnConfirm,
  btnCancel,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] shadow-lg lg:p-6 p-4 w-[95%] max-w-[450px]">
        <img src={confirmIcon} className={`lg:w-[50px] w-[35px] mx-auto`} alt="check" />
        <p className="text-center lg:text-[25px] text-[22px] mb-2 font-[500]">{header}</p>
        <p className="text-center lg:text-md text-[14px] mb-4 leading-normal">{message}</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={onCancel}
            className="bg-[#EFEFEF] text-black lg:px-4 px-3 lg:py-2 py-1 rounded-[5px] flex items-center lg:gap-2 gap-1 lg:text-md text-[14px]"
          >
            {btnCancel}
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#4D57EE] text-white lg:px-4 px-3 lg:py-2 py-1 rounded-[5px] flex items-center lg:gap-2 gap-1 lg:text-md text-[14px]"
          >
            {btnConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTelemedicineModal;
