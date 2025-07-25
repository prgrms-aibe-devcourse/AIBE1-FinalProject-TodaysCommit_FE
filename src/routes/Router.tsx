// src/routes/Router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BuyerLayout from "@/components/layout/buyerLayout/BuyerLayout.tsx";
import SellerLayout from "@/components/layout/sellerLayout/SellerLayout.tsx";
import HomePage from "@/pages/mainpage/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RoleSelectionPage from "@/pages/auth/RoleSelectionPage";
import NotFoundPage from "@/pages/common/NotFoundPage.tsx";
import SellerStorePage from "@/pages/SellerStorePage.tsx";
import OrderPayPage from "@/pages/OrderPaymentPage/OrderPaymentPage.tsx";
import MyPage from "@/pages/Account/Account.tsx";
import ProductListPage from "@/pages/ProductListPage.tsx";
import ProductManagementPage from "@/pages/SellerDashboardPage/ProductManagementPage.tsx";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SellerInfoPage from "@/components/SellerDashboard/SellerInfo";
import { SettlementPage } from "@/components/SellerDashboard/settlement";
import SellerDashboardDashboardPage from "@/components/SellerDashboard/Dashboard";
import CustomerManagementPage from "@/pages/SellerDashboardPage/CustomerManagementPage.tsx";
import OrdersManagementPage from "@/pages/SellerDashboardPage/OrderManagementPage.tsx";
import ShoppingCartPage from "@/pages/ShoppingCartPage";
import CustomerServiceCenterPageServicePage from "@/pages/CusServiceCenterPage/CustomerServiceCenterPage.tsx";
import WithdrawalSuccessPage from "@/pages/Account/WidrawSuccess.tsx";
import AuthGuard from "@/routes/AuthGuard.tsx";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailPage from "../pages/PaymentFailPage";

// React Router 7 사용
const router = createBrowserRouter([
  {
    path: "/",
    element: <BuyerLayout />, // 구매자용 레이아웃 (BuyerHeader + Outlet + BuyerFooter)
    children: [
      // 메인페이지
      { index: true, element: <HomePage /> },

      { path: "productsList", element: <ProductListPage /> }, // 상품 목록 페이지

      // 상품 상세 페이지
      {
        path: "product-detail",
        element: <ProductDetailPage />,
      },

      // 마이페이지
      {
        path: "account",
        element: <AuthGuard allowedRoles="ROLE_BUYER" />,
        children: [{ index: true, element: <MyPage /> }],
      },
      {
        path: "productsList",
        element: <ProductListPage />,
      },
      {
        path: "productsList/:pet",
        element: <ProductListPage />,
      },
      {
        path: "productsList/:pet/:type",
        element: <ProductListPage />,
      }, // 상품 목록 페이지

      // 장바구니
      {
        path: "cart",
        element: <AuthGuard allowedRoles="ROLE_BUYER" />,
        children: [{ index: true, element: <ShoppingCartPage /> }],
      },

      { path: "support", element: <CustomerServiceCenterPageServicePage /> },
      // 상품 상세 페이지
      {
        path: "products/:productNumber",
        element: <ProductDetailPage />,
      },

      // 판매자 스토어 페이지 (구매자가 보는 판매자 정보)
      { path: "seller/:sellerId", element: <SellerStorePage /> },

      // 로그인 & 역할선택
      { path: "login", element: <LoginPage /> },
      {
        path: "role-selection",
        element: <RoleSelectionPage />,
      },

      // 결제 및 계정 관련 페이지
      {
        path: "orderpayment",
        element: <AuthGuard allowedRoles="ROLE_BUYER" />,
        children: [{ index: true, element: <OrderPayPage /> }],
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "payment-fail",
        element: <PaymentFailPage />,
      },

      // 404 페이지
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/seller",
    element: <SellerLayout />, // 판매자용 레이아웃 (SellerHeader + Sidebar + Outlet)
    children: [
      {
        path: "/seller",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />,
        children: [
          {
            index: true,
            element: <SellerDashboardDashboardPage />,
          },
        ],
      },
      {
        path: "products",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />,
        children: [
          {
            index: true,
            element: <ProductManagementPage />,
          },
        ], // todo 상품관리 탭
      },
      {
        path: "orders",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />, //todo 주문배송 페이지 탭
        children: [
          {
            index: true,
            element: <OrdersManagementPage />,
          },
        ],
      },
      {
        path: "settlement",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />, // 정산탭
        children: [
          {
            index: true,
            element: <SettlementPage />,
          },
        ],
      },
      {
        path: "customers",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />,
        children: [
          {
            index: true,
            element: <CustomerManagementPage />,
          },
        ],
      },
      {
        path: "info",
        element: <AuthGuard allowedRoles="ROLE_SELLER" />,
        children: [
          {
            index: true,
            element: <SellerInfoPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/withdraw",
    element: <WithdrawalSuccessPage></WithdrawalSuccessPage>,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
