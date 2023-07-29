import React, { useState, useEffect } from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Alert, ListGroup, ListGroupItem} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import generateRandomNumber from '../../utils/helper';

const Customers = () => {
    const { SearchBar } = Search;
    const [customers, setCustomers] = useState([])
    const [categories, setCategories] = useState(["regular"]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [id, setId] = useState(`C-${generateRandomNumber()}`);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [reference, setReference] = useState('')
    const [address, setAddress] = useState('')

    const [selected, setSelected] = useState([])
    const [btnText, setText] = useState('Add');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [showList, setShowList] = useState(false);

    const editCustomer = (row, event) => {
        setId(row.id)
        setName(row.name)
        setPhone(row.phone)
        setReference(row.reference)
        setAddress(row.address)
        setCategory(row.category)
        setText("Update")
    }
    const ActionButtonFormatter = (cell, row) => {
        return (
            <Button className={"btn btn-sm btn-warning"} onClick={(event) => editCustomer(row, event)}>Edit</Button>
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
            dataField: 'reference',
            text: 'Reference'
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

    const addCustomer = (event) => {
        event.preventDefault();
        if (btnText === 'Add') {
            setCustomers([...customers, {id, name, phone, reference, address, category}])
            setName("");
            setPhone("");
            setReference("");
            setAddress("");
            setCategory("");
            setShowList(false);
            setId(`C-${generateRandomNumber()}`);
            setVisible(true);
            setTimeout(() => {
                setVisible(false)
            }, 2000);
        } else if (btnText === 'Update') {
            customers.forEach(customer => {
                if (customer.id === id) {
                    customer.name = name;
                    customer.phone = phone;
                    customer.reference = reference;
                    customer.address = address;
                    customer.category = category;
                    return;
                }
            });
            setName("");
            setPhone("");
            setReference("");
            setAddress("");
            setCategory("");
            setShowList(false);
            setId(`C-${generateRandomNumber()}`);
            setText("Add");
            setCustomers([...customers]);
            setVisible1(true);
            setTimeout(() => {
                setVisible1(false)
            }, 2000);
        }
    }

    const deleteCustomer = () => {
        setCustomers(customers.filter(customer => !selected.includes(customer.id)));
        setSelected([]);
        setText("Add");
        setVisible2(true);
        setTimeout(() => {
            setVisible2(false)
        }, 2000);
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


    return (
      <div>
        <Row>
            <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
                A New Customer Added!
            </Alert>
            <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
                Customer Details Are Updated!
            </Alert>
            <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
                Selected Customers Are Deleted!
            </Alert>
            <Col sm="12" lg="4" xl="4" xxl="4" xxxl="4">
                <Card>
                    <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                        <i className="bi bi-person-add me-2"> </i>
                        Add Customers
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={addCustomer}>
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
                                <Label for="cnic">Reference</Label>
                                <Input
                                    id="reference"
                                    name="reference"
                                    type="text"
                                    value={reference}
                                    onChange={(event) => setReference(event.target.value)}
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
                                    selected.length >= 1 ? <Button className={'btn btn-danger'} onClick={deleteCustomer}>Delete</Button> : <></>
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
                        Our Customers
                    </CardTitle>
                    <CardBody className="">
                        <ToolkitProvider
                            keyField={'id'}
                            columns={columns}
                            data={customers}
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
      </div>
    );
}

export default Customers;