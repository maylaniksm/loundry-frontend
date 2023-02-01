import axios from "axios";
import { useState, useEffect, useMemo, useContext } from "react";
import { Form, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import FormInput from "../components/FormInput";
import useForm from "../hooks/useForm";
import DataTable from "react-data-table-component";
import moment from "moment/min/moment-with-locales";
import { UserContext } from "../hooks/UserContext";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import printJS from "print-js";

export default function Transaksi() {
  moment.locale("id");
  const [show, setShow] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showTitle, setShowTitle] = useState("Buat Transaksi Baru");
  const [disabled, setDisabled] = useState(false);
  const [showId, setShowId] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [APIDataOutlet, setAPIDataOutlet] = useState([]);
  const [APIDataPaket, setAPIDataPaket] = useState([]);
  const [APIDataMember, setAPIDataMember] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = APIData.filter(
    (item) =>
      item.kode_invoice &&
      item.kode_invoice.toLowerCase().includes(filterText.toLowerCase())
  );
  //indexes = aray = buat menyimpan paket waktu add paket transaksi
  //counter = menghitung jumlah paket yang mau dimasukkan
  const [indexes, setIndexes] = useState([]);
  const [counter, setCounter] = useState(0);
  const addPaket = () => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
    console.log(indexes);
  };
  const deleteDt = (iddt) => () => {
    console.log('deleted')
    // axios.delete("detail_transaksi/" + iddt).then(async (res) => {
    //   values.paket.forEach((element,index) => {
    //     if (element.id_detail_transaksi == iddt) {
    //       const index = values.paket.indexOf(index);
    //       if (index > -1) {
    //         values.paket.splice(index, 1); // 2nd parameter means remove one item only
    //       }
    //     }
    //   });
    // });
  };
  const removePaket = (index) => () => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounter((prevCounter) => prevCounter - 1);
  };
  const [UserData, setUser] = useState({
    id_user: 0,
    nama: "",
  });
  const { user, isLoading } = useContext(UserContext);

  useEffect(() => {
    if (!isLoading) {
      setUser(user);
      values.id_user = user.id_user;
    }
  }, [isLoading, user]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    axios.get("transaksi/").then(async (res) => {
      setAPIData(res.data.data_transaksi);
    });
    axios.get("outlet/").then(async (res) => {
      values.id_outlet = res.data.data_outlet[0].id_outlet;
      setAPIDataOutlet(res.data.data_outlet);
    });
    axios.get("paket/").then(async (res) => {
      values.id_paket = res.data.data_paket[0].id_paket;
      setAPIDataPaket(res.data.data_paket);
    });
    axios.get("member/").then(async (res) => {
      values.id_member = res.data.data_member[0].id_member;
      setAPIDataMember(res.data.data_member);
    });
  }, [refreshKey, filterText, resetPaginationToggle]);
  const columns = [
    {
      name: "Invoice",
      selector: (row) => row.kode_invoice,
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Outlet",
      selector: (row) => row.tb_outlet.nama,
      sortable: true,
    },
    {
      name: "Member",
      selector: (row) => row.tb_member.nama,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <div className="badge btn-primary d-block">{row.status}</div>
          <div className="badge btn-success d-block">{row.dibayar}</div>
        </>
      ),
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Total Harga",
      selector: (row) => "Rp. " + numberWithCommas(row.total),
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Tanggal",
      selector: (row) => moment(row.tgl).format("LLLL"),
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Batas Waktu",
      selector: (row) => moment(row.batas_waktu).format("LLLL"),
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row.dibayar,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Tanggal Bayar",
      selector: (row) => moment(row.tanggal_bayar).format("LLLL"),
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Penanggung Jawab",
      selector: (row) => row.tb_user.nama,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <>
          <a
            className="btn p-1 mx-1 btn-primary text-white"
            onClick={() => handleShowPrint(row)}
          >
            <LocalPrintshopIcon />
          </a>
          <button
            className="btn p-1 mx-1 btn-success text-white"
            onClick={() => handleShowDetail(row)}
          >
            <InfoIcon />
          </button>
          <button
            className="btn p-1 mx-1 btn-info text-white"
            onClick={() => handleShowEdit(row)}
          >
            <EditIcon />
          </button>
          <button
            className="btn btn-danger ms-3"
            onClick={() => hapus(row.id_transaksi)}
          >
            <DeleteForeverIcon />
          </button>
        </>
      ),
      sortable: true,
      minWidth: "200px",
    },
  ];
  let data = [
    {
      kode_invoice: "Conan the Barbarian",
      id_outlet: "Conan the Barbarian",
      harga: "1982",
    },
  ];
  const handleClose = () => {
    setShow(false);
    setShowPrint(false);
  };
  const handleShow = () => {
    setIndexes([]);
    setDisabled(false);
    setShowId("");
    setShowTitle("Buat Transaksi Baru");
    setShow(true);
  };
  const handleShowEdit = (transaksi) => {
    setIndexes([]);
    setDisabled(false);
    values.paket = transaksi.tb_detail_transaksi;
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    values.id_member = transaksi.id_member;
    values.total = transaksi.total;
    values.kode_invoice = transaksi.kode_invoice;
    values.tgl = transaksi.tgl;
    values.batas_waktu = moment(transaksi.batas_waktu).format("YYYY-MM-DD");
    values.status = transaksi.status;
    values.total = transaksi.total;
    values.dibayar = transaksi.dibayar;
    values.id_user = transaksi.id_user;
    values.existPaket = [];
    setShowId(transaksi.id_transaksi);
    setShowTitle("Edit Transaksi " + transaksi.kode_invoice);
    setShow(true);
  };
  const handleShowDetail = (transaksi) => {
    setIndexes([]);
    values.paket = transaksi.tb_detail_transaksi;
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    values.id_member = transaksi.id_member;
    values.total = transaksi.total;
    values.kode_invoice = transaksi.kode_invoice;
    values.tgl = transaksi.tgl;
    values.batas_waktu = moment(transaksi.batas_waktu).format("YYYY-MM-DD");
    values.status = transaksi.status;
    values.total = transaksi.total;
    values.dibayar = transaksi.dibayar;
    values.id_user = transaksi.id_user;
    values.existPaket = transaksi.tb_detail_transaksi;
    setShowId(transaksi.id_transaksi);
    setShowTitle("Detail Transaksi " + transaksi.kode_invoice);
    setDisabled(true);
    setShow(true);
  };
  const handleShowPrint = (transaksi) => {
    values.paket = transaksi.tb_detail_transaksi;
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    values.id_member = transaksi.id_member;
    values.total = transaksi.total;
    values.kode_invoice = transaksi.kode_invoice;
    values.tgl = transaksi.tgl;
    values.batas_waktu = moment(transaksi.batas_waktu).format("YYYY-MM-DD");
    values.status = transaksi.status;
    values.total = transaksi.total;
    values.dibayar = transaksi.dibayar;
    values.id_user = transaksi.id_user;
    setShowId(transaksi.id_transaksi);
    setShowTitle("Print Transaksi " + transaksi.kode_invoice);
    setDisabled(true);
    setShowPrint(true);
    setTimeout(function () {
      printJS("detailTrans", "html");
    }, 1000);
  };
  const { values, handleChange } = useForm({
    initialValues: {
      kode_invoice: "",
      id_outlet: "0",
      id_paket: "0",
      id_member: "0",
      total: "",
      kode_invoice: "",
      tgl: "",
      batas_waktu: "",
      paket: [],
      status: "",
      total: "",
      dibayar: "Lunas",
      id_user: "",
    },
  });
  const hapus = (id) => {
    axios.delete("transaksi/" + id).then(async (res) => {
      setRefreshKey((oldKey) => oldKey + 1);
      alert("data Telah terhapus");
    });
  };
  const applyData = (el, index) => {
    const pi = document.getElementById("paket_id_" + el.id_paket).value;
    const qt = document.getElementById("qty_id_" + el.qty).value;
    console.log("pi", pi);
    console.log("qt", qt);
    // document.getElementById("paket_id_" + index).value = el.id_paket;
    // document.getElementById("qty_id_" + index).value = el.qty;
  };

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <InputGroup className="mb-3">
      <FormControl
        id="search"
        type="text"
        placeholder="Filter By Name"
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <Button id="search-button" onClick={onClear} variant="outline-secondary">
        Clear
      </Button>
    </InputGroup>
  );
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);
  const Update = async (data) => {
    await axios
      .put("transaksi/", data)
      .then(async (res) => {
        handleClose();
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const Submit = async (event) => {
    event.preventDefault();
    if (showId) {
      let paketInp = [];
      indexes.forEach((element) => {
        const inputPaket = document.getElementById("paket_" + element).value;
        const inputQty = document.getElementById("qty_" + element).value;
        paketInp.push({
          id_paket: inputPaket,
          qty: inputQty,
        });
      });
      values.paket = paketInp;
      values.id_transaksi = showId;
      await axios
        .put("transaksi/", values)
        .then(async (res) => {
          handleClose();
          setRefreshKey((oldKey) => oldKey + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let paketInp = [];
      indexes.forEach((element) => {
        const inputPaket = document.getElementById("paket_" + element).value;
        const inputQty = document.getElementById("qty_" + element).value;
        paketInp.push({
          id_paket: inputPaket,
          qty: inputQty,
        });
      });
      values.paket = paketInp;
      await axios
        .post("transaksi/", values)
        .then(async (res) => {
          handleClose();
          setRefreshKey((oldKey) => oldKey + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const showTambah = () => {
    handleShow();
  };
  const belumBayar = (data) => {
    if (data.dibayar !== "Lunas") {
      return (
        <button
          onClick={() => {
            data.dibayar = "Lunas";
            Update(data);
          }}
          className="btn btn-success me-3 mb-5 mt-1"
        >
          Bayar
        </button>
      );
    }
    return <></>;
  };
  const belumSelesai = (data) => {
    if (data.status !== "Selesai") {
      return (
        <button
          onClick={() => {
            data.status = "Selesai";
            Update(data);
          }}
          className="btn btn-success me-3 mb-5 mt-1"
        >
          Proses Selesai
        </button>
      );
    }
    return <></>;
  };
  const ExpandedComponent = ({ data }) => (
    <div className="d-flex">
      {belumBayar(data)}
      {belumSelesai(data)}
    </div>
  );
  return (
    <div className="page px-0">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
          <h5>Transaksi</h5>
            <div className="d-flex justify-content-between  align-items-end w-100">
              <button className="btn btn-primary" onClick={showTambah}>
                Tambah
              </button>
              <InputGroup className="w-50">
                <FormControl
                  id="search"
                  type="text"
                  placeholder="Cari Data Berdasarkan Invoice"
                  aria-label="Search Input"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="row">
              <div className="col-12">
                <DataTable
                  columns={columns}
                  pagination
                  paginationResetDefaultPage={resetPaginationToggle}
                  data={filteredItems}
                  expandableRows
                  expandableRowsComponent={ExpandedComponent}
                />
              </div>
            </div>

            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{showTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={Submit}>
                  <Form.Group className="mb-3 w-100" controlId="formBasicNama">
                    <Form.Label>Invoice</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Invoice"}
                      name={"kode_invoice"}
                      value={values.kode_invoice}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Invoice Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3 w-100" controlId="formBasicNama">
                    <Form.Label>Member</Form.Label>
                    <select
                      disabled={disabled}
                      className="form-control"
                      name={"id_member"}
                      value={values.id_member}
                      onChange={handleChange}
                    >
                      {APIDataMember.map((x) => {
                        return (
                          <option key={x.id_member} value={x.id_member}>
                            {x.nama}
                          </option>
                        );
                      })}
                    </select>
                    <Form.Text className="text-muted">
                      Pilih Paket Transaksi.
                    </Form.Text>
                  </Form.Group>
                  {values.paket.map((el, index) => {
                    const paket = `paket[${index}]`;
                    const qty = `qty[${index}]`;
                    return (
                      <div
                        key={index}
                        className="card shadow w-100 p-3 mb-3 rounded"
                      >
                        {/* {!disabled?(
                          <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-danger ms-3"
                            onClick={() => deleteDt(el.id_detail_transaksi)}
                          >
                            <DeleteForeverIcon />
                          </button>
                        </div>
                        ):''} */}
                       
                        <Form.Group
                          className="mb-3 w-100"
                          controlId="formBasicNama"
                        >
                          <Form.Label>Paket</Form.Label>
                          <select
                            disabled={disabled}
                            className="form-control"
                            name={paket}
                            value={el.id_paket}
                            id={"paket_id_" + el.id_paket}
                          >
                            {APIDataPaket.map((x) => {
                              return (
                                <option key={x.id_paket} value={x.id_paket}>
                                  {x.nama_paket}
                                </option>
                              );
                            })}
                          </select>
                          <Form.Text className="text-muted">
                            Pilih Paket Transaksi.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 w-100"
                          controlId="formBasicNama"
                        >
                          <Form.Label>Berat</Form.Label>
                          <input
                            type="number"
                            disabled={disabled}
                            name={qty}
                            value={el.qty}
                            id={"qty_id_" + el.qty}
                            className="form-control"
                          ></input>
                          <Form.Text className="text-muted">
                            Masukan Berat.
                          </Form.Text>
                        </Form.Group>
                        {/* {!disabled ? (
                        <div className="d-flex">
                          <button
                            className="btn btn-danger mb-3"
                            onClick={removePaket(index)}
                          >
                            remove
                          </button>
                        </div>
                        ):''} */}
                      </div>
                    );
                  })}
                  {indexes.map((index) => {
                    const paket = `paket[${index}]`;
                    const qty = `qty[${index}]`;
                    return (
                      <div
                        key={index}
                        className="card shadow w-100 p-3 mb-3 rounded"
                      >
                        <Form.Group
                          className="mb-3 w-100"
                          controlId="formBasicNama"
                        >
                          <Form.Label>Paket</Form.Label>
                          <select
                            disabled={disabled}
                            className="form-control"
                            name={paket}
                            id={"paket_" + index}
                          >
                            {APIDataPaket.map((x) => {
                              return (
                                <option key={x.id_paket} value={x.id_paket}>
                                  {x.nama_paket}
                                </option>
                              );
                            })}
                          </select>
                          <Form.Text className="text-muted">
                            Pilih Paket Transaksi.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group
                          className="mb-3 w-100"
                          controlId="formBasicNama"
                        >
                          <Form.Label>Berat</Form.Label>
                          <input
                            type="number"
                            name={qty}
                            id={"qty_" + index}
                            className="form-control"
                          ></input>
                          <Form.Text className="text-muted">
                            Masukan Berat.
                          </Form.Text>
                        </Form.Group>
                        <div className="d-flex">
                          <button
                            className="btn btn-danger mb-3"
                            onClick={removePaket(index)}
                          >
                            remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!disabled ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addPaket}
                    >
                      Add Paket
                    </button>
                  ) : (
                    ""
                  )}
                  <Form.Group
                    className="mb-3 w-100"
                    controlId="formBasicAlamat"
                  >
                    <Form.Label>Outlet</Form.Label>
                    <select
                      disabled={disabled}
                      className="form-control"
                      name={"id_outlet"}
                      value={values.id_outlet}
                      onChange={handleChange}
                    >
                      {APIDataOutlet.map((x) => {
                        return (
                          <option key={x.id_outlet} value={x.id_outlet}>
                            {x.nama}
                          </option>
                        );
                      })}
                    </select>
                    <Form.Text className="text-muted">
                      Masukan Outlet Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 w-100"
                    controlId="formBasicTelepon"
                  >
                    <Form.Label>Harga</Form.Label>
                    <FormInput
                      disabled={disabled}
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Harga"}
                      name={"total"}
                      value={values.total}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Total Harga Akan Tergenerate otomatis.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 w-100"
                    controlId="formBasicTelepon"
                  >
                    <Form.Label>Estimasi Batas Waktu</Form.Label>
                    <FormInput
                      disabled={disabled}
                      className="form-control"
                      type={"date"}
                      placeholder={"Masukan Batas Waktu"}
                      name={"batas_waktu"}
                      value={values.batas_waktu}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Estimasi Batas Waktu Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 w-100"
                    controlId="formBasicTelepon"
                  >
                    <Form.Label>Pembayaran</Form.Label>
                    <select
                      disabled={disabled}
                      className="form-control"
                      name={"dibayar"}
                      value={values.dibayar}
                      onChange={handleChange}
                    >
                      <option>Lunas</option>
                      <option>Belum Dibayar</option>
                    </select>
                    <Form.Text className="text-muted">
                      Masukan Total Harga Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 w-100"
                    controlId="formBasicTelepon"
                  >
                    <Form.Label>Status</Form.Label>
                    <select
                      disabled={disabled}
                      className="form-control"
                      name={"status"}
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option>Baru</option>
                      <option>Dalam Proses</option>
                      <option>Selesai</option>
                      <option>Diambil</option>
                    </select>
                  </Form.Group>
                  <Button variant="primary" className="ms-auto" type="submit">
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
            <Modal size="xl" show={showPrint} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{showTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div id="detailTrans" className="w-100">
                  <div className="row W-100">
                    <table className="print-table W-100" border="0">
                      <tr>
                        <td>Invoice</td>
                        <td>:</td>
                        <td>{values.kode_invoice}</td>
                      </tr>
                      <tr>
                        <td>Member</td>
                        <td>:</td>
                        <td>
                          <select
                            disabled={disabled}
                            className="form-control d-inline w-25"
                            name={"id_member"}
                            value={values.id_member}
                            onChange={handleChange}
                          >
                            {APIDataMember.map((x) => {
                              return (
                                <option key={x.id_member} value={x.id_member}>
                                  {x.nama}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Outlet</td>
                        <td>:</td>
                        <td>
                          <select
                            disabled={disabled}
                            className="form-control d-inline w-25"
                            name={"id_outlet"}
                            value={values.id_outlet}
                            onChange={handleChange}
                          >
                            {APIDataOutlet.map((x) => {
                              return (
                                <option key={x.id_outlet} value={x.id_outlet}>
                                  {x.nama}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Harga</td>
                        <td>:</td>
                        <td>{values.total}</td>
                      </tr>
                      <tr>
                        <td>Estimasi Batas Waktu</td>
                        <td>:</td>
                        <td>{values.batas_waktu}</td>
                      </tr>
                      <tr>
                        <td>Pembayaran</td>
                        <td>:</td>
                        <td>{values.dibayar}</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>:</td>
                        <td>{values.status}</td>
                      </tr>
                    </table>
                    {values.paket.map((el, index) => {
                      const paket = `paket[${index}]`;
                      const qty = `qty[${index}]`;
                      return (
                        <div
                          key={index}
                          className="card shadow w-100 p-3 mb-3 rounded"
                        >
                          <Form.Group
                            className="mb-3 w-100"
                            controlId="formBasicNama"
                          >
                            <Form.Label>Paket</Form.Label>
                            <select
                              disabled={disabled}
                              className="form-control"
                              name={paket}
                              value={el.id_paket}
                              id={"paket_id_" + el.id_paket}
                            >
                              {APIDataPaket.map((x) => {
                                return (
                                  <option key={x.id_paket} value={x.id_paket}>
                                    {x.nama_paket}
                                  </option>
                                );
                              })}
                            </select>
                            <Form.Text className="text-muted">
                              Pilih Paket Transaksi.
                            </Form.Text>
                          </Form.Group>
                          <Form.Group
                            className="mb-3 w-100"
                            controlId="formBasicNama"
                          >
                            <Form.Label>Berat</Form.Label>
                            <input
                              type="number"
                              disabled={disabled}
                              name={qty}
                              value={el.qty}
                              id={"qty_id_" + el.qty}
                              className="form-control"
                            ></input>
                            <Form.Text className="text-muted">
                              Masukan Berat.
                            </Form.Text>
                          </Form.Group>
                          {/* {!disabled ? (
                        <div className="d-flex">
                          <button
                            className="btn btn-danger mb-3"
                            onClick={removePaket(index)}
                          >
                            remove
                          </button>
                        </div>
                        ):''} */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
