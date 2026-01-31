import { useState } from "react";

export const useAuthForm = () => {
  const roleState = useState<"MANAGER" | "ADMIN">("MANAGER");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tab, setTab] = useState<"login" | "register">("login");

  return {
    roleState,
    nameState: [name, setName] as const,
    emailState: [email, setEmail] as const,
    passwordState: [password, setPassword] as const,
    tabState: [tab, setTab] as const,
  };
};
