import React, { useState, useEffect } from "react";
import FAQItem from "./FAQItem";
import { FaQuestionCircle, FaChevronRight } from "react-icons/fa";
import Pagination from "./Pagination";
import faq from "../../../api/apiFAQ";

const FAQPage = () => {
  const [faqItems, setFaqItems] = useState([]); 
  const [filteredItems, setFilteredItems] = useState([]); // Danh sách câu hỏi sau khi lọc
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState("All"); // Danh mục được chọn
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng câu hỏi trên mỗi trang

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await faq.getAllFAQs();
        setFaqItems(response.data); // Lưu danh sách câu hỏi gốc
        setFilteredItems(response.data); 

        // Trích xuất danh mục duy nhất
        const uniqueCategories = ["All", ...new Set(response.data.map((item) => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = faqItems.filter((item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Xử lý chọn danh mục
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered = faqItems.filter((item) =>
      (category === "All" || item.category === category) &&
      item.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Tính toán dữ liệu hiển thị
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1200px] mt-12 mx-[auto] mb-20 p-8 font-['Segoe_UI',_Arial,_sans-serif] md:p-6 md:mx-[auto] md:my-8">
      <div className="text-center mb-12 animate-[fadeInDown_0.8s_ease-out_forwards]">
        <div className="text-[2rem] mb-6 mt-4 flex items-center gap-2 text-primary-color">
          <FaQuestionCircle className="text-[2.5rem]" />
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="cursor-pointer hover:underline hover:text-primary-light"><a href="\home">Home</a></span>
          <FaChevronRight className="text-[#6c757d] [transition:color_0.3s_ease] hover:text-primary-light text-[1rem]" />
          <span className="text-primary-light font-semibold hover:underline">FAQ</span>
        </div>
        <h1 className="text-[2.8rem] mb-4 relative inline-block text-primary-color after:content-[''] after:absolute after:-bottom-[10px] after:left-2/4 after:-translate-x-1/2 after:w-[100px] after:h-[3px] after:[transition:width_0.3s_ease] after:bg-primary-color hover:after:w-[180px] md:text-[2.2rem]"> 
          Frequently Asked Questions
        </h1>
        <p className="text-[#6c757d] text-[1.2rem] max-w-[700px] mt-6 mx-[auto] mb-[0]">
          Find answers to the most common questions about our services
        </p>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex justify-center mt-8 mx-[0] mb-12 animate-[fadeInUp_0.8s_ease-out_forwards]">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }} // Gọi hàm tìm kiếm khi nhấn Enter
          placeholder="Search for questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
          className="w-[70%] px-6 py-3.5 text-[1rem] border-[2px] border-[solid] border-color rounded-tl-[8px] rounded-bl-[8px] [transition:all_0.3s_ease] focus:outline-[none] focus:[box-shadow:0_0_0_3px_rgba(139,_0,_0,_0.1)] focus:border-primary-color md:w-[65%]"
        />
        <button
          onClick={handleSearch} // Gọi hàm tìm kiếm
          className="px-6 py-3.5 text-[white] border-[none] rounded-tr-[8px] rounded-br-[8px] cursor-pointer [transition:all_0.3s_ease] font-semibold bg-primary-color hover:bg-primary-light hover:-translate-y-[2px]"
        >
          Search
        </button>
      </div>

      {/* Nút danh mục */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.2s] md:gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-6 py-3 border-[2px] border-[solid] rounded-[50px] cursor-pointer [transition:all_0.3s_ease] font-medium ${
              selectedCategory === category
                ? "text-[white] -translate-y-[3px] [box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] bg-primary-color border-primary-color"
                : "bg-light-color hover:text-[white] hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:border-primary-color"
            } md:px-4 md:py-2 md:text-[0.9rem]`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Danh sách câu hỏi */}
      <div className="flex flex-col gap-6 mb-16">
        {currentItems.map((item, index) => (
          <FAQItem 
            key={index} 
            question={item.question} 
            answer={item.answer}
            style={{ animationDelay: `${index * 0.1}s` }} 
          />
        ))}
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <div className="bg-[linear-gradient(135deg,_#f8f9fa_0%,_#ffffff_100%)] p-12 text-center rounded-[15px] [box-shadow:0_10px_30px_rgba(0,_0,_0,_0.05)] mt-16 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.7s] md:p-8">
        <h2 className="mb-4 text-[1.8rem] text-primary-color">Still have questions?</h2>
        <p className="text-[#6c757d] mb-8 max-w-[600px] ml-auto mr-auto">
          Our customer service team is here to help you with any other questions
          you might have.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="/contact" className="px-8 py-3.5 text-[white] no-underline rounded-[8px] [transition:all_0.3s_ease] font-semibold inline-block bg-primary-color hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-light">
            Contact Us
          </a>
          <a href="tel:+8490123456" className="px-8 py-3.5 no-underline rounded-[8px] [transition:all_0.3s_ease] font-semibold inline-block bg-[white] border-[2px] border-[solid] border-primary-color text-primary-color hover:-translate-y-[3px] hover:[box-shadow:0_5px_15px_rgba(139,_0,_0,_0.2)] hover:bg-primary-color hover:text-[white]">
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;