import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotifycationContext";
import { AuthContext } from "../../contexts/Author";
export const PopupSetting = () => {
  const { logOutShop } = useContext(NotificationContext);
  const {logOut}=useContext(AuthContext)
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOutShop();
    logOut({typeAccount:"shop"});
    localStorage.removeItem("shop");
    navigate("/login");
  };
  return (
    <div className="absolute bottom-20 bg-white  text-black p-4 rounded shadow-lg w-50 flex flex-col items-center ">
      <h1 className="font-bold hover:bg-gray-600 px-12 py-2">Setting</h1>
      <button
        className="mt-2 hover:bg-red-700 px-12 py-2 rounded font-bold"
        onClick={handleLogOut}
      >
        Log out
      </button>
    </div>
  );
};
