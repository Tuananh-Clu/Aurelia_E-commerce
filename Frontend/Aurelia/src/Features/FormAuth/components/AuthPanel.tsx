import React from "react";
import { LoginForm } from "./LoginForm";
import RoleToggle from "./RoleToggle";
import { useAuthForm } from "../hook/useAuthForm";
useAuthForm

export const AuthPanel: React.FC<{ type: "admin" | "user" }> = ({ type }) => {
  const {
    roleState: [role, setRole],
  }=useAuthForm();
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 md:px-24 xl:px-48 bg-white">
      <div className="w-full max-w-[400px] flex flex-col animate-fadeIn">
        {type === "admin" ? (
          <div className=" text-left mb-12">
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 text-aurelia-black">
              Staff Access
            </h1>
            <div className="h-0.5 w-12 bg-black "></div>
          </div>
        ) : (
          <div className="text-center mb-20">
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 text-aurelia-black">
              Aurelia
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-aurelia-gray">
              Private Client Access
            </p>
          </div>
        )}
        <div className="absolute bottom-16 left-16 z-10">
          <h2 className="serif-title text-white text-5xl mb-4 italic tracking-tight">
            Aurelia
          </h2>
          <p className="text-white/80 text-[10px] tracking-[0.4em] uppercase font-medium pl-1 border-l-2 border-white/30">
            Enterprise Resource Portal
          </p>
        </div>
        {type === "admin" ? (
          <div className="mb-8">
          <RoleToggle Role={role} setRole={setRole} />
          </div>

        ) : null}
        <LoginForm type={type} />
        {type === "admin" ? (
          <div className="mt-16 pt-8 border-t border-silver/40 dark:border-white/5 flex flex-col gap-6">
            <div className="flex justify-between items-center text-[10px] font-medium tracking-widest text-staff-muted uppercase">
              <span>Secure Gateway v4.0</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Online
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-bold text-staff-muted/70 uppercase tracking-widest">
              <a
                href="#"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Help Desk
              </a>
              <a
                href="#"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Security Protocol
              </a>
              <a
                href="#"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Compliance
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-24 space-y-8">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[11px] text-aurelia-gray">
                New to the house of Aurelia?
              </p>
              <button className="text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity text-aurelia-black">
                Request Membership
              </button>
            </div>

            <div className="flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] text-aurelia-gray pt-12">
              <a href="#privacy" className="hover:text-black transition-colors">
                Privacy
              </a>
              <a href="#terms" className="hover:text-black transition-colors">
                Terms
              </a>
              <a
                href="#concierge"
                className="hover:text-black transition-colors"
              >
                Concierge
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
