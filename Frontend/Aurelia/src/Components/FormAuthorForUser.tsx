import { AuthPanel } from "./AuthPanel";
import { EditorialPanel } from "./EditorialPanel";
import { Footer } from "./HomeLayoutComponent/Footer";
import { Navbar } from "./HomeLayoutComponent/Navbar";

export const FormAuthor = () => {
  return (
    <>
      <Navbar />
      <main  className="flex min-h-screen w-full mt-16">
        <EditorialPanel role="USER" />
        <AuthPanel type="client" />
      </main>

      <Footer />
    </>
  );
};
