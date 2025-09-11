import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct } from "../redux/productSlice";
import { useLocation, useNavigate } from "react-router-dom";
import NoProduct from "../components/NoProduct";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Products = () => {
  const { products, error, loading, productCount, resultPerPage } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [showFilters, setShowFilters] = useState(false); // toggle state
  const navigate = useNavigate();
  const categories = ["laptop", "mobile", "television", "fruits", "glass"];

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage }));
  }, [dispatch, currentPage, keyword]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete("page");
      } else {
        newSearchParams.set("page", page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("category", category);
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
    setShowFilters(false); // auto-hide on mobile after selecting
  };

  return (
   <>
   <Navbar />
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Toggle Button for md and sm */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-[#647a67] text-white rounded-lg shadow-md w-full"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:block w-full md:w-1/5 bg-gray-100 shadow-md rounded-xl p-4 md:h-[350px] md:sticky md:top-20`}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">CATEGORIES</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-[#647a67] hover:text-white transition"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Products */}
      <div className="flex-1">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <NoProduct keyword={keyword} />
        )}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
   <Footer />
   </>
  );
};

export default Products;
