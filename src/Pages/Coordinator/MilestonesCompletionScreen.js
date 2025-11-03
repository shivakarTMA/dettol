import React, { useState } from "react"; // Import React hooks
import viewIcon from "../../Assests/Images/icons/view.svg";
import shippingIcon from "../../Assests/Images/icons/shipping.svg";
import MilestonePopup from "../../Components/MilestonePopup";

const milestoneDetailsSample = {
  studentName: "Name of Student",
  phone: "+91 9876543210",
  address: "110, Gandhi nagar, Gorakhpur, Uttar Pradesh, 123456",
  milestoneTitle: "Milestone 3",
  verificationPending: true,
  tasks: [
    {
      id: 1,
      text: "Wash hands with soap for at least 20 seconds",
      completed: true,
      action: null,
    },
    {
      id: 2,
      text: "Use tissues for blowing nose and dispose properly",
      completed: true,
      action: null,
    },
    {
      id: 3,
      text: "Avoid sharing spoon/plate while eating food with classmates",
      completed: true,
      action: null,
    },
    {
      id: 4,
      text: "Use personal water bottle instead of drinking fountains",
      completed: false,
      action: null,
    },
    {
      id: 5,
      text: "Wipe down shared computer keyboards before use",
      completed: false,
      action: null,
    },
  ],
};

const MilestonesCompletionScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const milestonesSummary = [
    {
      name: "Student 1",
      school: "LN PUBLIC SCHOOL",
      reward: "Milestone 1",
      status: "shipped",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 2",
      school: "MINILAND CONVENT SCHOOL",
      reward: "Milestone 3 + 1 dettol soap",
      status: "in route",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 3",
      school: "DEWAN PUBLIC SCHOOL",
      reward: "Milestone 2",
      status: "in route",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
    {
      name: "Student 4",
      school: "LITTLE FLOWER PUBLIC SCHOOL",
      reward: "Milestone 2 + 3 dettol soap",
      status: "shipped",
      address: "Garh road, Gorakhpur",
      details: milestoneDetailsSample,
    },
  ];


  const handleViewClick = (milestone) => {
    setSelectedMilestone(milestone.details);
    setIsModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="bg-white custom--shodow rounded-[10px] p-2">
          <div className="sm:hidden block space-y-2">
            {milestonesSummary.map((item, index) => (
              <div
                key={index}
                className="border border-[#D4D4D4] p-[10px] rounded-[10px]"
              >
                <div className="flex gap-2 items-start justify-between">
                  <div>
                    <span
                      className={` text-sm block w-fit px-3 py-1 rounded-full capitalize ${
                        item.status === "shipped"
                          ? "bg-[#F9F2EB] text-[#C78100]"
                          : ""
                      } ${item.status === "delivered" ? "bg-green-200" : ""}
                            ${
                              item.status === "in route"
                                ? "bg-[#EBF9F1] text-[#1F9254]"
                                : ""
                            }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-nowrap gap-1 w-full items-center">
                      <div
                        className="bg-[#4D57EE] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center cursor-pointer p-[6px]"
                        onClick={() => handleViewClick(item)}
                      >
                        <img
                          src={viewIcon}
                          alt="view"
                          className="w-full brightness-[0] invert-[1]"
                        />
                      </div>
                      <div
                        className={`bg-[#4D57EE] border border-[#D4D4D4] rounded-[5px] w-8 h-8 flex items-center justify-center p-[8px]
    ${
      item.status === "in route"
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }`}
                      >
                        <img
                          src={shippingIcon}
                          alt="view"
                          className="w-full brightness-[0] invert-[1]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="text-black font-semibold text-lg">
                    {item.name}
                  </h2>
                  <h3 className="text-black text-sm">{item.school}</h3>

                  <p className="text-[#6F6F6F] text-sm">{item.address}</p>

                  <div className="bg-[#EAEAEA] rounded-[5px] p-[8px] mt-2">
                    <p className="text-black text-sm">
                      <span className="font-[500]">Reward</span> : {item.reward}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] overflow-hidden sm:block hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[120px]">Name</th>
                    <th className="px-3 py-3 min-w-[170px]">School Name</th>
                    <th className="px-3 py-3 min-w-[170px]">Address</th>
                    <th className="px-3 py-3 min-w-[120px]">Reward Status</th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3 min-w-[120px]">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {milestonesSummary.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3">{item.school}</td>
                      <td className="px-3 py-3">{item.address}</td>
                      <td className="px-3 py-3">{item.reward}</td>
                      <td className="px-3 py-3">
                        <span
                          className={` block w-fit px-3 py-1 rounded-full capitalize ${
                            item.status === "shipped"
                              ? "bg-[#F9F2EB] text-[#C78100]"
                              : ""
                          } ${item.status === "delivered" ? "bg-green-200" : ""}
                            ${
                              item.status === "in route"
                                ? "bg-[#EBF9F1] text-[#1F9254]"
                                : ""
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-nowrap w-full items-center">
                          <div
                            className="bg-[#F1F1F1] border border-[#D4D4D4] rounded-l-[5px] w-9 h-8 flex items-center justify-center cursor-pointer p-[6px]"
                            onClick={() => handleViewClick(item)}
                          >
                            <img src={viewIcon} alt="view" className="w-full" />
                          </div>
                          <div
                            className={`bg-[#F1F1F1] border border-[#D4D4D4] rounded-r-[5px] w-9 h-8 flex items-center justify-center p-[8px]
                                ${
                                  item.status === "in route"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                          >
                            <img
                              src={shippingIcon}
                              alt="view"
                              className="w-full"
                            />
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
      </div>

      {selectedMilestone && (
        <MilestonePopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
        />
      )}
    </>
  );
};

export default MilestonesCompletionScreen;
