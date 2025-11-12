import React, { useEffect, useState } from "react";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import replyIcon from "../../Assests/Images/icons/la_reply.svg";
import ReplyTicketModal from "../../Components/ReplyTicketModal";
import { toast } from "react-toastify";
import Tooltip from "../../Components/Common/Tooltip";
import { authAxios } from "../../Config/config";
import { formatStatus, formatWithTimeDate } from "../../Helper/helper";

const TicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  // Fetch all tickets
  const fetchTicketList = async () => {
    try {
      const res = await authAxios().get("/ticket/list");
      setTickets(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tickets");
    }
  };

  useEffect(() => {
    fetchTicketList();
  }, []);

// Update ticket status to resolved (local change)
  const handleMarkResolved = async (ticketId) => {
    try {
      // ✅ Call API to mark ticket as resolved
      const res = await authAxios().put(`/ticket/resolved/${ticketId}`);

      // ✅ Update UI instantly
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: "RESOLVED" } : ticket
        )
      );

      setShowModal(false);
      toast.success("Ticket marked as resolved successfully!");
      console.log("✅ Ticket resolved response:", res.data);
    } catch (err) {
      console.error("❌ Failed to mark ticket resolved:", err);
      toast.error("Failed to mark ticket as resolved.");
    }
  };

  return (
    <div>
      <div className="bg-white custom--shodow rounded-[10px] p-3">
        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th className="px-3 py-3 min-w-[100px]">Ticket ID</th>
                  <th className="px-3 py-3 min-w-[120px]">Subject</th>
                  <th className="px-3 py-3 min-w-[120px]">Request Date</th>
                  <th className="px-3 py-3 min-w-[120px]">Raised By</th>
                  <th className="px-3 py-3 min-w-[120px] text-center">
                    Status
                  </th>
                  <th className="px-3 py-3">Action</th>
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
                      <td className="px-3 py-3">{item?.id}</td>
                      <td className="px-3 py-3">{item?.subject}</td>
                      <td className="px-3 py-3">
                        {formatWithTimeDate(item?.createdAt)}
                      </td>
                      <td className="px-3 py-3">{item?.staff_name}</td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`mx-auto block w-fit px-3 py-1 rounded-full capitalize ${
                            item.status === "OPEN"
                              ? "bg-[#EBF8F9] text-[#0092C7]"
                              : item.status === "RESOLVED"
                              ? "bg-[#EBF9F1] text-[#1F9254]"
                              : "bg-[#F9F2EB] text-[#C78100]"
                          }`}
                        >
                          {formatStatus(item.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Tooltip
                          id={`tooltip-${item.id}`}
                          content={
                            item.status === "RESOLVED" ? "View" : "Reply"
                          }
                          place="left"
                        >
                          <div
                            className="cursor-pointer w-8"
                            onClick={() => {
                              setEditingOption(item);
                              setShowModal(true);
                            }}
                          >
                            <img
                              src={
                                item.status === "RESOLVED"
                                  ? viewIcon
                                  : replyIcon
                              }
                              alt="view"
                              className="w-full"
                            />
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ReplyTicketModal
          setShowModal={setShowModal}
          editingOption={editingOption}
          handleMarkResolved={handleMarkResolved}
        />
      )}
    </div>
  );
};

export default TicketsScreen;
