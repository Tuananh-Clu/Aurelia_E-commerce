import { ChevronDown, ChevronLeft } from "lucide-react";
import { useCheckout } from "../hooks";
import type { DiaChi } from "../types";
import { PaymentOptions } from "../../../Features/MockPayment.tsx/PaymentOptions";


export const CheckoutForm = () => {
  const {
    savedAddress,
    handleSelectAddress,
    handleDeleteAddress,
    formData,
    handleChange,
    options,
    saveAddressCheck,
    setSaveAddressCheck,
    handleSubmit,
  } = useCheckout();
  return (
    <div className="max-w-[640px]  ">
      {savedAddress.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium mb-2">
            Chọn địa chỉ đã lưu:
          </h3>
          <div className="flex flex-col gap-2">
            {savedAddress.map((addr: DiaChi) => (
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
                  onClick={() => handleDeleteAddress(addr)}
                  className="ml-3 text-red-500 font-semibold hover:text-red-700 transition cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-primary dark:text-white">
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <input
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
              placeholder="Your Name"
              type="text"
            />
          </div>
          <div className="md:col-span-2">
            <input
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
              placeholder="Address"
              type="text"
            />
          </div>
          <div className="md:col-span-2">
            <input
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
              placeholder="Apartment, suite, etc. (optional)"
              type="text"
            />
          </div>
          <div className="md:col-span-1">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
              placeholder="City"
              type="text"
            />
          </div>
          <div className="md:col-span-1">
            <input
              className="w-full rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary placeholder-gray-400 focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors"
              placeholder="Postal Code"
              type="text"
            />
          </div>
          <div className="md:col-span-2 relative">
            <select className="w-full appearance-none rounded-sm border border-silver-border bg-transparent px-4 py-3.5 text-base text-primary focus:border-primary focus:ring-0 dark:border-gray-700 dark:text-white dark:focus:border-white transition-colors">
              <option>United States</option>
              <option>France</option>
              <option>Italy</option>
              <option>United Kingdom</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <ChevronDown size={20} />
            </div>
          </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={saveAddressCheck}
                onChange={(e) => setSaveAddressCheck(e.target.checked)}
                className="w-4 h-4 accent-gray-700"
              />
              <label className="text-gray-700 text-sm">
                Lưu địa chỉ vào tài khoản
              </label>
            </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-primary dark:text-white">
          Shipping Method
        </h2>
        <div className="rounded-sm border border-silver-border p-4 dark:border-gray-700 transition-colors">
          <div
            className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800 cursor-pointer"
            onClick={() => options.setShippingOption("standard")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={options.shippingOption === "standard"}
                readOnly
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:bg-transparent dark:checked:bg-white"
                id="standard"
                name="shipping"
                type="radio"
              />
              <label
                className="text-base font-medium text-primary dark:text-white cursor-pointer"
                htmlFor="standard"
              >
                Complimentary Standard Shipping
              </label>
            </div>
            <span className="font-bold text-primary dark:text-white">Free</span>
          </div>
          <div
            className="flex items-center justify-between pt-4 cursor-pointer"
            onClick={() => options.setShippingOption("express")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={options.shippingOption === "express"}
                readOnly
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:bg-transparent dark:checked:bg-white"
                id="express"
                name="shipping"
                type="radio"
              />
              <label
                className="text-base font-medium text-primary dark:text-white cursor-pointer"
                htmlFor="express"
              >
                Express Delivery
              </label>
            </div>
            <span className="font-bold text-primary dark:text-white">
              25.000 Vnđ
            </span>
          </div>
        </div>
      </section>
      <PaymentOptions value={formData.payment} onChange={handleChange} />
      <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between pt-4">
        <a
          className="flex items-center gap-2 text-sm text-primary transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
          
        >
          <ChevronLeft size={16} />
          Return to shipping
        </a>
        <button onClick={handleSubmit} className="flex h-14 w-full md:w-auto md:min-w-[240px] items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold tracking-widest text-white transition-all hover:bg-black/80 hover:shadow-lg dark:bg-white dark:text-primary dark:hover:bg-gray-200">
          PAY NOW
        </button>
      </div>
    </div>
  );
};
