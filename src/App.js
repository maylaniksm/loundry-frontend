//app js = isinya router
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContext } from "./hooks/UserContext";
import PrivateRoute from "./pages/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import useFindUser from "./hooks/useFindUser";
import Default from "./Layout/Default";
import Outlet from "./pages/Outlet";
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import User from "./pages/User";
import Transaksi from "./pages/Transakasi";
import Laporan from "./pages/Laporan";
// import Default from "./Layout/Default";
function App() {
  const { user, setUser, isLoading } = useFindUser();

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
         <Route element={<Default />}>  {/* default = memanggil navbar dan sidebar */}
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>
            <Route element={<PrivateRoute role="kasir" />}>
              <Route path="/member" element={<Member />} />
              <Route path="/transaksi" element={<Transaksi />} />
            </Route>
            <Route element={<PrivateRoute role="admin" />}>
              <Route path="/outlet" element={<Outlet />} />
              <Route path="/user" element={<User />} />
              <Route path="/paket" element={<Paket />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute />}> {/* //owner */}
            <Route path="/laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
    // <BrowserRouter>
    //   <Routes>
    //     {/* <UserContext.Provider value={{ user, setUser, isLoading }}> */}
    //       <Route exact path="/" component={Landing} />
    //       <Route path="/register" component={Register} />
    //       <Route path="/login" component={Login} />
    //       {/* <Route element={<Default />}>
    //         <PrivateRoute path="/home" component={Home} />
    //       </Route> */}
    //       <Route component={NotFound} />
    //     {/* </UserContext.Provider> */}
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;