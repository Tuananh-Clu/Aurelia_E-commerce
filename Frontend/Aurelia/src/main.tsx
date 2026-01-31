import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./Providers/FIlterProduct.tsx";
import { AuthProvider } from "./Providers/Author.tsx";
import { StoreProvider } from "./Providers/Store.tsx";
import { CartProvider } from "./Providers/CartContext.tsx";
import { AiPoseMeasureProvider } from "./Providers/AIPoseMeasure.tsx";
import { AppointmentProvider } from "./Providers/AppointmentContext.tsx";
import { DiaChiProvider } from "./Providers/DiaChiContext.tsx";
import { AuthForShopProvider } from "./Providers/AuthorForShop.tsx";
import { DashBoardShopProvider } from "./Providers/DashBoardShopContext.tsx";
import { NotificationProvider } from "./Providers/NotifycationContext.tsx";
import { AuthorForAdminProvider } from "./Providers/AuthorForAdmin.tsx";
import { AdminProvider } from "./Providers/AdminContext.tsx";
import { CollectionProvider } from "./Providers/SeasonContext.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    {" "}
    <BrowserRouter>
      <CollectionProvider>
        <AuthorForAdminProvider>
          <AdminProvider>
            <NotificationProvider>
              <DashBoardShopProvider>
                <DiaChiProvider>
                  <AppointmentProvider>
                    <AiPoseMeasureProvider>
                      <CartProvider>
                        <StoreProvider>
                          <AuthForShopProvider>
                            <AuthProvider>
                              <FilterProvider>
                                <App />
                              </FilterProvider>
                            </AuthProvider>
                          </AuthForShopProvider>
                        </StoreProvider>
                      </CartProvider>
                    </AiPoseMeasureProvider>
                  </AppointmentProvider>
                </DiaChiProvider>
              </DashBoardShopProvider>
            </NotificationProvider>
          </AdminProvider>
        </AuthorForAdminProvider>
      </CollectionProvider>
    </BrowserRouter>
  </>
);
