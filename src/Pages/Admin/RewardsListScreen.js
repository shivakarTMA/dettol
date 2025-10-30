import React, { useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import EditCategoryModal from "../../Components/EditCategoryModal";
import EditRewardModal from "../../Components/EditRewardModal";

const RewardsListScreen = () => {
  const [categories, setCategories] = useState([
    {
      reward_id: "RWD001",
      reward_name: "Clean Start Hygiene Bundle",
      reward_contents: "Soap x3, Posters x2",
      points_required: "100",
    },
    {
      reward_id: "RWD002",
      reward_name: "Wisdom in Reading",
      reward_contents: "Curriculum Book, Poster, Activity Sheet",
      points_required: "200",
    },
    {
      reward_id: "RWD003",
      reward_name: "Comic Collection",
      reward_contents: "2 Interactive Comics",
      points_required: "300",
    },
    {
      reward_id: "RWD004",
      reward_name: "Hygiene and Style Set",
      reward_contents: "Soap x3, Branded Cap",
      points_required: "400",
    },
    {
      reward_id: "RWD005",
      reward_name: "Back-to-School Gear",
      reward_contents: "School Backpack",
      points_required: "500",
    },
  ]);

  // Edit & Delete states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Open edit modal
  const handleEdit = (school) => {
    setSelectedCategory(school);
    setEditModalOpen(true);
  };

  return (
    <div>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">ID</th>
                    <th className="px-3 py-3 min-w-[120px]">Reward Name</th>
                    <th className="px-3 py-3 min-w-[120px]">
                      Reward Contents
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">
                      Points
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.reward_id}</td>
                      <td className="px-3 py-3">{item.reward_name}</td>
                      <td className="px-3 py-3">
                        {item.reward_contents}
                      </td>
                      <td className="px-3 py-3">
                        {item.points_required}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <div
                            className="cursor-pointer w-5"
                            onClick={() => handleEdit(item)}
                          >
                            <img src={editIcon} alt="view" className="w-full" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <EditRewardModal
            school={selectedCategory}
            setSchool={setSelectedCategory}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RewardsListScreen;
