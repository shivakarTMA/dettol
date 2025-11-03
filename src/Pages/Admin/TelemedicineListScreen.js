import React, { useState } from "react";
import { TbPhoneDone } from "react-icons/tb";
import ConfirmTelemedicineModal from "../../Components/ConfirmTelemedicineModal";
import searchIcon from "../../Assests/Images/icons/search.svg";

const TelemedicineListScreen = () => {
  const [telemedicine, setTelemedicine] = useState([
    {
      name_en: "Shivsagar",
      phone: "9876543210",
      parent_name_en: "Suman",
      gender_en: "Male",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 13,
      class: 5,
      card_no: "6587752896350001",
      total_calls_done: 2,
    },
    {
      name_en: "Ansh Yadav",
      phone: "9876543211",
      parent_name_en: "Subash",
      gender_en: "Female",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 12,
      class: 5,
      card_no: "6587752896350002",
      total_calls_done: 3,
    },
    {
      name_en: "Anuska",
      phone: "9876543212",
      parent_name_en: "Sarita Devi",
      gender_en: "Male",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 10,
      class: 5,
      card_no: "6587752896350003",
      total_calls_done: 2,
    },
    {
      name_en: "Anshika",
      phone: "9776543210",
      parent_name_en: "Soniya",
      gender_en: "Female",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 9,
      class: 5,
      card_no: "6587752896350004",
      total_calls_done: 1,
    },
    {
      name_en: "Sivnya",
      phone: "9076543210",
      parent_name_en: "Nanina",
      gender_en: "Male",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 11,
      class: 5,
      card_no: "6587752896350005",
      total_calls_done: 0,
    },
    {
      name_en: "Anuska",
      phone: "9876543212",
      parent_name_en: "Gyanmati",
      gender_en: "Female",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 14,
      class: 5,
      card_no: "6587752896350006",
      total_calls_done: 1,
    },
    {
      name_en: "Anuska",
      phone: "9876543212",
      parent_name_en: "Sarita Devi",
      gender_en: "Male",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 8,
      class: 5,
      card_no: "6587752896350007",
      total_calls_done: 0,
    },
    {
      name_en: "Anshu Yadav",
      phone: "9876543212",
      parent_name_en: "Rita",
      gender_en: "Female",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 13,
      class: 5,
      card_no: "6587752896350008",
      total_calls_done: 0,
    },
    {
      name_en: "Ritika",
      phone: "9111143212",
      parent_name_en: "Ramrishi",
      gender_en: "Male",
      district_en: "Piprauli",
      city_en: "Gorakhpur",
      age: 12,
      class: 5,
      card_no: "6587752896350009",
      total_calls_done: 2,
    },
  ]);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cardSearch, setCardSearch] = useState("");
  const [cardError, setCardError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const formatCardNumber = (cardNo) => {
    const str = cardNo.toString().padStart(16, "0");
    return `${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(
      8,
      12
    )}-${str.slice(12, 16)}`;
  };

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      const updatedTelemedicine = [...telemedicine];
      updatedTelemedicine[selectedIndex].total_calls_done += 1;
      setTelemedicine(updatedTelemedicine);
    }
    setModalOpen(false);
    setSelectedIndex(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedIndex(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
    setPhoneSearch(value);

    if (value && value.length !== 10) {
      setPhoneError("Please enter 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleCardSearchChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // remove non-numeric chars
    setCardSearch(value);

    if (value && value.length < 16) {
      setCardError("Please enter 16 digits");
    } else {
      setCardError("");
    }
  };

  const filteredTelemedicine = telemedicine.filter((item) => {
    let matchesPhone = true;
    let matchesCard = true;

    // Exact match for phone if search is not empty
    if (phoneSearch) {
      matchesPhone = item.phone === phoneSearch.trim();
    }

    // Exact match for 12-digit card number
    if (cardSearch) {
      if (cardSearch.length === 16) {
        const cardDigits = item.card_no.replace(/-/g, "");
        matchesCard = cardDigits === cardSearch;
      } else {
        matchesCard = false;
      }
    }

    return matchesPhone && matchesCard;
  });

  return (
    <div>
      <div className="mb-4 flex gap-2 max-w-[500px] w-full">
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
            <img src={searchIcon} className="absolute top-[13px] left-[15px]" />
            <input
              type="text"
              placeholder="Search by card number"
              value={cardSearch}
              onChange={handleCardSearchChange}
              maxLength={16}
              className="pr-2 pl-[35px] py-2 rounded-full w-full"
            />
          </div>

          {cardError && (
            <span className="text-red-500 text-sm mt-1">{cardError}</span>
          )}
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
                  <th className="px-3 py-3 min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTelemedicine.length > 0 ? (
                  filteredTelemedicine.map((item, index) => (
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
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <div
                            className={`cursor-pointer w-5 ${
                              item.total_calls_done > 3
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            onClick={() => openModal(index)}
                          >
                            <TbPhoneDone className="text-xl" />
                          </div>
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

      {/* Confirm Modal */}
      <ConfirmTelemedicineModal
        isOpen={modalOpen}
        message="Are you sure you want to mark this call as done?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default TelemedicineListScreen;
