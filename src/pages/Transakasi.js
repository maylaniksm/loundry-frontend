import axios from "axios";
import { useState, useEffect, useMemo, useContext } from "react";
import { Form, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import FormInput from "../components/FormInput";
import useForm from "../hooks/useForm";
import DataTable from "react-data-table-component";
import moment from "moment/min/moment-with-locales";
import { UserContext } from "../hooks/UserContext";

export default function Transaksi() {
  moment.locale("id");
  const [show, setShow] = useState(false);
  const [showTitle, setShowTitle] = useState("Buat Transaksi Baru");
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
      name: "Paket",
      selector: (row) => row.tb_paket.nama_paket,
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Outelt",
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
      selector: (row) => row.status,
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
      name: "Biaya Tambahan",
      selector: (row) => row.biaya_tambahan,
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Diskon",
      selector: (row) => row.diskon,
      sortable: true,
      minWidth: "175px",
    },
    {
      name: "Pajak",
      selector: (row) => row.pajak,
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
          <button
            className="btn btn-danger ms-3"
            onClick={() => hapus(row.id_transaksi)}
          >
            Hapus
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
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShowId("");
    setShowTitle("Buat Transaksi Baru");
    setShow(true);
  };
  const handleShowEdit = (transaksi) => {
    values.kode_invoice = transaksi.kode_invoice;
    values.id_outlet = transaksi.id_outlet;
    values.harga = transaksi.harga;
    setShowId(transaksi.id_transaksi);
    setShowTitle("Edit Transaksi " + transaksi.kode_invoice);
    setShow(true);
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
      biaya_tambahan: "",
      diskon: "",
      pajak: "",
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
      <Button
        id="search-button"
        onClick={onClear}
        variant="outline-secondary"
        id="button-addon2"
      >
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
  }
  const Submit = async (event) => {
    event.preventDefault();
    if (showId) {
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
      return <button onClick={()=>{
        data.dibayar = "Lunas"
        Update(data)
      }} className="btn btn-success me-3 mb-5 mt-1">Bayar</button>;
    }
    return <></>;
  };
  const belumSelesai = (data) => {
    if (data.status !== "Selesai") {
      return (
        <button onClick={()=>{
          data.status = "Selesai"
          Update(data)
        }} className="btn btn-success me-3 mb-5 mt-1">Proses Selesai</button>
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
            <div className="d-flex justify-content-between  align-items-end w-100">
              <button className="btn btn-primary" onClick={showTambah}>
                Tambah
              </button>
              <InputGroup className="w-50">
                <FormControl
                  id="search"
                  type="text"
                  placeholder="Cari Data Berdasarkan Nama"
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
                  <Form.Group className="mb-3" controlId="formBasicNama">
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
                  <Form.Group className="mb-3" controlId="formBasicNama">
                    <Form.Label>Member</Form.Label>
                    <select
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
                  <Form.Group className="mb-3" controlId="formBasicNama">
                    <Form.Label>Paket</Form.Label>
                    <select
                      className="form-control"
                      name={"id_paket"}
                      value={values.id_paket}
                      onChange={handleChange}
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
                  <Form.Group className="mb-3" controlId="formBasicAlamat">
                    <Form.Label>Outlet</Form.Label>
                    <select
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
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Harga</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Harga"}
                      name={"total"}
                      value={values.total}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Total Harga Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Estimasi Batas Waktu</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"date"}
                      placeholder={"Masukan Batas Waktu"}
                      name={"batas_waktu"}
                      value={values.batasa_waktu}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Estimasi Batas Waktu Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Biaya Tambahan</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Biaya Tambahan"}
                      name={"biaya_tambahan"}
                      value={values.biaya_tambahan}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Biaya Tambahan Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Pajak</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Pajak"}
                      name={"pajak"}
                      value={values.pajak}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Pajak Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Diskon</Form.Label>
                    <FormInput
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Diskon Harga"}
                      name={"diskon"}
                      value={values.diskon}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Diskon Harga Transaksi.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Pembayaran</Form.Label>
                    <select
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
                  <Button variant="primary" className="ms-auto" type="submit">
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
