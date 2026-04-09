import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, removeErrors, removeSucces } from "../redux/userSlice";
const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = user;

    if (!name || !email || !password) {
      toast.error("Please fill all the required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Registered successfully");
      dispatch(removeSucces())
      navigate('/login')
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-[#1f241f]">
      <div className="w-full max-w-md bg-[#3c433b] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#8fa38a] mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#647a67] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8fa38a]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#647a67] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8fa38a]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#647a67] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8fa38a]"
          />

          {/* Custom File Upload */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-[#8fa38a] text-[#1f241f] rounded-lg font-medium hover:bg-[#647a67] hover:text-white transition">
              Choose Avatar
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border border-[#8fa38a]"
              />
            )}
            {avatar && (
              <span className="text-sm text-gray-300 truncate max-w-[120px]">
                {avatar.name}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#8fa38a] text-[#1f241f] font-semibold rounded-lg hover:bg-[#647a67] hover:text-white transition"
          >
            {loading ? "Signing up" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#8fa38a] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
