
import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useContext, useState } from "react";
import { AuthorForAdminContext } from "../../../contexts/AuthorForAdmin";
import { useNavigate } from "react-router-dom";


export const AdminSiteLog = () => {
  const { Login } = useContext(AuthorForAdminContext);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleCLick=(Email:string,Password:string)=>{
     Login(Email,Password);
     const token = localStorage.getItem("AdminToken");
     if(token){
      navigate('/Admin/DashboardAdmin');
     }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white mt-4 tracking-wide">
            Admin Portal
          </h1>
          <p className="text-gray-300 text-sm">Sign in to manage your site</p>
        </div>

        <form className="flex flex-col space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              name="email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
                placeholder="Enter password"
              />
              <LockKeyhole
                size={20}
                className="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>

          <motion.button
            onClick={() => {handleCLick(Email, Password)}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition"
          >
            Log In
          </motion.button>

          <p className="text-gray-400 text-xs text-center mt-4">
            © 2025 Admin Panel — All rights reserved.
          </p>
        </form>
      </motion.div>
    </div>
  );
};
