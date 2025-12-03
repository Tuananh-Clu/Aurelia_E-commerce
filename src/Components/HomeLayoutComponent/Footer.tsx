import { Facebook, Instagram, Twitter } from "lucide-react"
import logo from "../../assets/aurelia_logo_svg.svg"

export const Footer = () => {
  return (
    <div className="relative bg-black w-full px-20 py-12 text-white border-t border-white/10">
      <div className=" flex flex-row items-center justify-between ">
        <div className="flex flex-col ">
          <img src={logo} alt="Aurelia Logo" className="w-64 opacity-95" />
          <h1 className="font-heading mt-4 text-lg tracking-wide">
            Aurelia – Timeless Elegance
          </h1>
          <div className="flex flex-row gap-4 mt-4 text-gray-300 transition">
            <a href="#" className="hover:text-white transition-colors"><Facebook /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter /></a>
          </div>
        </div>
        <div className="flex flex-row gap-10 py-12 ">
            <div>
          <h2 className="font-semibold text-lg font-heading  mb-4">Pages</h2>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Special Offers</a></li>
            <li><a href="#" className="hover:text-white">Shop</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg font-heading  mb-4">About</h2>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Collections</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg font-heading  mb-4">Contact</h2>
          <ul className="space-y-2 text-gray-400">
            <li>📍 123 Luxury Ave, Paris</li>
            <li>✉️ support@aurelia.com</li>
            <li>📞 +33 123 456 789</li>
          </ul>
        </div>
      </div>
        </div>
       

      {/* Copyright */}
      <div className="border-t border-white/10 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} Aurelia. All rights reserved.
      </div>
    </div>
  )
}
