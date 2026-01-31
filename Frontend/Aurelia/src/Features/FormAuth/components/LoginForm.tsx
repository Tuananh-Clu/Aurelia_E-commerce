
import React, { useContext } from "react";
import { useAuthForm } from "../hook/useAuthForm";
import { InputGroup } from "./InputGroup";
import { AuthContext } from "@/Providers/Author";
import { AuthForShopContext } from "@/Providers/AuthorForShop";
import { AuthorForAdminContext } from "@/Providers/AuthorForAdmin";
import { LogginWithFireBase } from "@/services/auth.service";

export const LoginForm = ({ type }: { type:  "admin" | "user"}) => {
  const {
    emailState: [email, setEmail],
    passwordState: [password, setPassword],
    nameState: [username, setUsername],
    tabState: [tab, setTab],
    roleState: [role, setRole],
  } = useAuthForm();
  const { logIn: logInUser, register } = useContext(AuthContext);
  const { Login } = useContext(AuthorForAdminContext);
  const { logIn } = useContext(AuthForShopContext);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (type === "admin") {
      if(role==="ADMIN"){
        Login(email, password);
      }
      else{
        logIn(email, password);
      }
    } else {
      if (tab === "login") {
        logInUser(email, password);
      } else {
        register(username, email, password);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        {tab === "register" && (
          <InputGroup
            id="username"
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
          />
        )}
        <InputGroup
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@aurelia.com"
          required
        />

        <InputGroup
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          actionLink={{
            text: "Forgot?",
            href: "/Forgot-PassWord",
          }}
        />
      </div>
      <button
        onClick={() => {}}
        type="submit"
        className="w-full bg-aurelia-black text-black hover:text-white py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-800 disabled:bg-neutral-600 transition-all duration-300 flex justify-center items-center"
      >
        {tab === "login" ? "Log In" : "Sign Up"}
      </button>
      {type === "admin" ? null : (
        <div>
          <button
            type="button"
            onClick={LogginWithFireBase}
            className="w-full border border-neutral-300 hover:bg-black hover:text-white text-aurelia-black py-5 text-xs font-medium tracking-[0.2em] uppercase  disabled:bg-neutral-200 transition-all duration-300 flex justify-center items-center"
          >
            {tab === "login" ? "Log In with Google" : "Sign Up with Google"}
          </button>

          <button
            type="button"
            onClick={() => setTab(tab === "login" ? "register" : "login")}
            className="w-full border border-neutral-300 hover:bg-black hover:text-white text-aurelia-black py-5 text-xs font-medium tracking-[0.2em] uppercase  disabled:bg-neutral-200 transition-all duration-300 flex justify-center items-center"
          >
            {tab === "login" ? "Switch to Sign Up" : "Switch to Log In"}
          </button>
        </div>
      )}
      <div></div>
    </form>
  );
};

