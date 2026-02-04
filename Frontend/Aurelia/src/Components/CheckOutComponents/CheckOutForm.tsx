
import type { DiaChi } from "../../types/type";
import { useContext, useEffect, useState } from "react";
import { DiaChiContext } from "../../contexts/DiaChiContext";

export const CheckOutForm = ({formData, setFormData, saveAddress,typeShip,setTypeShip}
    :{formData: any, setFormData: React.Dispatch<React.SetStateAction<any>>, saveAddress:DiaChi[], typeShip: string, setTypeShip: React.Dispatch<React.SetStateAction<string>>}) => {
    const {XoaDiaChi}=useContext(DiaChiContext);
      const handleSelectAddress = (addr: any) => {
        setFormData({
          name: addr.hoVaTen,
          phone: addr.soDT,
          address: addr.diaChi,
          email: addr.email || "",
          payment: formData.payment,
        });
      };
      const [name,setName]=useState({
        firstName:"",
        lastName:"",
        addressLine1:"",
        city:""
      })
      useEffect(()=>{
        setFormData({
          ...formData,
          name: `${name.firstName} ${name.lastName}`,
          address: `${name.addressLine1}, ${name.city}`
        })
      },[name])

    const handleDelete = (addr: DiaChi) => XoaDiaChi(addr);
    
  return (
    <div>
      <section className="mb-12">
           {saveAddress.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium mb-2">
            Chọn địa chỉ đã lưu:
          </h3>
          <div className="flex flex-col gap-2">
            {saveAddress.map((addr: DiaChi) => (
              <div className="flex justify-between items-center border p-3 rounded-xl hover:bg-gray-50 transition">
                <button
                  type="button"
                  onClick={() => handleSelectAddress(addr)}
                  className="flex-1 text-left cursor-pointer"
                >
                  <p className="font-medium">
                    {addr.hoVaTen} - {addr.soDT}
                  </p>
                  <p className="text-gray-500 text-sm">{addr.diaChi}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr)}
                  className="ml-3 text-red-500 font-semibold hover:text-red-700 transition cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold  ">
            Contact Information
          </h1>
          <button className="text-sm font-medium underline underline-offset-4 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
            Log in
          </button>
        </div>
        <div className="mb-4">
          <input
            className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            defaultChecked
            className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-transparent dark:checked:bg-white"
            id="newsletter"
            type="checkbox"
          />
          <label
            className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
            htmlFor="newsletter"
          >
            Email me with news and offers
          </label>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold ">
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-black  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700  dark:focus:border-white transition-colors"
              placeholder="First Name"
              type="text"
              value={name.firstName}
              onChange={(e) => setName({ ...name, firstName: e.target.value })}
            />
          </div>
          <div className="md:col-span-1">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-black  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700  dark:focus:border-white transition-colors"
              placeholder="Last Name"
              type="text"
              value={name.lastName}
                onChange={(e) => setName({ ...name, lastName: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-black  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700  dark:focus:border-white transition-colors"
              placeholder="phone number"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-black  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700  dark:focus:border-white transition-colors"
              placeholder="Apartment, suite, etc. (optional)"
              type="text"
                value={name.addressLine1}
                onChange={(e) => setName({ ...name, addressLine1: e.target.value })}
            />
          </div>
          <div className="md:col-span-1">
            <input
            value={name.city}
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-black  placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700  dark:focus:border-white transition-colors"
              placeholder="City"
              type="text"
              onChange={(e) => setName({ ...name, city: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold ">
          Shipping Method
        </h2>
        <div className="rounded-sm border border-silver-border p-4 dark:border-gray-700 transition-colors">
          <div
            className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800 cursor-pointer"
            onClick={() => setTypeShip("standard")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={typeShip === "standard"}
                readOnly
                className="h-4 w-4 border-gray-300  focus:ring-primary dark:bg-transparent dark:checked:bg-white"
                id="standard"
                name="shipping"
                type="radio"
              />
              <label
                className="text-base font-medium  cursor-pointer"
                htmlFor="standard"
              >
                Complimentary Standard Shipping
              </label>
            </div>
            <span className="font-bold  ">Free</span>
          </div>
          <div
            className="flex items-center justify-between pt-4 cursor-pointer"
            onClick={() => setTypeShip("express")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={typeShip === "express"}
                readOnly
                className="h-4 w-4 border-gray-300  focus:ring-primary dark:bg-transparent dark:checked:bg-white"
                id="express"
                name="shipping"
                type="radio"
              />
              <label
                className="text-base font-medium  cursor-pointer"
                htmlFor="express"
              >
                Express Delivery
              </label>
            </div>
            <span className="font-bold      ">
                25,000 VND
            </span>
          </div>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold ">
          Payment
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
            All transactions are secure and encrypted.
          </p>
        </div>
      </section>
    </div>
  );
};
