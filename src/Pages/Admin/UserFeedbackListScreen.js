import React, { useState } from "react";
import { GoStarFill } from "react-icons/go";

const UserFeedbackListScreen = () => {
  const [employeeFeedback, setEmployeeFeedback] = useState([
    {
      student_Id: "STU_00001",
      Student_name: "Nitin Sehgal",
      school_name:"Kendriya Vidyalaya No. 1 AFS Gorakhpur",
      rating: 3,
      comments: "Love the clean layout of the CRM. Easy to verify students!",
      submitted_at: "2025-10-23",
    },
    {
      student_Id: "STU_00002",
      Student_name: "Ankit Sharma",
      school_name:"Jawahar Navodaya Vidyalaya, Jungle Agahi, Peepiganj",
      rating: 4,
      comments: "Dashboard graphs look great. Please add export filters.",
      submitted_at: "2025-10-23",
    },
    {
      student_Id: "STU_00003",
      Student_name: "Anju Paliwal",
      school_name:"Government Jubilee Inter College, Buxipur",
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
                    <th className="px-3 py-3 min-w-[120px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Rating</th>
                    <th className="px-3 py-3 min-w-[250px]">Comments</th>
                    <th className="px-3 py-3 min-w-[110px]">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeFeedback.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.student_Id}</td>
                      <td className="px-3 py-3">{item.Student_name}</td>
                      <td className="px-3 py-3">{item.school_name}</td>
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

export default UserFeedbackListScreen;
