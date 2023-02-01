import PointOfSaleSharpIcon from "@mui/icons-material/PointOfSaleSharp";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";
import { useEffect, useState } from "react";
import Inventory2Icon from '@mui/icons-material/Inventory2';
export default function Home() {
  const [ApiData, setApiData] = useState({
    member: [],
    paket: [],
    outlet: [],
    transaksi: [],
  });
  const [PaketId, setPaketId] = useState(0);
  const getData = async () => {
    {
      let objRes = {};
      await axios.get("paket/").then(async (res) => {
        objRes.paket = res.data.data_paket;
      });
      await axios.get("member/").then(async (res) => {
        objRes.member = res.data.data_member;
      });
      await axios.get("outlet/").then(async (res) => {
        objRes.outlet = res.data.data_outlet;
      });
      await axios.get("transaksi/").then(async (res) => {
        objRes.transaksi = res.data.data_transaksi;
        console.log(res.data.data_transaksi);
      });
      setApiData(objRes);
    }
  };
  useEffect(async () => {
    getData();
  }, [PaketId]);
  return (
    <div className="page px-0">
      <h1 className="mb-5">Selamat Datang Di Aplikasi Laundry</h1>
      <div className="row w-100 d-flex justify-content-around">
        <div className="col-md-3">
          <div className="card card-dash w-100 bg-primary text-white p-3">
            <div className="d-flex justify-content-between mb-4">
              Transaksi
              <PointOfSaleSharpIcon></PointOfSaleSharpIcon>
            </div>
            <PointOfSaleSharpIcon className="floatinglogo"></PointOfSaleSharpIcon>
            <h3 className="fw-bold">{ApiData.transaksi.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-dash w-100 bg-success text-white p-3">
            <div className="d-flex justify-content-between mb-4">
              Member
              <PersonOutlineIcon></PersonOutlineIcon>
            </div>
            <PersonOutlineIcon className="floatinglogo"></PersonOutlineIcon>
            <h3 className="fw-bold">{ApiData.member.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-dash w-100 bg-warning text-white p-3">
            <div className="d-flex justify-content-between mb-4">
              Outlet
            <StorefrontIcon></StorefrontIcon>
            </div>
              <StorefrontIcon className="floatinglogo"></StorefrontIcon>
              <h3 className="fw-bold">{ApiData.outlet.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-dash w-100 bg-danger text-white p-3">
            <div className="d-flex justify-content-between mb-4">
              Paket
              <Inventory2Icon></Inventory2Icon>
            </div>
            <Inventory2Icon className="floatinglogo"></Inventory2Icon>
            <h3 className="fw-bold">{ApiData.paket.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
