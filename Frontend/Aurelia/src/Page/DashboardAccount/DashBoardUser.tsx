
import { useContext } from "react";
import { Navbar } from "../../Features/Home/components/Navbar";
import { AuthContext } from "../../Providers/Author";
import { DashBoard } from "../../Features/DashBoard/DashBoardUser/components/DashBoard";
import { FormAuthor } from "../../Features/FormAuth/components/FormAuthorForUser";
import { Footer } from "../../Features/Home/components/Footer";




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
