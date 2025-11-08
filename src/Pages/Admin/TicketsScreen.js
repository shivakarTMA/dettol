import React, { useEffect, useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import replyIcon from "../../Assests/Images/icons/la_reply.svg";
import Pagination from "../../Components/Common/Pagination";
import ReplyTicketModal from "../../Components/ReplyTicketModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Tooltip from "../../Components/Common/Tooltip";

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Name English is required"),
  name_hi: Yup.string().required("Name Hindi is required"),
  address_en: Yup.string().required("Address English is required"),
  address_hi: Yup.string().required("Address Hindi is required"),
  city_en: Yup.string().required("City English is required"),
  city_hi: Yup.string().required("City Hindi is required"),
  pincode: Yup.number().required("Pincode is required"),
});

const ticketData = [
  {
    ticketId: "#TC-001",
    subject: "Issue related to address",
    requestDate: "06 Nov, 2025, 11:34 am",
    raisedBy: "Avinash Malhotra",
    status: "New",
  },
  {
    ticketId: "#TC-002",
    subject: "Need senior support",
    requestDate: "05 Nov, 2025, 10:52 am",
    raisedBy: "Suman Jain",
    status: "Resolved",
  },
  {
    ticketId: "#TC-003",
    subject: "No reward stock",
    requestDate: "04 Nov, 2025, 09:02 am",
    raisedBy: "Sharmila Tagore",
    status: "Closed",
  },
  {
    ticketId: "#TC-004",
    subject: "Others",
    requestDate: "03 Nov, 2025, 04:05 pm",
    raisedBy: "Rohan Bansal",
    status: "In Progress",
  },
];

const TicketsScreen = () => {
  const [tickets, setTickets] = useState(ticketData);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOption, setEditingOption] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSchoolList = async (search = searchTerm, currentPage = page) => {
    try {
      const res = await authAxios().get("/school/fetch/all", {
        params: {
          page: currentPage,
          limit: rowsPerPage,
          ...(search ? { search } : {}),
        },
      });

      let data = res.data?.data || [];
      // setTickets(data);
      setPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPage || 1);
      setTotalCount(res.data?.totalCount || data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch school");
    }
  };

  useEffect(() => {
    fetchSchoolList();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchSchoolList(searchTerm, 1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const formik = useFormik({
    initialValues: {
      name_en: "",
      address_en: "",
      district_en: "",
      city_en: "",
      name_hi: "",
      address_hi: "",
      district_hi: "",
      city_hi: "",
      pincode: "",
    },
    // validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      // try {
      //   const payload = { ...values };

      //   if (editingOption) {
      //     // Update
      //     await authAxios().put(`/school/update/${editingOption}`, payload);
      //     toast.success("Updated Successfully");
      //   } else {
      //     // Create
      //     await authAxios().post("/school/create", payload);
      //     toast.success("Created Successfully");
      //   }

      //   // 🔄 Re-fetch after save
      //   fetchSchoolList();
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Failed to save user");
      // }

      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  return (
    <div>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] p-3">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">Ticket ID</th>
                    <th className="px-3 py-3 min-w-[120px]">Subject</th>
                    <th className="px-3 py-3 min-w-[120px]">Request Date</th>
                    <th className="px-3 py-3 min-w-[120px]">Raised By</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Status</th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    tickets.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.ticketId}</td>
                        <td className="px-3 py-3">{item?.subject}</td>
                        <td className="px-3 py-3">{item?.requestDate}</td>
                        <td className="px-3 py-3">{item?.raisedBy}</td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`mx-auto block w-fit px-3 py-1 rounded-full capitalize ${
                              item.status === "New"
                                ? "bg-[#EBF8F9] text-[#0092C7]"
                                : ""
                            } ${
                              item.status === "Resolved"
                                ? "bg-[#EBF9F1] text-[#1F9254]"
                                : ""
                            } ${
                              item.status === "Closed"
                                ? "bg-[#F9EBEB] text-[#C70000]"
                                : ""
                            } ${
                              item.status === "In Progress"
                                ? "bg-[#F9F2EB] text-[#C78100]"
                                : ""
                            }
                            `}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content="Reply"
                              place="left"
                            >
                              <div
                                className="cursor-pointer w-8"
                                onClick={() => {
                                  setEditingOption(item?.id);
                                  setShowModal(true);
                                }}
                              >
                                <img
                                  src={replyIcon}
                                  alt="view"
                                  className="w-full"
                                />
                              </div>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={tickets.length}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchSchoolList(searchTerm, newPage);
          }}
        /> */}

        {/* Edit Modal */}
        {showModal && (
          <ReplyTicketModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default TicketsScreen;
