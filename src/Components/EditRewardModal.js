import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { MdImage, MdOutlineInventory2 } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { customStyles } from "../Helper/helper";

const EditRewardModal = ({ setShowModal, editingOption, formik }) => {
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const { userType } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/reward/${id}`);
        const data = res.data?.data || res.data || null;

        if (data) {
          formik.setValues({
            image_url: data?.image_url || "",
            milestone_name_en: data?.milestone_name_en || "",
            milestone_name_hi: data?.milestone_name_hi || "",
            name_en: data?.name_en || "",
            name_hi: data?.name_hi || "",
            description_en: data?.description_en || "",
            description_hi: data?.description_hi || "",
            // content: data?.content || "",
            points_required: data?.points_required || "",
            position: data?.position || "",
            inventory: data.inventory.length
            ? data.inventory
            : [{ inventory_id: "", quantity: "" }],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch module details");
      }
    };

    fetchStaffById(editingOption);
  }, [editingOption, inventoryOptions]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await authAxios().get("/inventory/list");
        const list = res.data?.data || [];

        // only ACTIVE items
        const activeItems = list
          .filter((i) => i.status === "ACTIVE")
          .map((i) => ({
            value: i.id,
            label: i.product_name_en,
          }));

        setInventoryOptions(activeItems);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch inventory list");
      }
    };

    fetchInventory();
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setShowModal(false);
        }}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[900px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption ? "Edit Reward" : "Create Reward"}
              </h3>
              {/* Close button */}
              <button
                className="text-2xl"
                onClick={() => {
                  formik.resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-4 gap-y-3 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                <div className=" flex lg:flex-row flex-col lg:gap-5 gap-2">
                  <div className="border rounded-lg w-[110px] h-[80px] flex items-center justify-center">
                    {formik.values.image_url ? (
                      <img
                        src={
                          typeof formik.values.image_url === "string"
                            ? formik.values.image_url
                            : URL.createObjectURL(formik.values.image_url)
                        }
                        alt="Reward Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 p-2 w-full">
                        <MdImage size={45} />
                        <p className="text-[12px] mt-1">Upload Image</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block font-[500]">
                      Reward Image<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="image_url"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "image_url",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="custom--input w-full"
                    />
                    {formik.touched.image_url && formik.errors.image_url && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.image_url}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3">
                  <div>
                    <label className="mb-2 block font-[500]">
                      Milestone (English)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="milestone_name_en"
                      value={formik.values.milestone_name_en || ""}
                      onChange={formik.handleChange}
                      placeholder="Milestone (English)"
                      className="custom--input w-full"
                    />
                    {formik.touched.milestone_name_en &&
                      formik.errors.milestone_name_en && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.milestone_name_en}
                        </div>
                      )}
                  </div>
                  <div>
                    <label className="mb-2 block font-[500]">
                      Milestone (Hindi)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="milestone_name_hi"
                      value={formik.values.milestone_name_hi || ""}
                      onChange={formik.handleChange}
                      placeholder="Milestone (Hindi)"
                      className="custom--input w-full"
                    />
                    {formik.touched.milestone_name_hi &&
                      formik.errors.milestone_name_hi && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.milestone_name_hi}
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Name (English)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formik.values.name_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Name (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_en && formik.errors.name_en && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_en}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Name (Hindi)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_hi"
                    value={formik.values.name_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Name (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.name_hi && formik.errors.name_hi && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name_hi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Description (English)
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description_en"
                    value={formik.values.description_en || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Description (English)"
                    className="custom--input w-full"
                  />
                  {formik.touched.description_en &&
                    formik.errors.description_en && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.description_en}
                      </div>
                    )}
                </div>
                <div>
                  <label className="mb-2 block font-[500]">
                    Reward Description (Hindi)
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description_hi"
                    value={formik.values.description_hi || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Description (Hindi)"
                    className="custom--input w-full"
                  />
                  {formik.touched.description_hi &&
                    formik.errors.description_hi && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.description_hi}
                      </div>
                    )}
                </div>
                {/* <div>
                  <label className="mb-2 block font-[500]">
                    Reward Contents<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="content"
                    value={formik.values.content || ""}
                    onChange={formik.handleChange}
                    placeholder="Reward Contents"
                    className="custom--input w-full"
                  />
                  {formik.touched.content && formik.errors.content && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.content}
                    </div>
                  )}
                </div> */}

                <div>
                  <label className="mb-2 block font-[500]">
                    Points<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="points_required"
                    value={formik.values.points_required || ""}
                    onChange={formik.handleChange}
                    placeholder="Points"
                    className="custom--input w-full"
                  />
                  {formik.touched.points_required &&
                    formik.errors.points_required && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.points_required}
                      </div>
                    )}
                </div>

                <div>
                  <label className="mb-2 block font-[500]">
                    Position<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="position"
                    value={formik.values.position || ""}
                    onChange={formik.handleChange}
                    placeholder="Position"
                    className="custom--input w-full"
                  />
                  {formik.touched.position && formik.errors.position && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.position}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 lg:space-y-3 space-y-5">
                  {formik.values.inventory.map((item, index) => (
                    <div
                      key={index}
                      className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 relative bg-[#F1F1F1] lg:p-4 p-2 rounded-lg gap-y-3"
                    >
                      <div>
                        <label className="mb-2 block font-[500]">
                          Inventory Item<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={inventoryOptions.filter(
                            (option) =>
                              !formik.values.inventory.some(
                                (invItem, i) =>
                                  invItem.inventory_id === option.value &&
                                  i !== index
                              )
                          )}
                          placeholder="Select Item"
                          value={
                            inventoryOptions.find(
                              (opt) => opt.value === item.inventory_id
                            ) || null
                          }
                          onChange={(selected) => {
                            formik.setFieldValue(
                              `inventory[${index}].inventory_id`,
                              selected.value
                            );
                          }}
                          onBlur={() =>
                            formik.setFieldTouched(
                              `inventory[${index}].inventory_id`,
                              true
                            )
                          }
                          styles={customStyles}
                        />
                        {formik.errors.inventory?.[index]?.inventory_id && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.inventory[index].inventory_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block font-[500]">
                          Inventory Quantity
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Quantity"
                          name={`inventory[${index}].quantity`}
                          className="custom--input w-full"
                          value={item.quantity}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `inventory[${index}].quantity`,
                              e.target.value
                            )
                          }
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.inventory?.[index]?.quantity && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.inventory[index].quantity}
                          </div>
                        )}
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          className="bg-red-500 text-white h-6 w-6 rounded-full absolute top-[-10px] right-[-10px] flex items-center justify-center"
                          onClick={() => {
                            const updated = [...formik.values.inventory];
                            updated.splice(index, 1);
                            formik.setFieldValue("inventory", updated);
                          }}
                        >
                          <IoCloseOutline />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add new item button */}
                  <button
                    type="button"
                    className="bg-[#008421] gap-2 h-[38px] px-5 flex items-center justify-center cursor-pointer rounded-lg w-full text-white max-w-fit"
                    onClick={() => {
                      formik.setFieldValue("inventory", [
                        ...formik.values.inventory,
                        { inventory_id: "", quantity: "" },
                      ]);
                    }}
                  >
                    <MdOutlineInventory2 className="text-xl" />{" "}
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
              {userType === "ADMIN" && (
                <div className="flex justify-end gap-3 lg:pb-5 pb-2 lg:px-5 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setShowModal(false);
                    }}
                    className="bg-[#EFEFEF] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#008421] gap-2 h-[38px] flex items-center justify-center cursor-pointer rounded-lg w-full max-w-[120px] text-white"
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRewardModal;
