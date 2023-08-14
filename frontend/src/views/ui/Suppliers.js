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
    ListGroup,
    ListGroupItem
} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import generateRandomNumber from '../../utils/helper';
import { createSupplier, updateSupplier, getAllSuppliers, deleteSuppliers} from "../../api/supplier";
import Loader from "../../layouts/loader/Loader";


const Suppliers = () => {
    const { SearchBar } = Search;
    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState(["regular"]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [id, setId] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')
    const [address, setAddress] = useState('')

    const [selected, setSelected] = useState([])
    const [btnText, setText] = useState('Add');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [showList, setShowList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible3, setVisible3] = useState(false);

    const editSupplier = (row) => {
        setId(row.id)
        setName(row.name)
        setPhone(row.phone)
        setAddress(row.address)
        setCompany(row.company)
        setCategory(row.category)
        setText("Update")
    }
    const ActionButtonFormatter = (cell, row) => {
        return (
            <Button className={"btn btn-sm btn-warning"} onClick={(event) => editSupplier(row)}>Edit</Button>
        );
    };

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
            dataField: 'phone',
            text: 'Phone'
        }, {
            dataField: 'company',
            text: 'Company'
        }, {
            dataField: 'address',
            text: 'Address'
        }, {
            dataField: 'category',
            text: 'Category'
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
            createSupplier(name, category, company, phone, address).then(result => {
                if (result.status === 200){
                    setLoading(false);
                    const newSupplier = {
                        id: result.data.id,
                        name, phone, address, company, category
                    }
                    setSuppliers([...suppliers, newSupplier])
                    setName("");
                    setPhone("");
                    setAddress("");
                    setCompany("");
                    setCategory("");
                    setShowList(false);
                    setVisible(true);
                    setTimeout(() => {
                        setVisible(false)
                    }, 2000);
                } else {
                    setLoading(false);
                    setVisible3(true);
                }
            })

        } else if (btnText === 'Update') {
            setLoading(true);
            updateSupplier(id, name, category, company, phone, address).then(result => {
                if (result.status === 200) {
                    setLoading(false);
                    suppliers.forEach(supplier => {
                        if (supplier.id === id) {
                            supplier.name = name;
                            supplier.phone = phone;
                            supplier.address = address;
                            supplier.company = company;
                            supplier.category = category;
                            return;
                        }
                    });
                    setName("");
                    setPhone("");
                    setCompany("");
                    setAddress("");
                    setCategory("");
                    setShowList(false);
                    setId('');
                    setText("Add");
                    setSuppliers([...suppliers]);
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
        deleteSuppliers(selected).then(result => {
            if (result.status === 200) {
                setLoading(false);
                setSuppliers(suppliers.filter(supplier => !selected.includes(supplier.id)));
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

    const handleInputChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        const filteredCategories = categories.filter((category) =>
            category.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filteredCategories)
        setShowList(value !== ''); // Show the list only if the input value is not empty
    };

    const handleItemClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setShowList(false); // Hide the list after selecting a category
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && category !== '') {
            setCategories([...categories, category]); // Save the category by adding it to the categories array
            categories.push(category)
            const filteredCategories = categories.filter((cat) =>
                cat.toLowerCase().includes(category.toLowerCase())
            );
            setFilteredCategories(filteredCategories)
            setShowList(true);
        } else if (event.key === 'Shift' && category !== '') {
            const filteredCategories = categories.filter((cat) => cat !== category)
            setCategories(filteredCategories); // Remove the category from the categories array
            setCategory(''); // Clear the input value
            setShowList(false);
        }
    };

    useEffect(() => {
        const handleWindowKeyDown = (event) => {
            if (event.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
                // Only trigger Delete keydown event if the active element is not an input field
                handleKeyDown(event);
            }
        };

        window.addEventListener('keydown', handleWindowKeyDown);
        return () => {
            window.removeEventListener('keydown', handleWindowKeyDown);
        };
    }, [category, categories]);

    useEffect(() => {
        setLoading(true);
        getAllSuppliers().then(result => {
            if (result.status === 200) {
                setLoading(false);
                setSuppliers(result.data);
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
                          A New Supplier Added!
                      </Alert>
                      <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
                          Supplier Details Are Updated!
                      </Alert>
                      <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
                          Selected Supplier Are Deleted!
                      </Alert>
                      <Alert color="warning" isOpen={visible3} toggle={onDismiss3.bind(null)}>
                          Un Known Error Occurred!
                      </Alert>
                      <Col sm="12" lg="4" xl="4" xxl="4" xxxl="4">
                          <Card>
                              <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                                  <i className="bi bi-truck me-2"> </i>
                                  Add Supplier
                              </CardTitle>
                              <CardBody>
                                  <Form onSubmit={addSupplier}>
                                      <FormGroup>
                                          <Label for="category">Category</Label>
                                          <Input
                                            id="category"
                                            name="category"
                                            type="text"
                                            required={true}
                                            value={category}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {showList && (
                                            <ListGroup className="mt-2" style={{ maxHeight: '150px', overflowX: 'auto', border: '0.5px solid grey' }}>
                                                {filteredCategories.map((category) => (
                                                  <ListGroupItem key={category} onClick={() => handleItemClick(category)}>
                                                      {category}
                                                  </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                          )}
                                      </FormGroup>
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
                                          <Label for="company">Company Name</Label>
                                          <Input
                                            id="company"
                                            name="company"
                                            type="text"
                                            value={company}
                                            onChange={(event) => setCompany(event.target.value)}
                                          />
                                      </FormGroup>
                                      <FormGroup>
                                          <Label for="address">Address</Label>
                                          <Input id="address" name="address" type="textarea" value={address}
                                                 onChange={(event) => setAddress(event.target.value)} />
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
                      <Col sm="12" lg="8" xl="8" xxl="8" xxxl="8">
                          <Card>
                              <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                                  <i className="bi bi-card-text me-2"> </i>
                                  Our Suppliers
                              </CardTitle>
                              <CardBody className="">
                                  <ToolkitProvider
                                    keyField={'id'}
                                    columns={columns}
                                    data={suppliers}
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

export default Suppliers;