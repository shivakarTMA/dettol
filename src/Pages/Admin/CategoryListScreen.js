import React, { useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import EditCategoryModal from "../../Components/EditCategoryModal";

const CategoryListScreen = () => {
  const [categories, setCategories] = useState([
    {
      category_id: "CAT01",
      name_en: "Personal Hygiene",
      name_in: "व्यक्तिगत स्वच्छता",
      sort_order: "1",
    },
    {
      category_id: "CAT01",
      name_en: "Personal Hygiene",
      name_in: "व्यक्तिगत स्वच्छता",
      sort_order: "2",
    },
    {
      category_id: "CAT01",
      name_en: "Personal Hygiene",
      name_in: "व्यक्तिगत स्वच्छता",
      sort_order: "3",
    },
    {
      category_id: "CAT01",
      name_en: "Personal Hygiene",
      name_in: "व्यक्तिगत स्वच्छता",
      sort_order: "4",
    },
    {
      category_id: "CAT01",
      name_en: "Personal Hygiene",
      name_in: "व्यक्तिगत स्वच्छता",
      sort_order: "5",
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
                    <th className="px-3 py-3 min-w-[120px]">Name (English)</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Name (Hindi)
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Order
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.category_id}</td>
                      <td className="px-3 py-3">{item.name_en}</td>
                      <td className="px-3 py-3 text-center">
                        {item.name_in}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.sort_order}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <div
                            className="cursor-pointer w-5"
                            onClick={() => handleEdit(item)}
                          >
                            <img src={editIcon} alt="view" className="w-full" />
                          </div>
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
          <EditCategoryModal
            school={selectedCategory}
            setSchool={setSelectedCategory}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryListScreen;
