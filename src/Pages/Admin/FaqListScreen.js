import React, { useEffect, useState } from "react";
import editIcon from "../../Assests/Images/icons/edit.svg";
import viewIcon from "../../Assests/Images/icons/viewbox.svg";
import EditFaqModal from "../../Components/EditFaqModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsQuestionCircle } from "react-icons/bs";
import { formatCapitalText } from "../../Helper/helper";
import Tooltip from "../../Components/Common/Tooltip";
import { useSelector } from "react-redux";

const faqData = [
  {
    id: 1,
    category_en: "GENERAL & ELIGIBILITY",
    category_hi: "सामान्य और पात्रता",
    qa_en: "Who can join this Loyalty Card Program?",
    qa_hi: "इस लॉयल्टी कार्ड प्रोग्राम में कौन शामिल हो सकता है?",
    answer_en:
      "Kids just like YOU! In Gorakhpur, there are 5,000 awesome students from Dettol Banega Swasth India (DBSI) registered schools taking part.",
    answer_hi:
      "बच्चे जैसे तुम! गोरखपुर में Dettol Banega Swasth India (DBSI) के पंजीकृत स्कूलों से 5,000 शानदार छात्र इस कार्यक्रम में भाग ले रहे हैं।",
    position: 1,
    status: "ACTIVE",
  },
  {
    id: 2,
    category_en: "GENERAL & ELIGIBILITY",
    category_hi: "सामान्य और पात्रता",
    qa_en: "Do I need my parent’s permission to join?",
    qa_hi:
      "क्या मुझे शामिल होने के लिए अपने माता-पिता की अनुमति की आवश्यकता है?",
    answer_en:
      "Yes! You need your parent or guardian to say 'Yes!' before we can sign you up, track your points, or give rewards.",
    answer_hi:
      "हां! आपको हमारे द्वारा साइन अप करने, अंक ट्रैक करने या पुरस्कार देने से पहले अपने माता-पिता या अभिभावक से 'हां' कहना होगा।",
    position: 2,
    status: "ACTIVE",
  },
  {
    id: 3,
    category_en: "STARTING-UP",
    category_hi: "शुरुआत",
    qa_en: "What’s inside my Loyalty Card Box?",
    qa_hi: "मेरे लॉयल्टी कार्ड बॉक्स में क्या है?",
    answer_en:
      "Inside your special box, you’ll find:\n• Your very own loyalty card with a unique ID — it’s all yours!\n• A Welcome Letter to say 'Hello!'\n• An easy-to-read Instruction Manual / FAQs leaflet to help you understand the program\n• A colourful Flip card that tells you about the Government’s Swachh Bharat Mission and the Dettol Banega Swasth India journey since 2014!",
    answer_hi:
      "आपके विशेष बॉक्स में ये सब मिलेगा:\n• आपका अपना लॉयल्टी कार्ड जो एक अद्वितीय ID के साथ है — ये सब आपका है!\n• एक स्वागत पत्र 'नमस्ते!' कहने के लिए\n• एक आसान समझने वाला Instruction Manual / FAQs पंपलेट जो आपको प्रोग्राम समझने में मदद करेगा\n• एक रंगीन फ्लिप कार्ड जो आपको स्वच्छ भारत मिशन और Dettol Banega Swasth India के सफर के बारे में बताएगा!",
    position: 3,
    status: "ACTIVE",
  },
  {
    id: 5,
    category_en: "POINTS & ACTIONS",
    category_hi: "अंक और क्रियाएँ",
    qa_en: "How do I earn points?",
    qa_hi: "मैं अंक कैसे कमा सकता हूँ?",
    answer_en:
      "It’s simple — just be a Hygiene Hero! Complete fun hygiene tasks in five areas:\n• Personal Hygiene – Keep yourself clean\n• Hygiene at School – Help keep your classroom and school tidy\n• Hygiene During Illness – Stay safe and protect others when you’re unwell\n• Hygiene at Home – Keep your home clean and germ free\n• Hygiene in the Community – Spread cleanliness and good habits to others",
    answer_hi:
      "यह सरल है — बस एक स्वच्छता नायक बनें! पांच क्षेत्रों में मजेदार स्वच्छता कार्य पूरे करें:\n• व्यक्तिगत स्वच्छता – खुद को साफ रखें\n• स्कूल में स्वच्छता – अपनी कक्षा और स्कूल को साफ रखने में मदद करें\n• बीमारी के दौरान स्वच्छता – जब आप बीमार हों तो सुरक्षित रहें और दूसरों की सुरक्षा करें\n• घर में स्वच्छता – अपने घर को साफ और कीटाणु मुक्त रखें\n• समुदाय में स्वच्छता – दूसरों को स्वच्छता और अच्छे आदतों का प्रचार करें",
    position: 4,
    status: "ACTIVE",
  },
  {
    id: 6,
    category_en: "REWARDS & TARGETS",
    category_hi: "पुरस्कार और लक्ष्य",
    qa_en: "How do I unlock rewards?",
    qa_hi: "मैं पुरस्कार कैसे प्राप्त कर सकता हूँ?",
    answer_en:
      "It’s like a points treasure hunt! Every time you earn 100 points, you unlock 1 milestone. Each month, the fastest students to reach a milestone get that month’s reward. And guess what? The higher milestones you reach, the bigger and better the rewards become!",
    answer_hi:
      "यह एक अंकों का खजाना खोजने जैसा है! हर बार जब आप 100 अंक कमाते हैं, तो आप 1 माइलस्टोन अनलॉक करते हैं। हर महीने, सबसे तेज़ छात्र जो माइलस्टोन तक पहुँचते हैं, उन्हें उस महीने का पुरस्कार मिलता है। और अनुमान लगाइए क्या? जितने उच्च माइलस्टोन तक आप पहुँचेंगे, पुरस्कार उतने बड़े और बेहतर होंगे!",
    position: 5,
    status: "ACTIVE",
  },
  {
    id: 7,
    category_en: "ENROLLMENT REWARDS (FREE)",
    category_hi: "पंजीकरण पुरस्कार (निःशुल्क)",
    qa_en: "Do I get anything apart from prizes?",
    qa_hi: "क्या मुझे पुरस्कारों के अलावा कुछ मिलेगा?",
    answer_en:
      "Oh yes — lots of cool stuff just for joining! You get:\n• Four free doctor phone calls for you and your family\n• Tips for staying calm and stress-free before and during exams\n• Skip-the-line pass at the Dettol Hygiene Play Park in Gorakhpur\n• Easy access to Hygieia AI-based ChatBot and the Hygieia educational game to learn hygiene in a fun way!",
    answer_hi:
      "ओह हां — सिर्फ जुड़ने के लिए आपको बहुत सारी मजेदार चीजें मिलेंगी! आपको मिलेगा:\n• आपके और आपके परिवार के लिए चार मुफ्त डॉक्टर फोन कॉल\n• परीक्षा से पहले और दौरान शांत और तनावमुक्त रहने के टिप्स\n• गोरखपुर में Dettol Hygiene Play Park में लाइन में खड़े होने की सुविधा\n• Hygieia AI-आधारित ChatBot और Hygieia शैक्षिक खेल तक आसान पहुंच, जिससे आप मजेदार तरीके से स्वच्छता सीख सकते हैं!",
    position: 6,
    status: "ACTIVE",
  },
  {
    id: 8,
    category_en: "SUPPORT & ISSUES",
    category_hi: "सहायता और समस्याएँ",
    qa_en: "How do I get help with the program?",
    qa_hi: "मैं इस कार्यक्रम में मदद कैसे प्राप्त कर सकता हूँ?",
    answer_en:
      "If you’re stuck or have a question, ask your school’s Dettol Banega Swasth India (DBSI) coordinator.",
    answer_hi:
      "अगर आप अटक गए हैं या कोई सवाल है, तो अपने स्कूल के Dettol Banega Swasth India (DBSI) समन्वयक से पूछें।",
    position: 7,
    status: "ACTIVE",
  },
];

