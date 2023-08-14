import React, { useState, useEffect } from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Alert, ListGroup, ListGroupItem,
    Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import generateRandomNumber from '../../utils/helper';
import { adminLogin } from "../../api/auth";
import { getAllProducts, createProduct, updateProduct, deleteProducts } from "../../api/stock";
import Loader from "../../layouts/loader/Loader";
import {getAllSuppliers} from "../../api/supplier";
import '../../assets/css/style.css'


const StockIn = () => {
    const { SearchBar } = Search;
    const [stocks, setStocks] = useState([])
    const [tempStocks, setTempStocks] = useState([])
    const [suppliers, setSuppliers] = useState([]);

    const [id, setId] = useState('');
    const [supplier, setSupplier] = useState({id: 0}); // foreign key of supplier
    const [godown, setGodown] = useState('')
    const [company, setCompany] = useState('')
    const [product, setProduct] = useState('') //product name
    const [thickness, setThickness] = useState('')
    const [size, setSize] = useState('')
    const [code, setCode] = useState('')
    const [qty, setQty] = useState(0)
    const [price, setPrice] = useState(0)
    const [deliveryCost, setDeliveryCost] = useState(0)
    const [additionalCost, setAdditionalCost] = useState(0)
    const [password, setPassword] = useState('')

    const [selected, setSelected] = useState([])
    const [btnText, setText] = useState('Add');
    const [btnText1, setText1] = useState('Show Cost');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCost, setShowCost] = useState(false);
    const ActionButtonFormatter = (cell, row) => {
        return (
          <Button className={"btn btn-sm btn-warning"} onClick={(event) => editCustomer(row, event)}>Edit</Button>
        );
    };
    const [columns, setColumns] = useState(
      [
          {
              dataField: 'id',
              text: 'ID',
              sort: true
          }, {
              dataField: 'name',
              text: 'Product',
              sort: true
          },{
              dataField: 'supplier.name',
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
              dataField: 'qty',
              text: 'Qty.'
          }, {
              dataField: 'action',
              text: 'Action',
              formatter: ActionButtonFormatter,
          },
      ]
    );

    const col1 = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'Product',
            sort: true
        },{
            dataField: 'supplier.name',
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
            dataField: 'qty',
            text: 'Qty.'
        }, {
            dataField: 'action',
            text: 'Action',
            formatter: ActionButtonFormatter,
        },
    ];

    const col2 = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'Product',
            sort: true
        },{
            dataField: 'supplier.name',
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
            dataField: 'qty',
            text: 'Qty.'
        }, {
            dataField: 'price',
            text: 'Price'
        }, {
            dataField: 'deliveryCost',
            text: 'Del/C'
        }, {
            dataField: 'additionalCost',
            text: 'Add/C'
        }, {
            dataField: 'action',
            text: 'Action',
            formatter: ActionButtonFormatter,
        },
    ]
    const toggle = () => {
        setPassword("");
        setOpen(!open)
    }
    const toggleCost = () => {
        if (showCost) {
            setShowCost(false);
            setText1("Show Cost");
            setColumns(col1)
        } else {
            toggle();
        }
    };

    const editCustomer = (row, event) => {
        setId(row.id)
        setSupplier(row.supplier)
        setGodown(row.godown)
        setCompany(row.company)
        setProduct(row.name)
        setThickness(row.thickness)
        setSize(row.size)
        setCode(row.code)
        setQty(row.qty)
        setPrice(row.price)
        setDeliveryCost(row.deliveryCost)
        setAdditionalCost(row.additionalCost)
        setText("Update")
    }

    const addNewStock = (event) => {
        event.preventDefault();
        if (supplier && supplier.id !== 0) {
            document.getElementById("supplier").classList.remove("border-danger");
            if (btnText === 'Add') {
                const newTempStock = {
                    id: `T-${generateRandomNumber()}`,
                    supplierId: supplier.id,
                    name: product,
                    supplier: supplier,
                    godown: godown,
                    company: company,
                    thickness: thickness,
                    size: size,
                    code: code,
                    qty: qty,
                    price: price,
                    deliveryCost: deliveryCost,
                    additionalCost: additionalCost
                }
                setTempStocks([...tempStocks, newTempStock])
                setStocks([...stocks, newTempStock])
                allClear()
            } else if (btnText === 'Update') {
                if (typeof id === 'string') {
                    const newStocks = stocks.map(stock => {
                        if (stock.id === id) {
                            return {
                                id: id,
                                supplierId: supplier.id,
                                name: product,
                                supplier: supplier,
                                godown: godown,
                                company: company,
                                thickness: thickness,
                                size: size,
                                code: code,
                                qty: qty,
                                price: price,
                                deliveryCost: deliveryCost,
                                additionalCost: additionalCost
                            }
                        }
                        else {
                            return stock;
                        }
                    });
                    const newStocks1 = tempStocks.map(stock => {
                        if (stock.id === id) {
                            return {
                                id: id,
                                supplierId: supplier.id,
                                name: product,
                                supplier: supplier,
                                godown: godown,
                                company: company,
                                thickness: thickness,
                                size: size,
                                code: code,
                                qty: qty,
                                price: price,
                                deliveryCost: deliveryCost,
                                additionalCost: additionalCost
                            }
                        }
                        else {
                            return stock;
                        }
                    });
                    allClear()
                    setText("Add");
                    setTempStocks(newStocks1)
                    setStocks(newStocks)
                    setVisible1(true);
                    setTimeout(() => {
                        setVisible1(false)
                    }, 2000);
                } else {
                    if (tempStocks.length > 0) {
                        alert("Save temporary records first!")
                    } else {
                        setLoading(true);
                        updateProduct(id, product, supplier.id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost).then(result => {
                            if (result.status === 200) {
                                setLoading(false);
                                stocks.forEach(stock => {
                                    if (stock.id === id) {
                                        stock.supplierId = supplier.id;
                                        stock.godown = godown;
                                        stock.company = company;
                                        stock.name = product;
                                        stock.thickness = thickness;
                                        stock.size = size;
                                        stock.code = code;
                                        stock.qty = qty;
                                        stock.supplier = supplier;
                                        stock.price = price;
                                        stock.deliveryCost = deliveryCost;
                                        stock.additionalCost = additionalCost;
                                        return;
                                    }
                                });
                                allClear()
                                setText("Add");
                                setStocks([...stocks]);
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
            }
        } else {
            document.getElementById("supplier").classList.add("border-danger");
        }
    }

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
        if (supplier.id === 0) {
            document.getElementById("supplier").classList.add("border-danger");
        }
        else {
            document.getElementById("supplier").classList.remove("border-danger");
            if (btnText === 'Save') {
                setLoading(true);
                createProduct(product, supplier.id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost).then(result => {
                    if (result.status === 200) {
                        setLoading(false);
                        setStocks([...stocks, result.data])
                        setGodown("");
                        setCompany("");
                        setProduct("");
                        setThickness("");
                        setSize("");
                        setCode("");
                        setQty(0);
                        setSupplier("");
                        setPrice(0);
                        setDeliveryCost(0);
                        setAdditionalCost(0);
                        setId('');
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

            }
        }
    }

    const deleteStock = async () => {
        const permanent = []
        const temporary = []
        selected.forEach(item => {
            if (typeof item === 'string') {
                temporary.push(item)
            } else {
                permanent.push(item)
            }
        })

        if (temporary.length > 0) {
            console.log(temporary)
            setStocks(stocks.filter(stock => !temporary.includes(stock.id)));
            setTempStocks(tempStocks.filter(stock => !temporary.includes(stock.id)));
        }

        if (permanent.length > 0) {
            console.log(permanent)
            setLoading(true);
            await deleteProducts(permanent).then(result => {
                if (result.status === 200) {
                    setLoading(false);
                    setStocks(stocks.filter(stock => !permanent.includes(stock.id)));
                } else {
                    setLoading(false);
                    setVisible3(true);
                }
            })
        }
        setSelected([]);
        setText("Add");
        setVisible2(true);
        setTimeout(() => {
            setVisible2(false)
        }, 2000);
    }

    const allClear = () => {
        setGodown("");
        setCompany("");
        setProduct("");
        setThickness("");
        setSize("");
        setCode("");
        setQty(0);
        setSupplier({id: 0});
        setPrice(0);
        setDeliveryCost(0);
        setAdditionalCost(0);
        setId('');
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
    const onDismiss4 = () => {
        setVisible4(false);
    };

    const checkPassword = () => {
        setLoading(true);
        adminLogin(password).then(result => {
            if (result.status === 200) {
                setVisible4(false);
                setColumns(col2)
                setLoading(false);
                toggle();
                setShowCost(true);
                setText1("Hide Cost");
            } else {
                setLoading(false);
                setError(result.data);
                setVisible4(true);
            }
        })
    }

    useEffect(() => {
        setLoading(true);
        getAllSuppliers().then(result => {
            if (result.status === 200) {
                setSuppliers(result.data);
            } else {
                setLoading(false);
                setVisible3(true);
            }
        })
        getAllProducts().then(products => {
            if (products.status === 200) {
                setLoading(false);
                setStocks(products.data);
            } else {
                setLoading(false);
                setVisible3(true);
            }
        })
    }, [])


    return (
      loading ? <Loader /> :
        <div>
            <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
                A New Stock Added!
            </Alert>
            <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
                Stock Details Are Updated!
            </Alert>
            <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
                Selected Stocks Are Deleted!
            </Alert>
            <Alert color="warning" isOpen={visible3} toggle={onDismiss3.bind(null)}>
                Un Known Error Occurred!
            </Alert>
            <Alert color="danger" isOpen={visible4} toggle={onDismiss4.bind(null)}>
                Incorrect Password!
            </Alert>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <strong>Enter Password</strong>
                </ModalHeader>
                <ModalBody>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={"Enter Password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Col>
                            <Button onClick={checkPassword} className={"btn btn-primary"}>Confirm</Button>
                        </Col>

                    </Row>
                </ModalFooter>
            </Modal>
            <Row>
                <Col xs={"12"} sm={"12"} md={"3"}>
                    <Card>
                        <CardTitle tag="h5" className="border-bottom p-3">
                            <i className="bi bi-box-arrow-in-left me-2"> </i>
                            Add Stock
                        </CardTitle>
                        <CardBody style={{paddingTop: "0"}}>
                            <Form onSubmit={addNewStock}>
                                <div style={{marginBottom: "5px"}}>
                                    <Label for="supplier">Supplier</Label>
                                    <Input  id="supplier" value={supplier?.id} name="select" type="select" required={true} onChange={(e) => {
                                        setSupplier(suppliers.filter((supplier) =>e.target.value==supplier?.id)[0])
                                    }}>
                                        <option value={0}>Choose Supplier</option>
                                        {
                                            suppliers.map((supplier) =>{
                                                return <option key={supplier.id} value={supplier.id}

                                                >{supplier.name}</option>
                                            })
                                        }
                                    </Input>
                                </div>
                                <div style={{marginBottom: "5px"}}>
                                    <Label for="company">Company Name</Label>
                                    <Input
                                      id="company"
                                      name="company"
                                      type="tel"
                                      required={true}
                                      value={company}
                                      onChange={(event) => setCompany(event.target.value)}
                                    />
                                </div>
                                <Row>
                                    <Col xs={"12"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="godown">Godown</Label>
                                            <Input
                                              id="godown"
                                              name="godown"
                                              type="text"
                                              required={true}
                                              value={godown}
                                              onChange={(event) => setGodown(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={"12"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="product">Product</Label>
                                            <Input
                                              id="product"
                                              name="product"
                                              type="text"
                                              value={product}
                                              onChange={(event) => setProduct(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={"6"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="code">Code</Label>
                                            <Input
                                              id="code"
                                              name="code"
                                              type="text"
                                              value={code}
                                              onChange={(event) => setCode(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={"6"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="thickness">Thickness</Label>
                                            <Input
                                              id="thickness"
                                              name="thickness"
                                              type="text"
                                              value={thickness}
                                              onChange={(event) => setThickness(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={"6"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="size">Size</Label>
                                            <Input
                                              id="size"
                                              name="size"
                                              type="text"
                                              value={size}
                                              onChange={(event) => setSize(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={"6"} sm={"6"}>
                                        <div style={{marginBottom: "5px"}}>
                                            <Label for="qty">Qty</Label>
                                            <Input
                                              id="qty"
                                              name="qty"
                                              type="text"
                                              value={qty}
                                              onChange={(event) => setQty(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={"6"} sm={"6"} className="d-flex flex-column bottom-0 mb-1 justify-content-end">
                                        <Button onClick={toggleCost} className={"btn btn-warning"}>{btnText1}</Button>
                                    </Col>
                                    {
                                        showCost ?
                                          <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="price">Price</Label>
                                                  <Input
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    value={price}
                                                    required={true}
                                                    onChange={(event) => setPrice(event.target.value)}
                                                  />
                                              </div>
                                          </Col> : <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="price">Price</Label>
                                                  <Input
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    value={0}
                                                    disabled={true}
                                                  />
                                              </div>
                                          </Col>
                                    }
                                </Row>
                                <Row>
                                    {
                                        showCost ?
                                          <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="delivery">Del. Cost</Label>
                                                  <Input
                                                    id="delivery"
                                                    name="delivery"
                                                    type="text"
                                                    value={deliveryCost}
                                                    required={true}
                                                    onChange={(event) => setDeliveryCost(event.target.value)}
                                                  />
                                              </div>
                                          </Col> : <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="delivery">Del. Cost</Label>
                                                  <Input
                                                    id="delivery"
                                                    name="delivery"
                                                    type="text"
                                                    value={0}
                                                    disabled={true}
                                                  />
                                              </div>
                                          </Col>
                                    }
                                    {
                                        showCost ?
                                          <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="additional">Add. Cost</Label>
                                                  <Input
                                                    id="additional"
                                                    name="additional"
                                                    type="text"
                                                    value={additionalCost}
                                                    required={true}
                                                    onChange={(event) => setAdditionalCost(event.target.value)}
                                                  />
                                              </div>
                                          </Col> : <Col xs={"6"} sm={"6"}>
                                              <div style={{marginBottom: "5px"}}>
                                                  <Label for="additional">Add. Cost</Label>
                                                  <Input
                                                    id="additional"
                                                    name="additional"
                                                    type="text"
                                                    value={0}
                                                    disabled={true}
                                                  />
                                              </div>
                                          </Col>
                                    }
                                </Row>
                                <div className={"d-flex flex-row justify-content-between mt-2"}>
                                    <Button className="btn btn-sm" id="add">{btnText}</Button>
                                    {
                                        tempStocks.length > 0 ?
                                          <Button className={"btn btn-sm btn-success"}>Save</Button> : <></>
                                    }
                                    {
                                        selected.length >= 1 ?
                                          <Button className={'btn btn-sm btn-danger'} onClick={deleteStock}>Delete</Button> : <></>
                                    }
                                    <Button  onClick={allClear} className={"btn btn-sm btn-info"}>Clear</Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs={"12"} sm={"12"} md={"9"} style={{padding: "0"}}>
                    <Card>
                        <CardBody className="pt-2">
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