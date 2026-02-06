import type { order } from "../../types/type";
import Timeline from "./TimeLine";

const Sidebar = ({ data }: { data: any }) => {
  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-[520px] bg-white z-20 border-l border-aurelia-silver flex flex-col pt-24 pb-8 px-10 md:px-12 shadow-2xl md:shadow-none overflow-hidden">
      <div className="mb-10">
        <div className="flex justify-between items-start mb-2">
          <p className="text-aurelia-gray text-xs font-medium uppercase tracking-widest">
            Tracking Details
          </p>
          <span className="inline-flex items-center gap-1 rounded bg-aurelia-light px-2 py-1 text-[10px] font-semibold text-aurelia-charcoal uppercase tracking-wide">
            {data?.data?.orderId}
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-aurelia-charcoal leading-tight mb-2">
          Order #{data?.data?.orderId}
        </h1>
        <p className="text-aurelia-charcoal text-sm font-medium">
          Estimated Delivery:{" "}
          <span className="text-primary font-bold">
            {data?.data?.ngayTaoDon ? new Date(data?.data?.ngayTaoDon).toLocaleDateString() : ''}
          </span>
        </p>
      </div>
      {data?.product?.map((item:any) => (
        <div className="flex gap-4 border border-aurelia-light p-3 rounded mb-4 items-center bg-aurelia-light/50">
          <div
            className="h-16 w-16 bg-cover bg-center rounded-sm shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm"
            style={{ backgroundImage: `url(${item.thumnail})` }}
          />
          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-lg leading-none text-aurelia-charcoal">
              {item.name}
            </h3>
            <p className="text-aurelia-gray text-xs mt-1">
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
      <Timeline data={data} />

      <div className="mt-auto border-t border-aurelia-light pt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-aurelia-gray text-[10px] uppercase tracking-wider mb-1">
            Courier
          </p>
          <p className="text-aurelia-charcoal text-sm font-medium">
            Aurelia Express
          </p>
        </div>
        <div className="text-right">
          <p className="text-aurelia-gray text-[10px] uppercase tracking-wider mb-1">
            Service
          </p>
          <p className="text-aurelia-charcoal text-sm font-medium">
            Priority Overnight
          </p>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button className="flex-1 h-12 flex items-center justify-center border border-aurelia-charcoal bg-white text-aurelia-charcoal text-[10px] uppercase tracking-widest font-bold hover:bg-aurelia-charcoal hover:text-white transition-all rounded-sm">
          View Receipt
        </button>
        <button className="flex-1 h-12 flex items-center justify-center bg-aurelia-charcoal text-white text-[10px] uppercase tracking-widest font-bold hover:bg-primary transition-colors rounded-sm shadow-lg shadow-black/10">
          Contact Concierge
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
