import React from "react";
import * as FaIcons from "react-icons/fa"; // Import tất cả các icon từ react-icons/fa

/**
 * Hàm tạo icon từ tên
 * @param {string} iconName - Tên của icon (ví dụ: "FaUsers", "FaCheckCircle")
 * @returns {JSX.Element|null} - Component icon hoặc null nếu không tìm thấy
 */
const createIcon = (iconName) => {
  const IconComponent = FaIcons[iconName]; // Lấy component icon từ react-icons/fa
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" không tồn tại trong Font Awesome.`);
    return null; // Trả về null nếu không tìm thấy icon
  }
  return <IconComponent />; // Trả về component icon
};

export default createIcon;