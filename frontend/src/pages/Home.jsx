import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import {useDispatch, useSelector} from 'react-redux'
import { getProduct } from '../redux/productSlice'
import Loader from '../components/Loader'
const Home = () => {
  const dispatch = useDispatch()
  const {products, error , loading, productCount} =useSelector( (state) => state.product)

  useEffect( () => {
    dispatch(getProduct())
  },[dispatch])

  return (
    <>
    <Navbar />
    <div className="w-full min-h-screen flex flex-col">
      <ImageSlider />

      {/* Trending Section */}

      {!loading ? <div className="max-w-7xl mx-auto w-full px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1f241f] mb-6">
          Trending Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-[40px] ">
          {products?.map((product, index) => (
            <Product product={product} key={index} />
          ))}
        </div>
      </div> : <Loader />}

    </div>

    <Footer />
    </>
  )
}

export default Home