const validationSchema = Yup.object().shape({
  category_en: Yup.string().required("Category English is required"),
  qa_en: Yup.string().required("Question English is required"),
  qa_hi: Yup.string().required("Question Hindi is required"),
  answer_en: Yup.string().required("Answer English is required"),
  answer_hi: Yup.string().required("Answer Hindi is required"),
  position: Yup.string().required("Position is required"),
});


const FaqListScreen = () => {
  const { userType } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState(faqData);

  const [editingOption, setEditingOption] = useState(null);

  const fetchCategoryList = async () => {
    try {
      const res = await authAxios().get("/category/fetch/all");

      let data = res.data?.data || [];
      // setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch category");
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const formik = useFormik({
    initialValues: {
      category_en: "",
      category_hi: "",
      qa_en: "",
      qa_hi: "",
      answer_en: "",
      answer_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      // try {
      //   const payload = { ...values };

      //   if (editingOption) {
      //     // Update
      //     await authAxios().put(`/category/update/${editingOption}`, payload);
      //     toast.success("Updated Successfully");
      //   } else {
      //     // Create
      //     await authAxios().post("/category/create", payload);
      //     toast.success("Created Successfully");
      //   }

      //   // 🔄 Re-fetch after save
      //   fetchCategoryList();
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Failed to save user");
      // }
      if (editingOption) {
        toast.success("Updated Successfully");
      } else{
        toast.success("Created Successfully");
      }
      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  return (
    <div>
      <div className="">
        <div className="mb-3 flex">
          <button
            className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
            onClick={() => {
              setEditingOption(null);
              formik.resetForm();
              setShowModal(true);
            }}
          >
            <BsQuestionCircle className="text-xl" />
            <span>Create FAQ</span>
          </button>
        </div>
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[170px]">Category</th>
                    <th className="px-3 py-3 min-w-[200px]">
                      Question (English)
                    </th>
                    <th className="px-3 py-3 min-w-[200px]">
                      Question (Hindi)
                    </th>
                    <th className="px-3 py-3 min-w-[80px] text-center">
                      Position
                    </th>
                    <th className="px-3 py-3 min-w-[120px]">Status</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.category_en}</td>
                        <td className="px-3 py-3">{item?.qa_en}</td>
                        <td className="px-3 py-3">{item?.qa_hi}</td>
                        <td className="px-3 py-3 text-center">
                          {item?.position}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`block w-fit px-3 py-1 rounded-full capitalize ${
                              item.status === "ACTIVE"
                                ? "bg-green-200"
                                : "bg-gray-200"
                            }`}
                          >
                            {formatCapitalText(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content={`${
                                userType === "ADMIN"
                                  ? "Edit Category"
                                  : "View Category"
                              }`}
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
                                  src={
                                    userType === "ADMIN" ? editIcon : viewIcon
                                  }
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

        {/* Edit Modal */}
        {showModal && (
          <EditFaqModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default FaqListScreen;
