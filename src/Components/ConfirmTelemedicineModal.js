import React from "react";

const ConfirmTelemedicineModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <p className="text-center mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[var(--primarycolor)] text-white px-4 py-2 rounded "
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTelemedicineModal;
