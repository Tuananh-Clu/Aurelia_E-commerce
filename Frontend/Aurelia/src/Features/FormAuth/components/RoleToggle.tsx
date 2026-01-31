import React from 'react';

export enum UserRole {
  MANAGER = "Manager",
  ADMIN = "Admin"
}


const RoleToggle = ({Role,setRole}:{Role: "MANAGER" | "ADMIN",setRole:React.Dispatch<React.SetStateAction<"MANAGER" | "ADMIN">>}) => {
  return (
    <div className="flex h-11 w-full p-1 bg-neutral-50 dark:bg-white/5 border border-silver/50 dark:border-white/10">
      <label className={`
        flex cursor-pointer h-full grow items-center justify-center transition-all duration-300
        ${Role === "MANAGER" ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}
      `}>
        <span className={`
            text-xs font-semibold tracking-wider uppercase transition-colors
        `}>
            {UserRole.MANAGER}
        </span>
        <input
          type="radio"
          name="role-toggle"
          value={UserRole.MANAGER}
          className="hidden"
          checked={Role === "MANAGER"}
          onChange={() => setRole("MANAGER")}
        />
      </label>

      <label className={`
        flex cursor-pointer h-full grow items-center justify-center transition-all duration-300
        ${Role === "ADMIN" ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}
      `}>
        <span className={`
            text-xs font-semibold tracking-wider uppercase transition-colors
        `}>
            {UserRole.ADMIN}
        </span>
        <input
          type="radio"
          name="role-toggle"
          value={UserRole.ADMIN}
          className="hidden"
          checked={Role === "ADMIN"}
          onChange={() => setRole("ADMIN")}
        />
      </label>
    </div>
  );
};

export default RoleToggle;