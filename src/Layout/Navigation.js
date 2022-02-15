import { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { UserContext } from "../hooks/UserContext";
import HomeIcon from "@mui/icons-material/Home";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

const Navigation = () => {
  const [UserData, setUser] = useState({
    id_user: 0,
    nama: "",
  });
  const [NavData, setNavData] = useState(<></>);
  const { user, isLoading } = useContext(UserContext);
  let role = "";
  useEffect(() => {
    if (!isLoading) {
      setUser(user);
      role = user.role;
      if (role == "kasir" || role == "admin") {
        setNavData(
          <>
            <Nav.Item>
              <Nav.Link href="/member">
                <RememberMeOutlinedIcon /> Member
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/transaksi">
                <LocalAtmOutlinedIcon /> Transaksi
              </Nav.Link>
            </Nav.Item>
            {navDataRender()}
          </>
        );
      }
    }
  }, [isLoading, user]);
  const navDataRender = () => {
    if(role=="admin"){
      return (
        <>
          <Nav.Item>
            <Nav.Link href="/user">
              <PersonOutlineOutlinedIcon /> Pengguna
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/outlet">
              <StoreOutlinedIcon /> Outlet
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/paket">
              <ListAltOutlinedIcon /> Paket
            </Nav.Link>
          </Nav.Item>
        </>
      );
    }
  }
  return (
    <>
      <Nav
        className="col-md-12 d-none d-md-block bg-white sidebar h-100"
        activeKey="/home"
      >
        <div className="sidebar-sticky"></div>
        <Nav.Item>
          <Nav.Link href="/home">
            <HomeIcon /> Dashboard
          </Nav.Link>
        </Nav.Item>
        {NavData}
        <Nav.Item>
          <Nav.Link href="/laporan">
            <SummarizeOutlinedIcon /> Laporan
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};
export default Navigation;
