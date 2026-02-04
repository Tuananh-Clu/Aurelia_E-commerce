import { useContext, useState } from "react";
import { InputGroup } from "./InputGroup";
import { AuthContext } from "../contexts/Author";
import { AuthForShopContext } from "../contexts/AuthorForShop";
import { AuthorForAdminContext } from "../contexts/AuthorForAdmin";
import RoleToggle from "./RoleToggle";


export const LoginForm = ({ type }: { type: string }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { tab, setTab, logInWIthGoogle, logIn, register } =
    useContext(AuthContext);
  const { logIn: loginforShop } = useContext(AuthForShopContext);
  const { Login } = useContext(AuthorForAdminContext);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (type) {
      case "client":
        setIsLoading(true);
        if (tab === "login") {
          await logIn(formData.email, formData.password);
        } else {
          await register(formData.userName, formData.email, formData.password);
        }
        setIsLoading(false);
        break;
      case "ADMIN":
        if (tab === "ADMIN") {
          await Login(formData.email, formData.password);
        } else if (tab === "MANAGER") {
          await loginforShop(formData.email, formData.password);
        }
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {type==="ADMIN" && (
        <RoleToggle />
      )}
      <div className="space-y-6">
        {tab === "register" && (
          <InputGroup
            id="username"
            type="text"
            label="Username"
            value={formData.userName}
            onChange={(e:any) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            placeholder="client@aurelia.com"
            required
          />
        )}

        <InputGroup
          id="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(e:any) => setFormData({ ...formData, email: e.target.value })}
          placeholder="client@aurelia.com"
          required
        />

        <InputGroup
          id="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e:any) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="••••••••"
          required
          actionLink={{
            text: "Forgot?",
            href: "#forgot-password",
          }}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-aurelia-black text-black py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-800 disabled:bg-neutral-600 transition-all duration-300 flex justify-center items-center"
        >
          {isLoading ? (
            <span className="animate-pulse">Authenticating...</span>
          ) : (
            "Sign In"
          )}
        </button>
        {type === "client" && (
          <div>
            <button
              type="button"
              disabled={isLoading}
              className="w-full bg-aurelia-black text-black py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-800 disabled:bg-neutral-600 transition-all duration-300 flex justify-center items-center"
              onClick={logInWIthGoogle}
            >
              {isLoading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                "Sign In with Google"
              )}
            </button>
            <button
              type="button"
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              className="w-full bg-aurelia-black text-black py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-800 disabled:bg-neutral-600 transition-all duration-300 flex justify-center items-center"
            >
              {tab === "login" ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
