import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { authAxios } from "../Config/config";
import { formatWithTimeDate } from "../Helper/helper";
import { useSelector } from "react-redux";

const ReplyTicketModal = ({
  setShowModal,
  editingOption,
  handleMarkResolved,
}) => {
  const { userType } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);

  // ✅ Fetch all messages for the ticket
  const fetchChatByID = async () => {
    try {
      const res = await authAxios().get(`/ticket/detail/${editingOption.id}`);
      const data = res.data?.data || [];
      setMessages(data);

      if (data.length > 0) setTicketInfo(data[0]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch ticket details");
    }
  };

  useEffect(() => {
    if (editingOption?.id) {
      fetchChatByID();
    }
  }, [editingOption]);

  // ✅ Send reply using last message's ID as parent_id
  const handleSend = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (messages.length === 0) {
      toast.error("Cannot send reply, no messages found for this ticket");
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const parentId = lastMessage?.id;

    const payload = {
      parent_id: parentId,
      message: newMessage,
    };

    console.log("📤 Sending reply payload:", payload); // ✅ Log the payload

    try {
      await authAxios().post("/ticket/reply", payload);

      toast.success("Reply sent successfully!");
      setNewMessage("");
      await fetchChatByID(); // ✅ Refresh chat after sending reply
      // 🚫 Do NOT close modal (you asked to keep it open)
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowModal(false)}
      ></div>

      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[800px] mx-auto">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px] shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
              <h3 className="text-lg font-semibold">
                {ticketInfo?.ticket_no || editingOption?.ticket_no} -{" "}
                {ticketInfo?.subject || editingOption?.subject}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-2xl">
                <IoMdClose />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages found.</p>
              ) : (
                messages.map((msg,index) => {
                  const isAdmin = msg.is_reply;
                  const senderName = isAdmin
                    ? msg.replyed_staff_name || "Admin"
                    : msg.ticket_raised_staff_name || "User";

                  return (
                    <div key={msg.id} className={`flex gap-3 items-start pb-4 ${index !== messages.length - 1 ? 'border-b border-b-[#D4D4D4]' : ''}`}>
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-[500] ${
                          msg?.replyed_staff_role === "ADMIN"
                            ? "bg-[#FFF9C6] text-[#847B00]"
                            : "bg-[#C8FFB9] text-[#008421]"
                        }`}
                      >
                        {getInitials(senderName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{senderName}</p>
                          <p className="text-xs text-gray-500">
                            {formatWithTimeDate(msg.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Input + Actions */}
            {editingOption?.status !== "RESOLVED" && (
              <>
                <div className="px-5 pb-3 flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Your comment here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-black text-white px-4 py-2 rounded-md"
                  >
                    Send
                  </button>
                </div>

                {userType === "ADMIN" && (
                  <div className="flex justify-end gap-2 px-5 pb-4">
                    <button
                      onClick={() => handleMarkResolved(editingOption?.id)}
                      className="bg-[#008421] text-white px-4 py-2 rounded-md"
                    >
                      Mark as resolved
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplyTicketModal;
