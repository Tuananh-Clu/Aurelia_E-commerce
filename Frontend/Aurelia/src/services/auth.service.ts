import { signInWithPopup } from "firebase/auth";
import { auth, GoogleProvider } from "./firebase";
import { api_Response } from "./http";
import { api_Config, UseApiUrl } from "./api";


export const LogginWithFireBase = async () => {
  const result = await signInWithPopup(auth, GoogleProvider);

  try {
    api_Response(
      `${UseApiUrl(
        api_Config.authentication.LogInWithFireBase
      )}?token=${await result.user.getIdToken()}`,
      "POST",
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    localStorage.setItem("IsSuccessFireBaseLogin", "true");
  } catch (error) {
    console.error("Error during Firebase login:", error);
  }
  return result;
};

export const logOutFireBase = async () => {
  await auth.signOut();
    localStorage.removeItem("IsSuccessFireBaseLogin");
};
