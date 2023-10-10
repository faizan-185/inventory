import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import {createWorker, deleteWorkers, getAllWorkers, updateWorker,} from "../../api/worker";
import Loader from "../../layouts/loader/Loader";

const Workers = () => {
  const { SearchBar } = Search;
  const [workers, setWorkers] = useState([])

  const [id, setId] = useState('');
  const [name, setName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [cnic, setCnic] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [address, setAddress] = useState('')
  const [file, setFile] = useState(null);

  const [selected, setSelected] = useState([])
  const [btnText, setText] = useState('Add');
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const editWorker = (row) => {
    setId(row.id)
    setName(row.name)
    setFatherName(row.fatherName)
    setPhone(row.contact)
    setAddress(row.address)
    setCnic(row.cnic)
    setReference(row.reference)
    setText("Update")
  }
  const ActionButtonFormatter = (cell, row) => {
    return (
      <Button className={"btn btn-sm btn-warning"} onClick={(event) => editWorker(row)}>Edit</Button>
    );
  };

  const PickerFormatter = (cell, row) => {
    return (
      <Button
        className={"btn btn-sm btn-info"}
        onClick={() => {
          const imageUrl = `${process.env.REACT_APP_BACKEND_URL}static/${cell}`;
          window.open(imageUrl, '_blank');
        }}
      >
        View
      </Button>
    )
  }

  function PasswordColumn({ password }) {
    const [visible, setVisible] = useState(false);

    return (
      <div className={'d-flex flex-row justify-content-between'}>
        <span>{visible ? password : '****'}</span>
        <i
          className={`bi bi-eye${visible ? '-slash' : ''}`}
          style={{ cursor: 'pointer', marginLeft: '10px' }}
          onClick={() => setVisible(!visible)}
        ></i>
      </div>
    );
  }

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      sort: true
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true
    }, {
      dataField: 'username',
      text: 'Username',
      sort: true
    }, {
      dataField: 'password',
      text: 'Password',
      formatter: (cell, row) => <PasswordColumn password={row.password} />
    },{
      dataField: 'contact',
      text: 'Phone'
    }, {
      dataField: 'cnic',
      text: 'CNIC'
    }, {
      dataField: 'address',
      text: 'Address'
    }, {
      dataField: 'picture',
      text: 'Picture',
      formatter: PickerFormatter
    }, {
      dataField: 'action',
      text: 'Action',
      formatter: ActionButtonFormatter,
    },
  ]

  const onSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([...selected, row.id])
    } else {
      setSelected(selected.filter(x => x !== row.id))
    }
  }

  const onSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      setSelected(ids);
    } else {
      setSelected([])
    }
  }

  const selectRow = {
    mode: 'checkbox',
    selected: selected,
    onSelect: onSelect,
    onSelectAll: onSelectAll
  }

  const addSupplier = (event) => {
    event.preventDefault();
    if (btnText === 'Add') {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('fatherName', fatherName);
      formData.append('cnic', cnic);
      formData.append('contact', phone);
      formData.append('address', address);
      formData.append('reference', reference);
      formData.append('picture', file);
      formData.append('role', 'worker');
      createWorker(formData).then(result => {
        if (result.status === 200){
          setLoading(false);
          const newWorker = {
            id: result.data.id,
            name, fatherName, contact: phone, address, cnic, reference, picture: result.data.picture,
            username: result.data.username,
            password: result.data.password
          }
          setWorkers([...workers, newWorker])
          setName("");
          setFatherName("")
          setPhone("");
          setAddress("");
          setCnic("");
          setReference("");
          setFile(null);
          setVisible(true);
          setTimeout(() => {
            setVisible(false)
          }, 2000);
          alert(`New worker has been created with username: ${result.data.username} and password: ${result.data.password}`)
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })

    } else if (btnText === 'Update') {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('fatherName', fatherName);
      formData.append('cnic', cnic);
      formData.append('contact', phone);
      formData.append('address', address);
      formData.append('reference', reference);
      if (file) {
        formData.append('picture', file);
      }
      updateWorker(id, formData).then(result => {
        if (result.status === 200) {
          setLoading(false);
          workers.forEach(worker => {
            if (worker.id === id) {
              worker.name = name;
              worker.fatherName = fatherName;
              worker.phone = phone;
              worker.address = address;
              worker.cnic = cnic;
              worker.reference = reference;
              if (file){
                worker.picture = file.name;
              }
              return;
            }
          });
          setName("");
          setFatherName("")
          setPhone("");
          setCnic("");
          setAddress("");
          setReference("");
          setFile(null);
          setId('');
          setText("Add");
          setWorkers([...workers]);
          setVisible1(true);
          setTimeout(() => {
            setVisible1(false)
          }, 2000);
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })
    }
  }

  const deleteSupplier = async () => {
    setLoading(true);
    deleteWorkers(selected).then(result => {
      if (result.status === 200) {
        setLoading(false);
        setWorkers(workers.filter(worker => !selected.includes(worker.id)));
        setSelected([]);
        setText("Add");
        setVisible2(true);
        setTimeout(() => {
          setVisible2(false)
        }, 2000);
      } else {
        setLoading(false);
        setVisible3(true);
      }
    })
  }

  const onDismiss = () => {
    setVisible(false);
  };
  const onDismiss1 = () => {
    setVisible1(false);
  };
  const onDismiss2 = () => {
    setVisible2(false);
  };
  const onDismiss3 = () => {
    setVisible3(false);
  };

  useEffect(() => {
    setLoading(true);
    getAllWorkers().then(result => {
      if (result.status === 200) {
        setLoading(false);
        setWorkers(result.data);
      } else {
        setLoading(false);
        setVisible3(true);
      }
    })
  }, [])

  return (
    <div>
      {
        loading ? <Loader /> :
          <Row>
            <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
              A New Worker is Added!
            </Alert>
            <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
              Worker Details Are Updated!
            </Alert>
            <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
              Selected Workers Are Deleted!
            </Alert>
            <Alert color="warning" isOpen={visible3} toggle={onDismiss3.bind(null)}>
              Un Known Error Occurred!
            </Alert>
            <Col sm="12" lg="3" xxl="4" xxxl="4">
              <Card>
                <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                  <i className="bi bi-truck me-2"> </i>
                  Add Worker
                </CardTitle>
                <CardBody>
                  <Form onSubmit={addSupplier}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required={true}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="father-name">Father Name</Label>
                      <Input
                        id="father-name"
                        name="father-name"
                        type="text"
                        required={true}
                        value={fatherName}
                        onChange={(event) => setFatherName(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cnic">CNIC</Label>
                      <Input
                        id="cnic"
                        name="cnic"
                        type="text"
                        required={true}
                        value={cnic}
                        onChange={(event) => setCnic(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required={true}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Input id="address" name="address" type="textarea" value={address}
                             onChange={(event) => setAddress(event.target.value)} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="reference">Reference</Label>
                      <Input
                        id="reference"
                        name="reference"
                        type="text"
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="picture">Picture</Label>
                      <Input
                        id="picture"
                        name="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </FormGroup>
                    <div className={'d-flex justify-content-between'}>
                      <Button>{btnText}</Button>
                      {
                        selected.length >= 1 ? <Button className={'btn btn-danger'} onClick={deleteSupplier}>Delete</Button> : <></>
                      }
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" lg="9" xxl="8" xxxl="8">
              <Card>
                <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                  <i className="bi bi-card-text me-2"> </i>
                  Our Workers
                </CardTitle>
                <CardBody className="">
                  <ToolkitProvider
                    keyField={'id'}
                    columns={columns}
                    data={workers}
                    search
                  >
                    {
                      props => (
                        <div>
                          <SearchBar { ...props.searchProps }  />
                          <hr />
                          <BootstrapTable
                            pagination={paginationFactory()}
                            selectRow={selectRow}
                            { ...props.baseProps }
                          />
                        </div>
                      )
                    }
                  </ToolkitProvider>
                </CardBody>
              </Card>
            </Col>
          </Row>
      }

    </div>
  );
}

export default Workers;
