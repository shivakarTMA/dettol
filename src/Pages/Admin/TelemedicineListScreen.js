import React, { useEffect, useState } from "react";
import { TbPhoneDone } from "react-icons/tb";
import ConfirmTelemedicineModal from "../../Components/ConfirmTelemedicineModal";
import searchIcon from "../../Assests/Images/icons/search.svg";
import { toast } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";
import { authAxios } from "../../Config/config";
import Tooltip from "../../Components/Common/Tooltip";

const TelemedicineListScreen = () => {
  const [telemedicine, setTelemedicine] = useState([]);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cardSearch, setCardSearch] = useState("");
  const [cardError, setCardError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const formatCardNumber = (cardNo) => {
    const str = cardNo.toString().padStart(16, "0");
    return `${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(
      8,
      12
    )}-${str.slice(12, 16)}`;
  };

  const fetchTelemedicineList = async (currentPage = page, search = "") => {
    try {
      const res = await authAxios().get("/telemedicine/list", {
        params: {
          page: currentPage,
          limit: rowsPerPage,
          search: search ? search : undefined,
        },
      });

      let data = res.data?.data || [];
      setTelemedicine(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch telemedicine");
    }
  };

  useEffect(() => {
    fetchTelemedicineList();
  }, []);

  const openModal = (studentId) => {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (!selectedStudentId) {
        toast.error("Student ID not found");
        return;
      }

      await authAxios().post("/telemedicine/create", {
        student_id: selectedStudentId,
      });

      toast.success("Call marked successfully!");

      fetchTelemedicineList(1, "");
      setModalOpen(false);
      setSelectedStudentId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to confirm call");
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedStudentId(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneSearch(value);

    if (!value) {
      setPhoneError("");
      fetchTelemedicineList(1, "");
      return;
    }

    if (value.length !== 10) {
      setPhoneError("Please enter 10 digits");
    } else {
      setPhoneError("");
      fetchTelemedicineList(1, value);
    }
  };
  const handleCardSearchChange = (e) => {
    let value = e.target.value.replace(/[^0-9-]/g, ""); // allow only digits & dashes
    let numericValue = value.replace(/-/g, ""); // remove dashes for processing

    // Format automatically as xxxx-xxxx-xxxx-xxxx
    if (numericValue.length > 0) {
      value = numericValue
        .substring(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1-")
        .slice(0, 19); // ensure format limit
    }

    setCardSearch(value);

    // Clear or validate
    if (!numericValue) {
      setCardError("");
      fetchTelemedicineList(1, "");
      return;
    }

    if (numericValue.length !== 16) {
      setCardError("Please enter 16 digits");
    } else {
      setCardError("");
      fetchTelemedicineList(1, numericValue); // pass plain digits to backend
    }
  };
  console.log(telemedicine, "telemedicine");

  return (
    <div>
      <div className="mb-4 flex justify-end  w-full">
        <div className="flex gap-2 max-w-[500px] w-full">
          {/* Phone Search */}
          <div className="relative w-full">
            <img src={searchIcon} className="absolute top-[13px] left-[15px]" />
            <input
              type="text"
              placeholder="Search by phone number"
              value={phoneSearch}
              onChange={handlePhoneChange}
              maxLength={10}
              className="pr-2 pl-[35px] py-2 rounded-full w-full"
            />
            {phoneError && (
              <span className="text-red-500 text-sm mt-1">{phoneError}</span>
            )}
          </div>
          {/* Card Search */}
          <div className="w-full">
            <div className="relative w-full">
              <img
                src={searchIcon}
                className="absolute top-[13px] left-[15px]"
              />
              <input
                type="text"
                placeholder="Search by card number"
                value={cardSearch}
                onChange={handleCardSearchChange}
                maxLength={19}
                className="pr-2 pl-[35px] py-2 rounded-full w-full"
              />
            </div>

            {cardError && (
              <span className="text-red-500 text-sm mt-1">{cardError}</span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th className="px-3 py-3 min-w-[120px]">Name</th>
                  <th className="px-3 py-3 min-w-[120px]">Parent Name</th>
                  <th className="px-3 py-3 min-w-[100px]">Gender</th>
                  <th className="px-3 py-3 min-w-[100px]">District</th>
                  <th className="px-3 py-3 min-w-[100px]">City</th>
                  <th className="px-3 py-3 min-w-[80px]">Age</th>
                  <th className="px-3 py-3 min-w-[80px]">Class</th>
                  <th className="px-3 py-3 min-w-[170px]">Card No.</th>
                  <th className="px-3 py-3 min-w-[120px] text-center">
                    Total Calls Done
                  </th>
                  <th className="px-3 py-3 min-w-[80px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {telemedicine.length > 0 ? (
                  telemedicine.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.name_en}</td>
                      <td className="px-3 py-3">{item?.parent_name_en}</td>
                      <td className="px-3 py-3">{item?.gender_en}</td>
                      <td className="px-3 py-3">{item?.district_en}</td>
                      <td className="px-3 py-3">{item?.city_en}</td>
                      <td className="px-3 py-3">{item?.age}</td>
                      <td className="px-3 py-3">{item?.class}</td>
                      <td className="px-3 py-3">
                        {formatCardNumber(item?.card_no)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.total_calls_done}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center">
                          <Tooltip
                            id={`tooltip-edit-${item.id}`}
                            content={`${item.total_calls_done > 3 ? 'Limit Exceeded' : 'Mark Call'}`}
                            place="left"
                          >
                            <div
                              className={`cursor-pointer w-5 ${
                                item.total_calls_done > 3
                                  ? "text-red-500 pointer-events-none"
                                  : ""
                              }`}
                              onClick={() => openModal(item?.id)}
                            >
                              <TbPhoneDone className="text-xl" />
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-4">
                      {cardSearch && cardSearch.length < 16
                        ? "Please enter 16 digits"
                        : "No data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        currentDataLength={telemedicine.length}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchTelemedicineList(newPage);
        }}
      />

      {/* Confirm Modal */}
      <ConfirmTelemedicineModal
        isOpen={modalOpen}
        header="Confirm Action"
        message="Are you sure you want to mark this call as done? Once confirmed, this action cannot be undone."
        btnConfirm="Mark as Done"
        btnCancel="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default TelemedicineListScreen;
