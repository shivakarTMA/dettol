import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { authAxios } from "../Config/config";
import { toast } from "react-toastify";
import { customStyles } from "../Helper/helper";
import Select from "react-select";

const EditSchoolMappingModal = ({ setShowModal, editingOption, formik }) => {
  const schoolListRef = useRef(null);

  // API State
  const [districtOptions, setDistrictOptions] = useState([]);
  const [allSchools, setAllSchools] = useState([]);

  // Scroll to bottom when schools added
  useEffect(() => {
    if (schoolListRef.current) {
      schoolListRef.current.scrollTo({
        top: schoolListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [formik.values.schools?.length]);

  // Fetch Districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await authAxios().get("/school/district/list");
        const districts = res.data?.data || [];

        setDistrictOptions(
          districts.map((d) => ({
            label: d.district_en,
            value: d.district_en,
          }))
        );
      } catch (err) {
        toast.error("Failed to load districts");
      }
    };

    fetchDistricts();
  }, []);

  // Fetch Schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await authAxios().get("/school/fetch/all");
        setAllSchools(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to load schools");
      }
    };

    fetchSchools();
  }, []);

  // Fetch Editing Data
  useEffect(() => {
    if (!editingOption || !allSchools.length) return;

    const fetchCoodinatorById = async (id) => {
      try {
        const res = await authAxios().get(`/staff/coordinator/${id}`);
        const data = res.data?.data;

        if (data?.district_assigned?.length) {
          const mapped = data.district_assigned.map((item) => {
            const schoolObj = allSchools.find(
              (s) =>
                s.district_en === item.district_name &&
                s.name_en === item.school_name
            );

            return {
              district: {
                label: item.district_name,
                value: item.district_name,
              },
              school: schoolObj
                ? {
                    value: schoolObj.id,
                    label: schoolObj.name_en,
                  }
                : null,
            };
          });

          formik.setFieldValue("schools", mapped);
        }
      } catch (err) {
        toast.error("Failed to fetch coordinator details");
      }
    };

    fetchCoodinatorById(editingOption);
  }, [editingOption, allSchools]);

  // Filter Schools by District + Remove Selected in same district
  const getAvailableSchools = (district, index) => {
    if (!district) return [];

    // Schools from this district
    const districtSchools = allSchools
      .filter((s) => s.district_en === district.value)
      .map((s) => ({
        value: s.id,
        label: s.name_en,
      }));

    // Collect already selected schools **from same district**
    const selectedSchoolIds = formik.values.schools
      .filter(
        (item, i) => i !== index && item.district?.value === district.value
      )
      .map((item) => item.school?.value);

    // Filter out selected
    return districtSchools.filter(
      (school) => !selectedSchoolIds.includes(school.value)
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => {
          formik.resetForm();
          setShowModal(false);
        }}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-start pt-10 pb-5 z-50 overflow-auto w-full max-w-[600px] mx-auto custom--overflow">
        <div className="flex flex-col relative w-[95%] mx-auto">
          <div className="w-full bg-white rounded-[20px]">
            {/* Header */}
            <div className="flex gap-2 items-center justify-between lg:py-3 py-2 lg:px-5 px-3 border-b border-b-[#D4D4D4]">
              <h3 className="text-lg font-semibold">
                {editingOption
                  ? "Edit School Mapping"
                  : "Create School Mapping"}
              </h3>

              {/* Close Button */}
              <button
                className="text-2xl"
                onClick={() => {
                  formik.resetForm();
                  setShowModal(false);
                }}
              >
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-3 gap-y-2 lg:pb-5 pb-2 lg:pt-5 pt-2 lg:px-5 px-3">
                {/* Coordinator Dropdown (Create Only) */}
                {!editingOption && (
                  <div className="col-span-2">
                    <label className="block font-medium mb-1">
                      Select Coordinator <span className="text-red-500">*</span>
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

                {/* School List */}
                <div
                  ref={schoolListRef}
                  className={`col-span-2 space-y-3 ${
                    formik.values.schools.length > 4
                      ? "max-h-[55vh] overflow-y-auto"
                      : "overflow-visible"
                  }`}
                >
                  {formik.values.schools?.map((school, index) => (
                    <div
                      key={index}
                      className="grid lg:grid-cols-2 grid-cols-1 gap-x-3 lg:gap-y-3 gap-y-2 relative bg-[#F1F1F1] p-3 rounded-[5px]"
                    >
                      {/* District */}
                      <div>
                        <label className="block font-medium mb-1">
                          District <span className="text-red-500">*</span>
                        </label>
                        <Select
                          menuPortalTarget={document.body}
                          styles={{
                            ...customStyles,
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          name={`schools[${index}].district`}
                          placeholder="Select District"
                          options={districtOptions}
                          value={school.district}
                          onChange={(option) => {
                            const newSchools = [...formik.values.schools];
                            newSchools[index].district = option;
                            newSchools[index].school = null;
                            formik.setFieldValue("schools", newSchools);
                          }}
                        />
                        {formik.touched.schools?.[index]?.district &&
                          formik.errors.schools?.[index]?.district && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.schools[index].district}
                            </p>
                          )}
                      </div>

                      {/* Schools */}
                      <div>
                        <label className="block font-medium mb-1">
                          Assign School <span className="text-red-500">*</span>
                        </label>
                        <Select
                          menuPortalTarget={document.body}
                          styles={{
                            ...customStyles,
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          name={`schools[${index}].school`}
                          placeholder="Select School"
                          isDisabled={!school.district}
                          options={getAvailableSchools(school.district, index)}
                          value={school.school}
                          onChange={(option) =>
                            formik.setFieldValue(
                              `schools[${index}].school`,
                              option
                            )
                          }
                        />
                        {formik.touched.schools?.[index]?.school &&
                          formik.errors.schools?.[index]?.school && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.schools[index].school}
                            </p>
                          )}
                      </div>

                      {/* Remove Row */}
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
                  ))}
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

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 lg:pb-5 pb-2 lg:px-5 px-3">
                <button
                  type="button"
                  onClick={() => {
                    formik.resetForm();
                    setShowModal(false);
                  }}
                  className="bg-[#EFEFEF] h-[38px] flex items-center justify-center rounded-lg w-full max-w-[120px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#008421] h-[38px] flex items-center justify-center rounded-lg w-full max-w-[120px] text-white"
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
