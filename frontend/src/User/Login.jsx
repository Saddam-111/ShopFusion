import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, removeErrors, removeSucces } from "../redux/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const { email, password } = formData;
  const {error, loading, success, isAuthenticated} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello")
    dispatch(login({email, password}))

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // later integrate API here
    console.log("Login Data:", formData);
  };

  useEffect( () => {
    if(error){
      toast.error(error)
      dispatch(removeErrors())
    }
  },[dispatch, error])

  useEffect( () => {
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated])

  useEffect( () => {
    if(success){
      toast.success('Login Successfull')
      dispatch(removeSucces())
    }
  },[dispatch, success])

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#1f241f]">
      <div className="w-full max-w-md bg-[#3c433b] rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#8fa38a]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-[#8fa38a]">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#647a67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8fa38a] bg-[#1f241f] text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#8fa38a]">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-[#647a67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8fa38a] bg-[#1f241f] text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8fa38a] text-[#1f241f] py-2 rounded-lg font-semibold hover:bg-[#647a67] transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-[#8fa38a]">
          Don’t have an account?{" "}
          <Link to="/register" className="underline hover:text-white">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
