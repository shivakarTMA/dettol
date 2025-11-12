import React from "react";
import { IoMdClose } from "react-icons/io";

const InstractionGuide = ({ show, onClose, pdfUrl }) => {
  if (!show) return null;

  // Append PDF parameters to hide toolbar, nav panes, etc.
  const sanitizedUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 bg-white rounded-lg w-[90%] md:w-[70%] h-[80%] z-50 max-w-[800px] mx-auto top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <button
          className="absolute top-[-15px] right-[-10px] text-2xl font-bold bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        <iframe
          src={sanitizedUrl}
          title="Guide PDF"
          className="w-full h-full rounded-b-lg"
        />
      </div>
    </>
  );
};

export default InstractionGuide;
