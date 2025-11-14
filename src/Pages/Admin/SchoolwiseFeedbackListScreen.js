import React, { useEffect, useState } from "react";
import { GoStarFill } from "react-icons/go";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";

const SchoolwiseFeedbackListScreen = () => {
  const [schoolwiseFeedback, setSchoolwiseFeedback] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSchoolFeedback = async (currentPage = page) => {
    try {
      const res = await authAxios().get("/dashboard/school/feedback/list", {
        params: {
          page: currentPage,
          limit: rowsPerPage,
        },
      });

      let data = res.data?.data || [];
      setSchoolwiseFeedback(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
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
        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={schoolwiseFeedback.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSchoolFeedback(newPage);
          }}
        />
      </div>
    </div>
  );
};

export default SchoolwiseFeedbackListScreen;
