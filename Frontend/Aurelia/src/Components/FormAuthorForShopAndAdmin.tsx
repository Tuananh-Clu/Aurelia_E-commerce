
import { Navbar } from "./HomeLayoutComponent/Navbar";
import { Footer } from "./HomeLayoutComponent/Footer";
import { EditorialPanel } from "./EditorialPanel";
import { AuthPanel } from "./AuthPanel";


export default function FormAuthorForShopAndAdmin() {


  return (
    <>
      <Navbar />
      <main className="flex min-h-screen w-full mt-16">
        <EditorialPanel role="MANAGER" />
        <AuthPanel type="ADMIN" />
      </main>
      <Footer />
    </>
  );
}

