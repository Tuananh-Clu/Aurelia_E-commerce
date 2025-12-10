import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./contexts/FIlterProduct.tsx";
import { AuthProvider } from "./contexts/Author.tsx";
import { StoreProvider } from "./contexts/Store.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { AiPoseMeasureProvider } from "./contexts/AIPoseMeasure.tsx";
import { AppointmentProvider } from "./contexts/AppointmentContext.tsx";
import { DiaChiProvider } from "./contexts/DiaChiContext.tsx";
import { AuthForShopProvider } from "./contexts/AuthorForShop.tsx";
import { DashBoardShopProvider } from "./contexts/DashBoardShopContext.tsx";
import { NotificationProvider } from "./contexts/NotifycationContext.tsx";
import { AuthorForAdminProvider } from "./contexts/AuthorForAdmin.tsx";
import { AdminProvider } from "./contexts/AdminContext.tsx";
import { CollectionProvider } from "./contexts/SeasonContext.tsx";

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
