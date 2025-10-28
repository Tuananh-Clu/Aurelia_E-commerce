import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./config/FIlterProduct.tsx";
import { AuthProvider } from "./config/Author.tsx";
import { StoreProvider } from "./config/Store.tsx";
import { CartProvider } from "./config/CartContext.tsx";
import { AiPoseMeasureProvider } from "./config/AIPoseMeasure.tsx";
import { AppointmentProvider } from "./config/AppointmentContext.tsx";
import { DiaChiProvider } from "./config/DiaChiContext.tsx";
import { AuthForShopProvider } from "./config/AuthorForShop.tsx";
import { DashBoardShopProvider } from "./config/DashBoardShopContext.tsx";
import { NotificationProvider } from "./config/NotifycationContext.tsx";
import { AuthorForAdminProvider } from "./config/AuthorForAdmin.tsx";
import { AdminProvider } from "./config/AdminContext.tsx";
import { CollectionProvider } from "./config/SeasonContext.tsx";

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
