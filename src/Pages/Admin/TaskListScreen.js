import React, { useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import { FaPlus } from "react-icons/fa";
import EditTaskModal from "../../Components/EditTaskModal";

const taskList = [
  {
    category_name: "Personal Hygiene",
    title: "Plant and care for community greenery",
    loyalty_points: 5,
  },
  {
    category_name: "During Illness",
    title:
      "Create and perform a hygiene-themed skit at a community center / neighbourhood event",
    loyalty_points: 5,
  },
  {
    category_name: "At Home",
    title: "Create poster on hygiene messages for proper waste disposal",
    loyalty_points: 5,
  },
  {
    category_name: "During Illness",
    title: "Design a hygiene board game to teach younger children",
    loyalty_points: 5,
  },
  {
    category_name: "During Illness",
    title: "Organise a “Hygiene Heroes” club at school or community center",
    loyalty_points: 5,
  },
  {
    category_name: "School Hygiene",
    title: "Design a hygiene board game to teach younger children",
    loyalty_points: 5,
  },
];

const TaskListScreen = () => {
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
                    <th className="px-3 py-3 min-w-[100px]">Category Name</th>
                    <th className="px-3 py-3 min-w-[150px]">Title</th>
                    <th className="px-3 py-3 min-w-[150px]">Loyalty Points</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.category_name}</td>
                      <td className="px-3 py-3">{item.title}</td>
                      <td className="px-3 py-3">{item.loyalty_points}</td>
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
        <EditTaskModal
          school={selectedCategory}
          setSchool={setSelectedCategory}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default TaskListScreen;
