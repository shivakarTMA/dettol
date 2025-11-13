import React, { useEffect, useState } from "react";
import stockIcon from "../../Assests/Images/icons/stock.svg";
import EditInventoryModal from "../../Components/EditInventoryModal";
import { authAxios } from "../../Config/config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Tooltip from "../../Components/Common/Tooltip";
import { MdOutlineInventory2 } from "react-icons/md";

const validationSchema = Yup.object().shape({
  product_name: Yup.string().required("Product Name is required"),
  total: Yup.string().required("Total Stock is required"),
});


const InventoryListScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);

  const [editingOption, setEditingOption] = useState(null);

  const fetchInventoryList = async () => {
    try {
      const res = await authAxios().get("/inventory/list");

      let data = res.data?.data || [];
      setInventoryList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    fetchInventoryList();
  }, []);

  const formik = useFormik({
    initialValues: {
      name_en: "",
      name_hi: "",
      position: "",
      status: "ACTIVE",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values");
      try {
        const payload = { ...values };

        if (editingOption) {
          // Update
          await authAxios().put(`/inventory/${editingOption}`, payload);
          toast.success("Updated Successfully");
        } else {
          // Create
          await authAxios().post("/inventory/store", payload);
          toast.success("Created Successfully");
        }

        // 🔄 Re-fetch after save
        fetchInventoryList();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save user");
      }

      resetForm();
      setEditingOption(null);
      setShowModal(false);
    },
  });

  return (
    <div>
      <div className="">
        {/* <div className="mb-3 flex">
          <button
            className="px-4 py-2 rounded-lg bg-[#008421] text-white flex gap-1 items-center"
            onClick={() => {
              setEditingOption(null);
              formik.resetForm();
              setShowModal(true);
            }}
          >
            <MdOutlineInventory2 className="text-xl" />
            <span>Add Inventory</span>
          </button>
        </div> */}
        <div className="bg-white custom--shodow rounded-[10px] lg:p-3 p-2">
          <div className="rounded-[10px] overflow-hidden">
            <div className="relative overflow-x-auto ">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F1F1F1]">
                  <tr>
                    <th className="px-3 py-3 min-w-[120px]">Product Name</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Total Qty</th>
                    <th className="px-3 py-3 min-w-[150px] text-center">Available Qty</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Distributed Qty</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-3 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    inventoryList.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-3">{item?.product_name}</td>
                        <td className="px-3 py-3 text-center">{item?.total}</td>
                        <td className="px-3 py-3 text-center">{item?.available}</td>
                        <td className="px-3 py-3 text-center">{item?.allotted}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Tooltip
                              id={`tooltip-edit-${item.id}`}
                              content="Add Stock"
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
                                  src={stockIcon}
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
          <EditInventoryModal
            setShowModal={setShowModal}
            editingOption={editingOption}
            formik={formik}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryListScreen;
