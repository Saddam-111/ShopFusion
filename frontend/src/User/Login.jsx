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
  const {error, success, isAuthenticated} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    dispatch(login({email, password}))
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
  },[isAuthenticated, navigate])

  useEffect( () => {
    if(success){
      toast.success('Login Successfull')
      dispatch(removeSucces())
    }
  },[dispatch, success])

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-sage">
      <div className="noise-overlay" />
      <div className="max-w-full min-w-md bg-cream rounded-corners-xl shadow-float p-8">
        <h2 className="text-3xl font-display text-center mb-6 text-forest">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-forest/70 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-forest/20 rounded-corners-lg focus:outline-none focus:border-forest bg-white text-forest"
            />
          </div>

          <div>
            <label className="block mb-2 text-forest/70 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-forest/20 rounded-corners-lg focus:outline-none focus:border-forest bg-white text-forest"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-forest text-cream py-3 rounded-corners-lg font-bold text-utility text-sm hover:shadow-float transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-forest/60">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-forest hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;