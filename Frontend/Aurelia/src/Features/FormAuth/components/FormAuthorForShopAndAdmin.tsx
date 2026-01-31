
import { EditorialPanel } from "./EdithoralPanel";
import { AuthPanel } from "./AuthPanel";
import { Navbar } from "@/Features/Home/components/Navbar";
import { Footer } from "@/Features/Home/components/Footer";

export default function FormAuthorForShopAndAdmin() {


  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex h-full w-full mt-16">
        <EditorialPanel type="admin" />
        <AuthPanel type="admin" />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
