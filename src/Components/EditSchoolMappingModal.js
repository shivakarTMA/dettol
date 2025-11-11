import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";

const districtSchoolMap = {
  Piprauli: [
    { value: "ln_public", label: "LN Public School" },
    { value: "sunrise_academy", label: "Sunrise Academy" },
  ],
  Gorakhpur: [
    { value: "modern_school", label: "Modern School" },
    { value: "city_convent", label: "City Convent" },
  ],
  Lucknow: [
    { value: "dps_lko", label: "Delhi Public School" },
    { value: "cms_lko", label: "City Montessori School" },
  ],
};

const districtOptions = Object.keys(districtSchoolMap).map((district) => ({
  value: district,
  label: district,
}));

const EditSchoolMappingModal = ({ setShowModal, editingOption, formik }) => {
  console.log(editingOption, "editingOption");

  // ✅ Step 1: Ref to scroll container
  const schoolListRef = useRef(null);

  // ✅ Step 2: Effect to scroll to bottom when schools change
  useEffect(() => {
    if (schoolListRef.current) {
      schoolListRef.current.scrollTo({
        top: schoolListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [formik.values.schools?.length]);

  useEffect(() => {
    if (!editingOption) return;

    const fetchStaffById = async (id) => {
      try {
        const res = await authAxios().get(`/category/${id}`);
        const data = res.data?.data || res.data || null;

        if (data) {
          formik.setValues({
            schools: [
              {
                district: data?.district || null,
                school: data?.school || null,
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch module details");
      }
    };

    fetchStaffById(editingOption);
  }, [editingOption]);

  const handleDistrictChange = (index, option) => {
    const newSchools = [...formik.values.schools];
    newSchools[index].district = option;
    newSchools[index].school = null; // reset school when district changes
    formik.setFieldValue("schools", newSchools);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setShowModal(false);
        }}
      ></div>
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[600px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption
                  ? "Edit School Mapping - Avinash Malhotra"
                  : "Create School Mapping"}
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
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-3 gap-y-2 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                {!editingOption && (
                  <div className="col-span-2">
                    {/* Select Coordinator */}
                    <label className="block font-medium mb-1">
                      Select Coordinator<span className="text-red-500">*</span>
                    </label>
                    <Select
                      styles={customStyles}
                      name="coordinator"
                      placeholder="Select Coordinator"
                      options={formik.values.coordinatorOptions || []}
                      value={formik.values.coordinator}
                      onChange={(option) =>
                        formik.setFieldValue("coordinator", option)
                      }
                    />
                  </div>
                )}

                {/* District and School Fields */}
                <div
                  ref={schoolListRef}
                  className={`col-span-2 space-y-3 ${
                    formik.values.schools.length > 4
                      ? "max-h-[55vh] overflow-y-auto"
                      : "overflow-visible"
                  }`}
                >
                  {formik.values.schools?.map((school, index) => {
                    const selectedDistrict = school.district?.value;
                    const availableSchools = selectedDistrict
                      ? districtSchoolMap[selectedDistrict]
                      : [];

                    return (
                      <div
                        key={index}
                        className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-3 gap-y-2 relative bg-[#F1F1F1] p-3 rounded-[5px]"
                      >
                        {/* District */}
                        <div>
                          <label className="block font-medium mb-1">
                            District<span className="text-red-500">*</span>
                          </label>
                          <Select
                            styles={{
                              ...customStyles,
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // makes sure it appears on top
                            }}
                            menuPortalTarget={document.body} // ✅ key fix
                            name={`schools[${index}].district`}
                            placeholder="Select District"
                            options={districtOptions}
                            value={school.district}
                            onChange={(option) =>
                              handleDistrictChange(index, option)
                            }
                          />
                        </div>

                        {/* Assign School */}
                        <div>
                          <label className="block font-medium mb-1">
                            Assign School
                            <span className="text-red-500">*</span>
                          </label>
                          <Select
                            styles={{
                              ...customStyles,
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.body}
                            name={`schools[${index}].school`}
                            placeholder="Select School"
                            isDisabled={!selectedDistrict}
                            options={availableSchools}
                            value={school.school}
                            onChange={(option) =>
                              formik.setFieldValue(
                                `schools[${index}].school`,
                                option
                              )
                            }
                          />
                        </div>

                        {index > 0 && (
                          <button
                            type="button"
                            className="absolute top-2 right-2 text-red-500 text-lg"
                            onClick={() => {
                              const newSchools = [...formik.values.schools];
                              newSchools.splice(index, 1);
                              formik.setFieldValue("schools", newSchools);
                            }}
                          >
                            <IoMdClose />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add New School */}
                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue("schools", [
                      ...formik.values.schools,
                      { district: null, school: null },
                    ])
                  }
                  className="text-[#008421] font-medium text-left"
                >
                  + Add New School
                </button>

                <div></div>
              </div>
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSchoolMappingModal;
