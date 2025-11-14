import React, { useEffect, useState } from "react";
import Select from "react-select";
import { customStyles } from "../../Helper/helper";
import { toast } from "react-toastify";
import { authAxios } from "../../Config/config";
import Pagination from "../../Components/Common/Pagination";

const milestoneOptions = [
  { value: "Milestone 1", label: "Milestone 1" },
  { value: "Milestone 2", label: "Milestone 2" },
  { value: "Milestone 3", label: "Milestone 3" },
  { value: "Milestone 4", label: "Milestone 4" },
  { value: "Milestone 5", label: "Milestone 5" },
  { value: "Milestone 6", label: "Milestone 6" },
  { value: "Milestone 7", label: "Milestone 7" },
  { value: "Milestone 8", label: "Milestone 8" },
  { value: "Milestone 9", label: "Milestone 9" },
  { value: "Milestone 10", label: "Milestone 10" },
  { value: "Milestone 11", label: "Milestone 11" },
  { value: "Milestone 12", label: "Milestone 12" },
];

const SchoolWiseMilestonesListScreen = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(
    milestoneOptions[0]
  );
  const [schoolWiseMilestones, setSchoolWiseMilestones] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSchoolMilestonesList = async (currentPage = page) => {
    let params = {
      page: currentPage,
      limit: rowsPerPage,
      milestone_name: selectedMilestone.value,
    };

    try {
      const res = await authAxios().get("/dashboard/school/milestone/list", {
        params,
      });

      let data = res.data?.data || [];

      setSchoolWiseMilestones(data);
      setPage(currentPage);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch milestone");
    }
  };

  useEffect(() => {
    fetchSchoolMilestonesList(1);
  }, [selectedMilestone]);

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
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Total Students
                    </th>
                    <th className="px-3 py-3 text-center">Male</th>
                    <th className="px-3 py-3 text-center">Female</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolWiseMilestones.length > 0 ? (
                    schoolWiseMilestones.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.school_name}</td>
                        <td className="px-3 py-3 text-center">
                          {item?.total_student_count}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.male_count}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item?.female_count}
                        </td>
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
        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={schoolWiseMilestones.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSchoolMilestonesList(newPage);
          }}
        />
      </div>
    </div>
  );
};

export default SchoolWiseMilestonesListScreen;
