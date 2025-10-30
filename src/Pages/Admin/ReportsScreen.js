import React, { useState } from "react";
import viewIcon from "../../Assests/Images/icons/view.svg";
import searchIcon from "../../Assests/Images/icons/search.svg";
import downloadIcon from "../../Assests/Images/icons/download-white.svg";
import Pagination from "../../Components/Common/Pagination";

const reportsSummary = [
  {
    name: "Esha",
    school: "LN PUBLIC SCHOOL",
    achieved_on: "01.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 1",
    status: "shipped",
  },
  {
    name: "Ria",
    school: "MINILAND CONVENT SCHOOL",
    achieved_on: "02.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 3 + 1 dettol soap",
    status: "in route",
  },
  {
    name: "Rohan",
    school: "DEWAN PUBLIC SCHOOL",
    achieved_on: "03.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 2",
    status: "delivered",
  },
  {
    name: "Palkit",
    school: "LITTLE FLOWER PUBLIC SCHOOL",
    achieved_on: "03.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 2 + 3 dettol soap",
    status: "shipped",
  },
  {
    name: "Rohan",
    school: "DEWAN PUBLIC SCHOOL",
    achieved_on: "03.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 2 + 3 dettol soap",
    status: "in route",
  },
  {
    name: "Nitin",
    school: "DEWAN PUBLIC SCHOOL",
    achieved_on: "03.09.2025",
    address: "Gorakhpur, UP",
    reward: "Milestone 2 + 3 dettol soap",
    status: "in route",
  },
];

const ReportsScreen = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    // Define CSV headers
    const headers = [
      "S.No.",
      "Name",
      "School Name",
      "Milestone Achieved On",
      "Reward Status",
      "Status",
    ];

    // Convert data array into CSV format
    const rows = reportsSummary.map((item, index) => [
      index + 1,
      item.name,
      item.school,
      item.achieved_on,
      item.reward,
      item.status,
    ]);

    // Combine headers and rows into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob for the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "Milestone_Reports.csv";

    // Append link, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <h3 className="text-lg font-semibold text-black">
            Milestones Achieved Summary
          </h3>

          <div className="flex gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-[250px]">
              <img
                src={searchIcon}
                className="absolute top-[13px] left-[15px]"
              />
              <input
                type="text"
                placeholder="Search"
                className="pr-2 pl-[35px] py-2 rounded-full w-full"
              />
            </div>
            <div
              className="bg-[#000000] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px]"
              onClick={handleDownloadCSV}
            >
              <img src={downloadIcon} className="w-[15px]" />
              <span className="text-white">Export</span>
            </div>
          </div>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">Name</th>
                    <th className="px-3 py-3 min-w-[120px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">
                      Milestone achieved on
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Reward Status</th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3 min-w-[120px]">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsSummary.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3">{item.school}</td>
                      <td className="px-3 py-3">{item.achieved_on}</td>
                      <td className="px-3 py-3">{item.reward}</td>
                      <td className="px-3 py-3">
                        <span
                          className={` block w-fit px-3 py-1 rounded-full capitalize ${
                            item.status === "shipped" ? "bg-yellow-200" : ""
                          } ${item.status === "delivered" ? "bg-green-200" : ""}
                            ${
                              item.status === "in route" ? "bg-orange-200" : ""
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div
                          className="cursor-pointer w-6"
                          // onClick={() => handleViewClick(item)}
                        >
                          <img src={viewIcon} alt="view" className="w-full" />
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
          currentDataLength={reportsSummary.length}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />
      </div>
    </div>
  );
};

export default ReportsScreen;
