import React, { useState } from "react";
import { GoStarFill } from "react-icons/go";

const SchoolwiseFeedbackListScreen = () => {
  const [schoolwiseFeedback, setSchoolwiseFeedback] = useState([
    {
      name: "LN PUBLIC SCHOOL",
      totalStudent: 146,
      feedback_submitted: 162,
      average_rating: 4.2,
    },
    {
      name: "MINILAND CONVENT SCHOOL",
      totalStudent: 163,
      feedback_submitted: 152,
      average_rating: 4.6,
    },
    {
      name: "DEWAN PUBLIC SCHOOL",
      totalStudent: 251,
      feedback_submitted: 186,
      average_rating: 4.0,
    },
    {
      name: "LITTLE FLOWER PUBLIC SCHOOL",
      totalStudent: 143,
      feedback_submitted: 128,
      average_rating: 3.9,
    },
  ]);

  const averageRating =
  schoolwiseFeedback.length > 0
    ? (
        schoolwiseFeedback.reduce((sum, item) => sum + item.rating, 0) /
        schoolwiseFeedback.length
      ).toFixed(1)
    : 0;

  return (
    <div>
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
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Feedback Submitted
                      </th>
                      <th className="px-3 py-3 min-w-[120px] text-center">
                        Average Rating Submitted
                      </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolwiseFeedback.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item.name}</td>
                        <td className="px-3 py-3 text-center">
                          {item.totalStudent}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.feedback_submitted}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {item.average_rating}
                        </td>
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

export default SchoolwiseFeedbackListScreen;
