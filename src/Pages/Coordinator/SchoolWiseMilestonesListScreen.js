import React, { useEffect, useState } from "react";
import Select from "react-select";
import { customStyles } from "../../Helper/helper";
import { useLocation, useNavigate } from "react-router-dom";

const milestoneOptions = [
  { value: "milestone1", label: "Milestone 1" },
  { value: "milestone2", label: "Milestone 2" },
  { value: "milestone3", label: "Milestone 3" },
];

const SchoolWiseMilestonesListScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Helper to read query params
  const getMilestoneFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const milestone = params.get("milestone");
    return (
      milestoneOptions.find((opt) => opt.value === milestone) ||
      milestoneOptions[0]
    );
  };

  const [selectedMilestone, setSelectedMilestone] = useState(
    getMilestoneFromQuery()
  );
  const [schoolWiseMilestones, setSchoolWiseMilestones] = useState([
    {
      id: 1,
      name: "LN Public School",
      total: 52,
      male: 32,
      female: 20,
      milestone: "milestone1",
    },
    {
      id: 2,
      name: "Dewan Public School",
      total: 60,
      male: 38,
      female: 22,
      milestone: "milestone2",
    },
    {
      id: 3,
      name: "Miniland Convent School",
      total: 48,
      male: 30,
      female: 18,
      milestone: "milestone3",
    },
    {
      id: 4,
      name: "Little Flower Public School",
      total: 50,
      male: 25,
      female: 25,
      milestone: "milestone3",
    },
  ]);

  // ✅ When selectedMilestone changes, update the URL query param
  useEffect(() => {
    navigate(`?milestone=${selectedMilestone.value}`, { replace: true });
  }, [selectedMilestone, navigate]);

  // ✅ Filter data
  const filteredData = schoolWiseMilestones.filter(
    (item) => item.milestone === selectedMilestone.value
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select
          value={selectedMilestone}
          options={milestoneOptions}
          onChange={setSelectedMilestone}
          styles={customStyles}
          className="lg:min-w-[150px] min-w-[100px]"
        />
      </div>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Total Students</th>
                    <th className="px-3 py-3">Male</th>
                    <th className="px-3 py-3">Female</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3">{item.total}</td>
                        <td className="px-3 py-3">{item.male}</td>
                        <td className="px-3 py-3">{item.female}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-3 text-gray-500"
                      >
                        No data available for this milestone.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolWiseMilestonesListScreen;
