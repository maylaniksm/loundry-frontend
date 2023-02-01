import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Form, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import FormInput from "../components/FormInput";
import useForm from "../hooks/useForm";
import DataTable from "react-data-table-component";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Paket() {
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showTitle, setShowTitle] = useState("Buat Paket Baru");
  const [showId, setShowId] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [APIDataOutlet, setAPIDataOutlet] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = APIData.filter(
    (item) =>
      item.nama_paket &&
      item.nama_paket.toLowerCase().includes(filterText.toLowerCase())
  );
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    axios.get("paket/").then(async (res) => {
      setAPIData(res.data.data_paket);
    });
    axios.get("outlet/").then(async (res) => {
      values.id_outlet = res.data.data_outlet[0].id_outlet;
      setAPIDataOutlet(res.data.data_outlet);
    });
  }, [refreshKey, filterText, resetPaginationToggle]);
  const columns = [
    {
      name: "Nama",
      selector: (row) => row.nama_paket,
      sortable: true,
    },
    {
      name: "Jenis",
      selector: (row) => row.jenis,
      sortable: true,
    },
    {
      name: "Outlet",
      selector: (row) => row.tb_outlet.nama,
      sortable: true,
    },
    {
      name: "Harga",
      cell: (row) => "Rp. " + numberWithCommas(row.harga),
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <>
        <button
            className="btn p-1 mx-1 btn-success text-white"
            onClick={() => handleShowDetail(row)}
          >
            <InfoIcon/>
          </button>
          <button
            className="btn p-1 mx-1 btn-info text-white"
            onClick={() => handleShowEdit(row)}
          >
            <EditIcon/>
          </button>
          <button
            className="btn p-1 mx-1 btn-danger"
            onClick={() => hapus(row.id_paket)}
          >
            <DeleteForeverIcon/>
          </button>
        </>
      ),
      sortable: true,
    },
  ];
  let data = [
    {
      nama_paket: "Conan the Barbarian",
      id_outlet: "Conan the Barbarian",
      harga: "1982",
    },
  ];
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShowId("");
    setShowTitle("Buat Paket Baru");
    setDisabled(false);
    setShow(true);
  };
  const handleShowEdit = (paket) => {
    values.nama_paket = paket.nama_paket;
    values.id_outlet = paket.id_outlet;
    values.harga = paket.harga;
    setShowId(paket.id_paket);
    setShowTitle("Edit Paket " + paket.nama_paket);
    setDisabled(false);
    setShow(true);
  };
  const handleShowDetail = (paket) => {
    values.nama_paket = paket.nama_paket;
    values.id_outlet = paket.id_outlet;
    values.harga = paket.harga;
    setShowId(paket.id_paket);
    setShowTitle("Detail Paket " + paket.nama_paket);
    setDisabled(true);
    setShow(true);
  };
  const { values, handleChange } = useForm({
    initialValues: {
      nama_paket: "",
      id_outlet: "",
      jenis: "",
      harga: "",
    },
  });
  const hapus = (id) => {
    axios.delete("paket/" + id).then(async (res) => {
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
  const Submit = async (event) => {
    event.preventDefault();
    if (showId) {
      values.id_paket = showId;
      await axios
        .put("paket/", values)
        .then(async (res) => {
          handleClose();
          setRefreshKey((oldKey) => oldKey + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post("paket/", values)
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
  return (
    <div className="page px-0">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
          <h5>Paket</h5>
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
                    <Form.Label>Nama</Form.Label>
                    <FormInput
                    disabled={disabled}
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Nama"}
                      name={"nama_paket"}
                      value={values.nama_paket}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Nama Paket.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicNama">
                    <Form.Label>Jenis</Form.Label>
                    <FormInput
                    disabled={disabled}
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Jenis"}
                      name={"jenis"}
                      value={values.jenis}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Jenis Paket.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicAlamat">
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
                      Masukan Outlet Paket.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Harga</Form.Label>
                    <FormInput
                    disabled={disabled}
                      className="form-control"
                      type={"number"}
                      placeholder={"Masukan Harga"}
                      name={"harga"}
                      value={values.harga}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Harga Paket.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" disabled={disabled} className="ms-auto" type="submit">
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
