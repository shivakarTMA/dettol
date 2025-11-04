import React, { useEffect, useState } from "react";
import { GoStarFill } from "react-icons/go";
import { toast } from "react-toastify";
import { authAxios } from "../../Config/config";
import { formatDate } from "../../Helper/helper";

const StudentFeedbackListScreen = () => {
  const [studentFeedback, setStudentFeedback] = useState([]);

  const fetchUserManagement = async () => {
    try {
      const res = await authAxios().get("/student/feedbaclk/list");

      let data = res.data?.data || [];
      setStudentFeedback(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch student feedback");
    }
  };

  useEffect(() => {
    fetchUserManagement();
  }, []);

  const averageRating =
  studentFeedback.length > 0
    ? (
        studentFeedback.reduce((sum, item) => sum + item.rating, 0) /
        studentFeedback.length
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
                    <th className="px-3 py-3 min-w-[120px]">Student Name</th>
                    <th className="px-3 py-3 min-w-[120px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">Rating</th>
                    <th className="px-3 py-3 min-w-[250px]">Comments</th>
                    <th className="px-3 py-3 min-w-[110px]">Submitted At</th>
                  </tr>
                </thead>
                <tbody>

                  {studentFeedback.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    studentFeedback.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.student_name_en}</td>
                        <td className="px-3 py-3">{item?.school_name}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-[2px]">
                            {Array.from({ length: item?.rating }, (_, i) => (
                              <GoStarFill key={i} className="text-yellow-500" />
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3">{item?.comment}</td>
                        <td className="px-3 py-3">{formatDate(item.created_at)}</td>
                      </tr>
                    ))
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

export default StudentFeedbackListScreen;
