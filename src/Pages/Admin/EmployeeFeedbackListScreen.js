import React, { useState } from "react";
import { GoStarFill } from "react-icons/go";

const EmployeeFeedbackListScreen = () => {
  const [employeeFeedback, setEmployeeFeedback] = useState([
    {
      staff_id: "COD_001",
      Staff_name: "Nitin Sehgal",
      rating: 5,
      comments: "Love the clean layout of the CRM. Easy to verify students!",
      submitted_at: "2025-10-23",
    },
    {
      staff_id: "COD_002",
      Staff_name: "Ankit Sharma",
      rating: 4,
      comments: "Dashboard graphs look great. Please add export filters.",
      submitted_at: "2025-10-23",
    },
    {
      staff_id: "COD_003",
      Staff_name: "Anju Paliwal",
      rating: 3,
      comments: "Needs faster proof loading for video tasks.",
      submitted_at: "2025-10-24",
    },
  ]);

  const averageRating =
  employeeFeedback.length > 0
    ? (
        employeeFeedback.reduce((sum, item) => sum + item.rating, 0) /
        employeeFeedback.length
      ).toFixed(1)
    : 0;

  return (
    <div>
      <div className="">
        <div className="mb-4 flex items-center gap-2">
          <GoStarFill className="text-yellow-400 text-2xl" />
          <h2 className="text-lg font-semibold">
            Average Rating: {averageRating}
          </h2>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">ID</th>
                    <th className="px-3 py-3 min-w-[120px]">Staff Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Rating</th>
                    <th className="px-3 py-3 min-w-[250px]">Comments</th>
                    <th className="px-3 py-3 min-w-[110px]">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeFeedback.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.staff_id}</td>
                      <td className="px-3 py-3">{item.Staff_name}</td>
                      <td className="px-3 py-3">
                       <div className="flex gap-[2px]">
                         {Array.from({ length: item.rating }, (_, i) => (
                          <GoStarFill key={i} className="text-yellow-500" />
                        ))}
                       </div>
                      </td>
                      <td className="px-3 py-3">{item.comments}</td>
                      <td className="px-3 py-3">{item.submitted_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFeedbackListScreen;
