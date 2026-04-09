import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct } from '../redux/productSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import NoProduct from '../components/NoProduct';
import Pagination from '../components/Pagination';
import { MdFilterList, MdGridView, MdViewList } from 'react-icons/md';

const Products = () => {
  const { products, loading, productCount, totalPages } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  const category = searchParams.get('category');
  const pageFromURL = parseInt(searchParams.get('page')) || 1;
  
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['laptop', 'mobile', 'television', 'fruits', 'glass', 'camera', 'headphone'];

  useEffect(() => {
    dispatch(getProduct({ keyword, category, page: currentPage }));
  }, [dispatch, currentPage, keyword, category]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (cat) {
      newSearchParams.set('category', cat);
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.delete('page');
    navigate(`?${newSearchParams.toString()}`);
    setShowFilters(false);
  };

  const currentCategory = searchParams.get('category') || '';

  return (
    <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-art-white">
            {currentCategory ? (
              <span className="text-gradient-gold capitalize">{currentCategory}</span>
            ) : keyword ? (
              <>Search: <span className="text-gradient-gold">"{keyword}"</span></>
            ) : (
              'All Products'
            )}
          </h1>
          <p className="text-art-silver mt-2">
            {productCount} {productCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-art-charcoal rounded-lg border border-art-gold/20 mb-4"
            >
              <MdFilterList />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-art-white">Categories</h3>
                  {currentCategory && (
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className="text-art-gold text-sm hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all capitalize ${
                          currentCategory === cat
                            ? 'bg-art-gold text-art-black font-medium'
                            : 'text-art-silver hover:bg-art-black hover:text-art-gold'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-art-gold text-art-black' : 'bg-art-charcoal text-art-silver'}`}
                >
                  <MdGridView size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-art-gold text-art-black' : 'bg-art-charcoal text-art-silver'}`}
                >
                  <MdViewList size={20} />
                </button>
              </div>
              <p className="text-art-silver text-sm">
                Showing {((currentPage - 1) * 6) + 1} - {Math.min(currentPage * 6, productCount)} of {productCount}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-art-gold"></div>
              </div>
            ) : products?.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <Product key={product._id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <NoProduct keyword={keyword} />
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;