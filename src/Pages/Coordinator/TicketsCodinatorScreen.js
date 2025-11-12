import React, { useEffect, useState } from "react";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import replyIcon from "../../Assests/Images/icons/la_reply.svg";
import ReplyTicketModal from "../../Components/ReplyTicketModal";
import RaiseTicketModal from "../../Components/RaiseTicketModal";
import { toast } from "react-toastify";
import { IoTicketOutline } from "react-icons/io5";
import Tooltip from "../../Components/Common/Tooltip";
import { authAxios } from "../../Config/config";
import { formatStatus, formatWithTimeDate } from "../../Helper/helper";

const TicketsCodinatorScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [raiseTicketModal, setRaiseTicketModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  // Local states for ticket creation (no Formik)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
  });

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

  // ✅ Create ticket API
  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      const res = await authAxios().post("/ticket/create", {
        subject: newTicket.subject,
        message: newTicket.message,
      });

      toast.success("Ticket created successfully!");
      setNewTicket({ subject: "", message: "" });
      setRaiseTicketModal(false);
      fetchTicketList();
      console.log("Ticket Created:", res.data);
    } catch (err) {
      console.error("Error creating ticket:", err);
      toast.error("Failed to create ticket");
    }
  };

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
      <div className="flex gap-2 items-center mb-3">
        <button
          className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
          onClick={() => setRaiseTicketModal(true)}
        >
          <IoTicketOutline className="text-xl" />
          <span>Raise a ticket</span>
        </button>
      </div>

      <div className="bg-white custom--shodow rounded-[10px] p-3">
        <div className="rounded-[10px] overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th className="px-3 py-3 min-w-[100px]">Ticket ID</th>
                  <th className="px-3 py-3 min-w-[120px]">Subject</th>
                  <th className="px-3 py-3 min-w-[120px]">Request Date</th>
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

      {raiseTicketModal && (
        <RaiseTicketModal
          setRaiseTicketModal={setRaiseTicketModal}
          newTicket={newTicket}
          setNewTicket={setNewTicket}
          handleCreateTicket={handleCreateTicket}
        />
      )}
    </div>
  );
};

export default TicketsCodinatorScreen;
