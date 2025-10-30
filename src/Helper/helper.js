export const customStyles = {
  control: (base, state) => {
    const isMobile = window.innerWidth < 640; // Example: Tailwind's sm breakpoint

    return {
      ...base,
      borderColor: state.isFocused ? "black" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: "black",
      },
      minHeight: isMobile ? "36px" : "40px",
      fontSize: isMobile ? "13px" : "14px",
      borderRadius: "5px",
      paddingLeft: isMobile ? "2px" : "3px",
      zIndex: 2,
    };
  },
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f3f3f3",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#333",
    fontSize: window.innerWidth < 640 ? "12px" : "14px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#666",
    ":hover": {
      backgroundColor: "#e2e2e2",
      color: "black",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#0072CE" : "#ffffff",
    color: state.isFocused ? "#ffffff" : "#000000",
    cursor: "pointer",
    fontSize: window.innerWidth < 640 ? "13px" : "14px",
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
