import React, { useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import deleteIcon from "../../Assests/Images/icons/delete.svg";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import EditUserManagementModal from "../../Components/EditUserManagementModal";
import { formatRole } from "../../Helper/helper";

const UserManagementScreen = () => {
  const [userManagement, setUserManagement] = useState([
    {
      user_id: "USER_001",
      name: "Ankit Sharma",
      Mobile_No: "9875485456",
      role: "COORDINATOR",
      report_to: "PROJECT_MANAGER",
    },
    {
      user_id: "USER_002",
      name: "Kapil Gupta",
      Mobile_No: "9866515854",
      role: "COORDINATOR",
      report_to: "PROJECT_MANAGER",
    },
    {
      user_id: "USER_003",
      name: "Naveen Kapoor",
      Mobile_No: "9987554487",
      role: "PROJECT_MANAGER",
      report_to: "ADMIN",
    },
    {
      user_id: "USER_004",
      name: "Nitin Sehgal",
      Mobile_No: "84488 90344",
      role: "LEADERSHIP",
      report_to: "ADMIN",
    },
    {
      user_id: "USER_005",
      name: "Saurabh Singh",
      Mobile_No: "7518732597",
      role: "TELEMEDICINE",
      report_to: "ADMIN",
    },
  ]);

  // Edit & Delete states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Open edit modal
  const handleEdit = (school) => {
    setSelectedSchool(school);
    setEditModalOpen(true);
  };

  // Save edited school
  const handleSaveEdit = () => {
    setUserManagement((prev) =>
      prev.map((s) =>
        s.user_id === selectedSchool.user_id ? selectedSchool : s
      )
    );
    setEditModalOpen(false);
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
                    <th className="px-3 py-3 min-w-[100px]">User Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Mobile Number</th>
                    <th className="px-3 py-3 min-w-[120px]">Role</th>
                    <th className="px-3 py-3 min-w-[120px]">Reports To</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userManagement.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3">{item.Mobile_No}</td>
                      <td className="px-3 py-3">{formatRole(item.role)}</td>
                      <td className="px-3 py-3">{formatRole(item.report_to)}</td>
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
          <EditUserManagementModal
            school={selectedSchool}
            setSchool={setSelectedSchool}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementScreen;
