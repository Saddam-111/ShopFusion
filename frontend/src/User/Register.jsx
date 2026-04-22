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
    <div className="flex items-center justify-center min-h-screen w-full bg-sage">
      <div className="noise-overlay" />
      <div className="max-w-[80%] min-w-sm bg-cream rounded-corners-xl shadow-float p-8">
        <h2 className="text-3xl font-display text-center text-forest mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-corners-lg border-2 border-forest/20 focus:outline-none focus:border-forest bg-white text-forest"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-corners-lg border-2 border-forest/20 focus:outline-none focus:border-forest bg-white text-forest"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-corners-lg border-2 border-forest/20 focus:outline-none focus:border-forest bg-white text-forest"
          />

          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-forest text-cream rounded-corners-lg font-bold text-utility text-xs hover:opacity-90 transition">
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
                className="w-12 h-12 rounded-full object-cover border-2 border-forest/20"
              />
            )}
            {avatar && (
              <span className="text-sm text-forest/60 truncate max-w-[120px]">
                {avatar.name}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest text-cream font-bold text-utility text-sm rounded-corners-lg hover:shadow-float transition-all"
          >
            {loading ? "Signing up" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center text-forest/60 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-forest hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;