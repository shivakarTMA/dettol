import React, { useState } from "react";
import searchIcon from "../../Assests/Images/icons/search.svg";
import deleteIcon from "../../Assests/Images/icons/delete.svg";
import editIcon from "../../Assests/Images/icons/edit.svg";
import Pagination from "../../Components/Common/Pagination";
import EditSchoolModal from "../../Components/EditSchoolModal";

const SchoolsScreen = () => {
  const [schools, setSchools] = useState([
    {
      school_id: "GKP_001",
      name_en: "Kendriya Vidyalaya No. 1 AFS Gorakhpur",
      address_en: "New Project Air Force Station, Post Kusumi, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "केन्द्रीय विद्यालय संख्या 1 एएफएस गोरखपुर",
      address_hi: "न्यू प्रोजेक्ट एयर फोर्स स्टेशन, पोस्ट कुसुमी, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273002",
      students_enrolled: 10,
      students_registered: 20,
    },
    {
      school_id: "GKP_002",
      name_en: "Jawahar Navodaya Vidyalaya, Jungle Agahi, Peepiganj",
      address_en: "Jungle Agahi, Peepiganj, District Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "जवाहर नवोदय विद्यालय, जंगल अगही, पीपीगंज",
      address_hi: "जंगल अगही, पीपीगंज, जिला गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273165",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_003",
      name_en: "Government Jubilee Inter College, Buxipur",
      address_en: "Jubilee Road, Vindhyavasini Nagar, Buxipur, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "सरकारी जुबली इंटर कॉलेज, बक्सीपुर",
      address_hi: "जुबली रोड, विन्ध्यवासिनी नगर, बक्सीपुर, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273001",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_004",
      name_en: "Kendriya Vidyalaya – FCI Campus Gorakhpur",
      address_en: "FCI Campus, P.O. Fertilizer, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "केन्द्रीय विद्यालय – एफसीआई परिसर गोरखपुर",
      address_hi: "एफसीआई परिसर, पी.ओ. फर्टिलाइज़र, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273007",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_005",
      name_en: "Air Force School Gorakhpur",
      address_en: "Aksh Vihar, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "वायु सेना विद्यालय गोरखपुर",
      address_hi: "अक्ष विहार, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273002",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_006",
      name_en: "Army Public School, Kunraghat, Gorakhpur",
      address_en: "NH-28, Kunraghat, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "आर्मी पब्लिक स्कूल, कुर्नाघाट, गोरखपुर",
      address_hi: "एनएच-28, कुर्नाघाट, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273008",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_007",
      name_en: "Government School – Bhilora, Varanasi Road, Nausar",
      address_en: "Bhilora, Varanasi Road, Nausar, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "सरकारी विद्यालय – भिलोरा, वाराणसी रोड, नौसर",
      address_hi: "भिलोरा, वाराणसी रोड, नौसर, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273016",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_008",
      name_en: "Prathmik Vidyalaya Raipur, Dhudhara",
      address_en: "Raipur, Dhudhara, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "प्राथमिक विद्यालय रायपुर, धुधारा",
      address_hi: "रायपुर, धुधारा, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273407",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_009",
      name_en: "Gauri Manglpur Government School, Chanda",
      address_en: "Nauwa Doem, Chanda, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "गौरी मंग्लपुर सरकारी विद्यालय, चंदा",
      address_hi: "नऊवा डोम, चंदा, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273413",
      students_enrolled: 0,
      students_registered: 0,
    },
    {
      school_id: "GKP_010",
      name_en: "Bhaluwa Primary School, Pachowree",
      address_en: "Bhaluwa, Pachowree, Gorakhpur",
      city_en: "Gorakhpur",
      name_hi: "भलुवा प्राइमरी स्कूल, पचौवरी",
      address_hi: "भलुवा, पचौवरी, गोरखपुर",
      city_hi: "गोरखपुर",
      pincode: "273212",
      students_enrolled: 0,
      students_registered: 0,
    },
  ]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit & Delete states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Open edit modal
  const handleEdit = (school) => {
    setSelectedSchool(school);
    setEditModalOpen(true);
  };

  // Save edited school
  const handleSaveEdit = () => {
    setSchools((prev) =>
      prev.map((s) =>
        s.school_id === selectedSchool.school_id ? selectedSchool : s
      )
    );
    setEditModalOpen(false);
  };

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">

          <div className="flex gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-[250px]">
              <img
                src={searchIcon}
                className="absolute top-[13px] left-[15px]"
              />
              <input
                type="text"
                placeholder="Search"
                className="pr-2 pl-[35px] py-2 rounded-full w-full"
              />
            </div>
          </div>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[100px]">School Name</th>
                    <th className="px-3 py-3 min-w-[120px]">City</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Students Enrolled
                    </th>
                    <th className="px-3 py-3 min-w-[120px] text-center">
                      Students Registered
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-3">{item.name_en}</td>
                      <td className="px-3 py-3">{item.city_en}</td>
                      <td className="px-3 py-3 text-center">
                        {item.students_enrolled}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.students_registered}
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

        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          currentDataLength={schools.length}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />

        {/* Edit Modal */}
        {editModalOpen && (
          <EditSchoolModal
            school={selectedSchool}
            setSchool={setSelectedSchool}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )}

      </div>
    </div>
  );
};

export default SchoolsScreen;
