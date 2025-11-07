import React, { useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import EditLearnModuleModal from "../../Components/EditLearnModuleModal";
import { MdImage } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import Tooltip from "../../Components/Common/Tooltip";

const LearnModuleListScreen = () => {
  const [learnModule, setLearnModule] = useState([
    {
      File_Id: "PDF001",
      file_name_En: "Coping with Exam Stress",
      file_name_hi: "परीक्षा के तनाव से कैसे निपटें",
      File_en_url:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      File_hi_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
    },
    {
      File_Id: "PDF002",
      file_name_En: "How to Handle Exam Days?",
      file_name_hi: "परीक्षा के दिनों में क्या करें",
      File_en_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
      File_hi_url: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      File_Id: "PDF003",
      file_name_En: "Stress Management Exercise – Box Breathing",
      file_name_hi: "तनाव कम करने की कसरत – बॉक्स ब्रीदिंग",
      File_en_url: "https://www.africau.edu/images/default/sample.pdf",
      File_hi_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
    },
    {
      File_Id: "PDF004",
      file_name_En: "Smart Food for Exam Success!",
      file_name_hi: "परीक्षा में सफलता के लिए अच्छा खाना",
      File_en_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
      File_hi_url:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      File_Id: "PDF005",
      file_name_En: "Stress Management Exercise – The Mindful Breathing",
      file_name_hi: "तनाव कम करने की कसरत – माइंडफुल ब्रीदिंग",
      File_en_url:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      File_hi_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
    },
    {
      File_Id: "PDF006",
      file_name_En: "Find Your Best Way to Learn!",
      file_name_hi: "सीखने का अपना तरीका खोजो",
      File_en_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
      File_hi_url: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      File_Id: "PDF007",
      file_name_En: "What is Exam Stress?",
      file_name_hi: "परीक्षा का तनाव क्या है",
      File_en_url:
        "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-ladders-education-day_23-2149241014.jpg",
      File_hi_url: "https://www.africau.edu/images/default/sample.pdf",
    },
  ]);

  // Edit & Delete states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Open edit modal
  const handleEdit = (school) => {
    setSelectedCategory(school);
    setEditModalOpen(true);
  };

  return (
    <div>
      <div className="">
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">ID</th>
                    <th className="px-3 py-3 min-w-[120px]">File English</th>
                    <th className="px-3 py-3 min-w-[120px]">File HIndi</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      File English
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      File Hindi
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {learnModule.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item?.File_Id}</td>
                      <td className="px-3 py-3">{item?.file_name_En}</td>
                      <td className="px-3 py-3">{item?.file_name_hi}</td>
                      <td className="px-3 py-3 text-center">
                        {item.File_en_url ? (
                          <Link
                            to={item?.File_en_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline"
                          >
                            {item?.File_en_url.endsWith(".pdf") ? (
                              <FaFilePdf className="text-xl mx-auto" />
                            ) : (
                              <MdImage className="text-xl mx-auto" />
                            )}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item?.File_hi_url ? (
                          <Link
                            to={item?.File_hi_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline"
                          >
                            {item?.File_hi_url.endsWith(".pdf") ? (
                              <FaFilePdf className="text-xl mx-auto" />
                            ) : (
                              <MdImage className="text-xl mx-auto" />
                            )}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <Tooltip
                            id={`tooltip-edit-${item.id}`}
                            content="Edit Learn Module"
                            place="left"
                          >
                            <div
                              className="cursor-pointer w-5"
                              // onClick={() => {
                              //   setEditingOption(item?.id);
                              //   setShowModal(true);
                              // }}
                              onClick={() => handleEdit(item)}
                            >
                              <img
                                src={editIcon}
                                alt="view"
                                className="w-full"
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <EditLearnModuleModal
            school={selectedCategory}
            setSchool={setSelectedCategory}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LearnModuleListScreen;
