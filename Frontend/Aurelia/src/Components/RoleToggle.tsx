import { useContext } from "react";
import { AuthContext } from "../contexts/Author";


const RoleToggle = () => {
  const {tab ,setTab}=useContext(AuthContext)
  return (
    <div className="flex h-11 w-full p-1 bg-neutral-50 dark:bg-white/5 border border-silver/50 dark:border-white/10">
      <label className={`
        flex cursor-pointer h-full grow items-center justify-center transition-all duration-300
        ${tab === "MANAGER" ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}
      `}>
        <span className={`
            text-xs font-semibold tracking-wider uppercase transition-colors
            ${tab === "MANAGER" ? 'text-black' : 'text-staff-muted'}
        `}>
            {"MANAGER"}
        </span>
        <input
          type="radio"
          name="role-toggle"
          value={"MANAGER"}
          className="hidden"
          checked={tab === "MANAGER"}
          onChange={() => setTab("MANAGER")}
        />
      </label>

      <label className={`
        flex cursor-pointer h-full grow items-center justify-center transition-all duration-300
        ${tab === "ADMIN" ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}
      `}>
        <span className={`
            text-xs font-semibold tracking-wider uppercase transition-colors
            ${tab === "ADMIN" ? 'text-black' : 'text-staff-muted'}
        `}>
            {"ADMIN"}
        </span>
        <input
          type="radio"
          name="role-toggle"
          value={"ADMIN"}
          className="hidden"
          checked={tab === "ADMIN"}
          onChange={() => setTab("ADMIN")}
        />
      </label>
    </div>
  );
};

export default RoleToggle;