import { Navbar } from "../Components/HomeComponent/Navbar";
import { Footer } from "../Components/HomeComponent/Footer";

import { DashBoard } from "../Components/AccountComponents/User/DashBoard";
import { FormAuthor } from "../Components/FormAuthorForUser";
import { useContext } from "react";
import { AuthContext } from "../config/Author";



export const Account = () => {

const {isSignned}=useContext(AuthContext)
  return (
    <>
      <Navbar />
       {isSignned?
       <DashBoard/>
      :
      <FormAuthor/>
      }
      <div className="mt-40">
      <Footer />
      </div>

    </>
  );
};
