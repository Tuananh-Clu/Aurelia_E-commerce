import { Navbar } from "../../../Features/Home/components/Navbar";
import { useCheckout } from "../hooks";
import { CheckoutForm } from "./CheckOutForm";
import { OrderSummary } from "./OrderSummary";
import { LoadingOverlay } from "../../../shared/components/LoadingOverlay";
import { Footer } from "../../../Features/Home/components/Footer";

export const Checkout = () => {
  const { isSubmitting } = useCheckout();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      <LoadingOverlay isLoading={isSubmitting} />

        <Navbar />
        <div className="mx-auto flex w-full max-w-[1440px] h-screen flex-col lg:flex-row mt-40 mb-20 lg:mb-0 shadow-lg rounded-lg overflow-hidden">
          <div className="flex-1 px-6 py-10 md:px-12 lg:px-20 lg:py-16 bg-white dark:bg-background-dark">
            <CheckoutForm />
          </div>
          <div className="w-full lg:w-[480px] lg:border-l lg:border-[#f2f2f2] bg-[#fafafa] dark:bg-[#1f1f1f] dark:border-white/10">
            <OrderSummary />
          </div>
        </div>
        <Footer />
    </div>
  );
};
