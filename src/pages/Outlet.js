import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Form, Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import FormInput from "../components/FormInput";
import useForm from "../hooks/useForm";
import DataTable from "react-data-table-component";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Outlet() {
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showTitle, setShowTitle] = useState('Buat Outlet Baru');
  const [showId, setShowId] = useState('');
  const [APIData, setAPIData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = APIData.filter(
    (item) =>
      item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    axios.get("outlet/").then(async (res) => {
      setAPIData(res.data.data_outlet);
    });
  }, [refreshKey, filterText, resetPaginationToggle]);
  const columns = [
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat,
      sortable: true,
    },
    {
      name: "Telepon",
      selector: (row) => row.tlp,
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <>
          <button className="btn mx-1 p-1 btn-success text-white" onClick={()=>handleShowDetail(row)}><InfoIcon/></button>
          <button className="btn mx-1 p-1 btn-info text-white" onClick={()=>handleShowEdit(row)}><EditIcon/></button>
          <button className="btn mx-1 p-1 btn-danger" onClick={()=>hapus(row.id_outlet)}><DeleteForeverIcon/></button>
        </>
      ),
      sortable: true,
    },
  ];
  let data = [
    {
      nama: "Conan the Barbarian",
      alamat: "Conan the Barbarian",
      tlp: "1982",
    },
  ];
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShowId('')
    setShowTitle("Buat Outlet Baru")
    setDisabled(false)
    setShow(true)
  };
  const handleShowEdit = (outlet) => {
    values.nama = outlet.nama
    values.alamat = outlet.alamat
    values.tlp = outlet.tlp
    setShowId(outlet.id_outlet)
    setShowTitle("Edit Outlet "+outlet.nama)
    setDisabled(false)
    setShow(true)
  };
  const handleShowDetail = (outlet) => {
    values.nama = outlet.nama
    values.alamat = outlet.alamat
    values.tlp = outlet.tlp
    setShowId(outlet.id_outlet)
    setShowTitle("Detail Outlet "+outlet.nama)
    setDisabled(true)
    setShow(true)
  };
  const { values, handleChange } = useForm({
    initialValues: {
      nama: "",
      alamat: "",
      tlp: "",
    },
  });
  const hapus = (id) =>{
    axios.delete("outlet/"+id).then(async (res) => {
      setRefreshKey((oldKey) => oldKey + 1);
      alert("data Telah terhapus");
    });
  }

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
    if(showId){
      values.id_outlet = showId
      await axios
      .put("outlet/", values)
      .then(async (res) => {
        handleClose();
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
    }else{
      await axios
        .post("outlet/", values)
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
          <h5>Outlet</h5>
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
                      Masukan Nama Outlet.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicAlamat">
                    <Form.Label>Alamat</Form.Label>
                    <FormInput
                      disabled={disabled}
                    
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Alamat"}
                      name={"alamat"}
                      value={values.alamat}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Alamat Outlet.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTelepon">
                    <Form.Label>Telepon</Form.Label>
                    <FormInput
                      disabled={disabled}
                    
                      className="form-control"
                      type={"text"}
                      placeholder={"Masukan Telepon"}
                      name={"tlp"}
                      value={values.tlp}
                      handleChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Masukan Telepon Outlet.
                    </Form.Text>
                  </Form.Group>
                      
                  <Button disabled={disabled} variant="primary" className="ms-auto" type="submit">
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
