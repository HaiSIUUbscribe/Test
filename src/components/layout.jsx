import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";

import HomePage from "../pages/index";
import TrangChu from "../pages/trangchu";
import LoginForm from "../pages/login";
import RegisterForm from "../pages/dangky"; 
import Cart from "../pages/cart"; 
import Danhmuc from "../pages/danhmuc";
import Lichsu from "../pages/lichsu";
import Thanhtoan from "../pages/thanhtoan";
import Chuyenkhoan from "../pages/chuyenkhoan";
import ChiTietSukien from "../pages/chitietsukien";
import Taikhoan from "../pages/taikhoan";
import OrderOptions from "../pages/tuychon";
import ThongTin from "../User/thongtin";
import ChangePassword from "../User/changeMk";
import ThanhTuu from "../User/thanhtuu";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
          <Route path="/home" element={<TrangChu />} />
          <Route path="/danhmuc" element={<Danhmuc />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/dangky" element={<RegisterForm />} />
          <Route path="/taikhoan" element={<Taikhoan />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/lichsu" element={<Lichsu />} />
          <Route path="/thanhtoan" element={<Thanhtoan />} />
          <Route path="/chuyenkhoan" element={<Chuyenkhoan />} />
          <Route path="/chitietsukien/:id" element={<ChiTietSukien />} />
          <Route path="/tuychon/:id" element={<OrderOptions />} />
          <Route path="/thongtin" element={<ThongTin />} />
          <Route path="/changeMk" element={<ChangePassword />} />
          <Route path="/thanhtuu" element={<ThanhTuu />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
