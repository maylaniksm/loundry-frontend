import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Form, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import FormInput from "../components/FormInput";
import useForm from "../hooks/useForm";
import DataTable from "react-data-table-component";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function User() {
  const [show, setShow] = useState(false);
  const [showTitle, setShowTitle] = useState("Buat User Baru");
  const [disabled, setDisabled] = useState(false);
  const [showId, setShowId] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [APIDataOutlet, setAPIDataOutlet] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = APIData.filter(
    (item) =>
      item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    axios.get("user/").then(async (res) => {
      setAPIData(res.data.data_user);
    });
    axios.get("outlet/").then(async (res) => {
      values.id_outlet = res.data.data_outlet[0].id_outlet 
      setAPIDataOutlet(res.data.data_outlet);
    });
  }, [refreshKey, filterText, resetPaginationToggle]);
  const columns = [
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Outlet",
      selector: (row) => row.tb_outlet.nama,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
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
            className="btn p-1 mx-1 btn-danger "
            onClick={() => hapus(row.id_user)}
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
      nama: "Conan the Barbarian",
      id_outlet: "Conan the Barbarian",
      username: "1982",
    },
  ];
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShowId("");
    setShowTitle("Buat User Baru");
    setDisabled(false);
    setShow(true);
  };
  const handleShowEdit = (user) => {
    values.nama = user.nama;
    values.id_outlet = user.id_outlet;
    values.username = user.username;
    values.password = '';
    setShowId(user.id_user);
    setShowTitle("Edit User " + user.nama);
    setDisabled(false);
    setShow(true);
  };
  const handleShowDetail = (user) => {
    values.nama = user.nama;
    values.id_outlet = user.id_outlet;
    values.username = user.username;
    values.password = '';
    setShowId(user.id_user);
    setShowTitle("Detail User " + user.nama);
    setDisabled(true);
    setShow(true);
    
  };
  const { values, handleChange } = useForm({
    initialValues: {
      nama: "",
      id_outlet: "",
      username: "",
      password: "",
      role: "kasir",
    },
  });
  const hapus = (id) => {
    axios.delete("user/" + id).then(async (res) => {
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
      values.id_user = showId;
      await axios
        .put("user/", values)
        .then(async (res) => {
          handleClose();
          setRefreshKey((oldKey) => oldKey + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post("user/", values)
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
          <h5>User</h5>
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
                      name={"nama"}
                      value={values.nama}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Nama User.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicOutlet">
                    <Form.Label>Outlet</Form.Label>
                    <select
                    disabled={disabled}
                      className="form-control"
                      name={"id_outlet"}
                      value={values.id_outlet}
                      onChange={handleChange}
                    >
                      {APIDataOutlet.map(x=>{
                        
                        return (<option key={x.id_outlet} value={x.id_outlet}>{x.nama}</option>)
                      })}
                    </select>
                    <Form.Text className="text-muted">
                      Masukan Outlet User.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicOutlet">
                    <Form.Label>Role</Form.Label>
                    <select
                    disabled={disabled}
                      className="form-control"
                      name={"role"}
                      value={values.role}
                      onChange={handleChange}
                    >
                      <option key="admin" value="admin">admin</option>
                      <option key="owner" value="owner">owner</option>
                      <option key="kasir" value="kasir">kasir</option>
                    </select>
                    <Form.Text className="text-muted">
                      Masukan Role User.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <FormInput
                    disabled={disabled}
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Username"}
                      name={"username"}
                      value={values.username}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Username User.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicOutlet">
                    <Form.Label>Password</Form.Label>
                    <FormInput
                    disabled={disabled}
                      className="form-control"
                      type={"password"}
                      placeholder={"Masukan Password"}
                      name={"password"}
                      value={values.password}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Password User.
                    </Form.Text>
                  </Form.Group>
                  <Button disabled={disabled}  variant="primary" className="ms-auto" type="submit">
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
