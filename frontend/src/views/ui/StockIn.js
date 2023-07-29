import React, { useState, useEffect } from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Alert, ListGroup, ListGroupItem} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import generateRandomNumber from '../../utils/helper';

const StockIn = () => {
    const { SearchBar } = Search;
    const [stocks, setStocks] = useState([])
    const [suppliers, setSuppliers] = useState(["regular"]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    const [id, setId] = useState(`C-${generateRandomNumber()}`);
    const [supplier, setSupplier] = useState(''); // foreign key of supplier
    const [godown, setGodown] = useState('')
    const [company, setCompany] = useState('')
    const [product, setProduct] = useState('') //product name
    const [thickness, setThickness] = useState('')
    const [size, setSize] = useState('')
    const [code, setCode] = useState('')

    const [selected, setSelected] = useState([])
    const [btnText, setText] = useState('Add');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [showList, setShowList] = useState(false);

    const editCustomer = (row, event) => {
        setId(row.id)
        setSupplier(row.supplier)
        setGodown(row.godown)
        setCompany(row.company)
        setProduct(row.product)
        setThickness(row.thickness)
        setSize(row.size)
        setCode(row.code)
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
            dataField: 'product',
            text: 'Product',
            sort: true
        },{
            dataField: 'supplier',
            text: 'Supplier',
        }, {
            dataField: 'godown',
            text: 'Godown',
        }, {
            dataField: 'company',
            text: 'Company'
        }, {
            dataField: 'thickness',
            text: 'Thickness'
        }, {
            dataField: 'size',
            text: 'Size'
        }, {
            dataField: 'code',
            text: 'Code'
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

    const addStock = (event) => {
        event.preventDefault();
        if (btnText === 'Add') {
            setStocks([...stocks, {id, supplier, godown, company, product, thickness, size, code}])
            setGodown("");
            setCompany("");
            setProduct("");
            setThickness("");
            setSize("");
            setCode("");
            setSupplier("");
            setShowList(false);
            setId(`C-${generateRandomNumber()}`);
            setVisible(true);
            setTimeout(() => {
                setVisible(false)
            }, 2000);
        } else if (btnText === 'Update') {
            stocks.forEach(stock => {
                if (stock.id === id) {
                    stock.supplier = supplier;
                    stock.godown = godown;
                    stock.company = company;
                    stock.product = product;
                    stock.thickness = thickness;
                    stock.size = size;
                    stock.code = code;
                    stock.supplier = supplier;
                    return;
                }
            });
            setGodown("");
            setCompany("");
            setProduct("");
            setThickness("");
            setSize("");
            setCode("");
            setSupplier("");
            setShowList(false);
            setId(`C-${generateRandomNumber()}`);
            setText("Add");
            setStocks([...stocks]);
            setVisible1(true);
            setTimeout(() => {
                setVisible1(false)
            }, 2000);
        }
    }

    const deleteStock = () => {
        setStocks(stocks.filter(stock => !selected.includes(stock.id)));
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
        setSupplier(value);
        const filteredSuppliers = suppliers.filter((suppliers) =>
            suppliers.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuppliers(filteredSuppliers)
        setShowList(value !== ''); // Show the list only if the input value is not empty
    };

    const handleItemClick = (selectedSupplier) => {
        setSupplier(selectedSupplier);
        setShowList(false); // Hide the list after selecting a category
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && supplier !== '') {
            setSuppliers([...suppliers, supplier]); // Save the category by adding it to the categories array
            suppliers.push(supplier)
            const filteredSuppliers = suppliers.filter((sup) =>
                sup.toLowerCase().includes(supplier.toLowerCase())
            );
            setFilteredSuppliers(filteredSuppliers)
            setShowList(true);
        } else if (event.key === 'Shift' && supplier !== '') {
            const filteredSuppliers = suppliers.filter((sup) => sup !== supplier)
            setSuppliers(filteredSuppliers); // Remove the category from the categories array
            setSupplier(''); // Clear the input value
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
    }, [supplier, suppliers]);


    return (
        <div>
            <Row>
                <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
                    A New Stock Added!
                </Alert>
                <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
                    Stock Details Are Updated!
                </Alert>
                <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
                    Selected Stocks Are Deleted!
                </Alert>
                <Col sm="12" lg="4" xl="4" xxl="4" xxxl="4">
                    <Card>
                        <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                            <i className="bi bi-box-arrow-in-left me-2"> </i>
                            Add Stock
                        </CardTitle>
                        <CardBody>
                            <Form onSubmit={addStock}>
                                <FormGroup>
                                    <Label for="supplier">Supplier</Label>
                                    <Input
                                        id="supplier"
                                        name="supplier"
                                        type="text"
                                        required={true}
                                        value={supplier}
                                        onChange={handleInputChange}
                                        // onKeyDown={handleKeyDown}
                                    />
                                    {showList && (
                                        <ListGroup className="mt-2" style={{ maxHeight: '150px', overflowX: 'auto', border: '0.5px solid grey' }}>
                                            {filteredSuppliers.map((supplier) => (
                                                <ListGroupItem key={supplier} onClick={() => handleItemClick(supplier)}>
                                                    {supplier}
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    )}
                                </FormGroup>
                                <FormGroup>
                                    <Label for="godown">Godown Location</Label>
                                    <Input
                                        id="godown"
                                        name="godown"
                                        type="text"
                                        required={true}
                                        value={godown}
                                        onChange={(event) => setGodown(event.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="company">Company Name</Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        type="tel"
                                        required={true}
                                        value={company}
                                        onChange={(event) => setCompany(event.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="product">Product Description</Label>
                                    <Input
                                        id="product"
                                        name="product"
                                        type="text"
                                        value={product}
                                        onChange={(event) => setProduct(event.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="thickness">Thickness</Label>
                                    <Input
                                        id="thickness"
                                        name="thickness"
                                        type="text"
                                        value={thickness}
                                        onChange={(event) => setThickness(event.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="size">Size</Label>
                                    <Input
                                        id="size"
                                        name="size"
                                        type="text"
                                        value={size}
                                        onChange={(event) => setSize(event.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="code">Code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        type="text"
                                        value={code}
                                        onChange={(event) => setCode(event.target.value)}
                                    />
                                </FormGroup>

                                <div className={'d-flex justify-content-between'}>
                                    <Button>{btnText}</Button>
                                    {
                                        selected.length >= 1 ? <Button className={'btn btn-danger'} onClick={deleteStock}>Delete</Button> : <></>
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
                            Our Stocks
                        </CardTitle>
                        <CardBody className="">
                            <ToolkitProvider
                                keyField={'id'}
                                columns={columns}
                                data={stocks}
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

export default StockIn;