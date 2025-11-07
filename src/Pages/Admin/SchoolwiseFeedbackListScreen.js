import React, { useEffect, useState } from "react";
import { GoStarFill } from "react-icons/go";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";

const SchoolwiseFeedbackListScreen = () => {
  const [schoolwiseFeedback, setSchoolwiseFeedback] = useState([]);

  const fetchSchoolFeedback = async () => {
    try {
      const res = await authAxios().get("/dashboard/school/feedback/list");

      let data = res.data?.data || [];
      setSchoolwiseFeedback(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employee feedback");
    }
  };

  useEffect(() => {
    fetchSchoolFeedback();
  }, []);

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
                      <td className="px-3 py-3">{item?.school_name}</td>
                      <td className="px-3 py-3 text-center">
                        {item?.total_student_count}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.feedback_submitted_count}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.average_rating}
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
