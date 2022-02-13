import "./App.scss";
import "./App.css";
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
// import Default from "./Layout/Default";
function App() {
  const { user, setUser, isLoading } = useFindUser();

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Default />}>
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<home />} />
            </Route>
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
