import React, { useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import { FaPlus } from "react-icons/fa";
import EditSpinAwardsModal from "../../Components/EditSpinAwardsModal";

const taskList = [
  {
    reward_id:"AWD01",
    Award_name_en: "Jackpot (1-Year Supply of Dettol Soaps)",
    award_description_en: [
      "Congratulations! You’ve hit the Jackpot!",
      "You’ve won a 1-year supply of Dettol Soaps.",
      "You’ll receive it along with your milestone rewards.",
    ],
    Award_Image: "",
    Order: 1,
    Stop: true,
  },
  {
    reward_id:"AWD02",
    Award_name_en: "Extra Chance",
    award_description_en: [
      "You’ve earned an extra spin!",
      "Try your luck again.",
      "More spins mean more rewards!",
    ],
    Award_Image: "",
    Order: 2,
    Stop: true,
  },
  {
    reward_id:"AWD03",
    Award_name_en: "Digital Badge",
    award_description_en: [
      "Great job spinning your way to victory!",
      "Your digital badge has been added to your collection.",
      "You can use it from your profile section.",
    ],
    Award_Image: "",
    Order: 3,
    Stop: false,
  },
  {
    reward_id:"AWD04",
    Award_name_en: "Dettol Soap",
    award_description_en: [
      "You’ve won a Dettol Soap!",
      "Keep your hygiene strong every day.",
      "You will get it along with your milestone rewards.",
    ],
    Award_Image: "",
    Order: 4,
    Stop: true,
  },
  {
    reward_id:"AWD05",
    Award_name_en: "Clean Coins ×5",
    award_description_en: [
      "You’ve earned 5× Swachh Coins!",
      "Keep collecting and level up faster.",
      "Bigger rewards are waiting for you!",
    ],
    Award_Image: "",
    Order: 5,
    Stop: false,
  },
  {
    reward_id:"AWD06",
    Award_name_en: "Clean Coins ×10",
    award_description_en: [
      "You’ve earned 10× Swachh Coins!",
      "Keep collecting and level up faster.",
      "Bigger rewards are waiting for you!",
    ],
    Award_Image: "",
    Order: 6,
    Stop: true,
  },
];

const SpinAwardsScreen = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleEdit = (school) => {
    setSelectedCategory(school);
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">Award Name</th>
                    <th className="px-3 py-3 min-w-[150px]">
                      Award Description
                    </th>
                    <th className="px-3 py-3 min-w-[150px]">Award Image</th>
                    <th className="px-3 py-3 min-w-[150px]">Order</th>
                    <th className="px-3 py-3 min-w-[150px]">Stop</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.Award_name_en}</td>
                      <td className="px-3 py-3">
                        <ul className="list-disc pl-[15px]">
                          {item.award_description_en &&
                            item.award_description_en.map((desc, i) => (
                              <li key={i}>{desc}</li>
                            ))}
                        </ul>
                      </td>
                      <td className="px-3 py-3">{item.Award_Image ? item.Award_Image : '--'}</td>
                      <td className="px-3 py-3">{item.Order}</td>
                      <td className="px-3 py-3">
                        <span
                            className={` block w-fit px-3 py-1 rounded-full capitalize ${
                              item.Stop === true ? "bg-green-200" : ""
                            } ${item.Stop === false ? "bg-gray-200" : ""}
                            `}
                          >
                            {item.Stop === true ? "Yes" : "No"}
                          </span>
                      </td>
                      <td className="px-3 py-3">
                        <div
                          className="cursor-pointer w-6"
                          onClick={() => handleEdit(item)}
                        >
                          <img src={editIcon} alt="view" className="w-full" />
                        </div>
                      </td>
                    </tr>
                  ))}
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
          currentDataLength={taskList.length}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditSpinAwardsModal
          school={selectedCategory}
          setSchool={setSelectedCategory}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default SpinAwardsScreen;
