import React, {useEffect, useRef, useState} from "react";
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
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import generateRandomNumber from '../../utils/helper';
import '../../assets/css/style.css';


const Pricing = () => {
    const { SearchBar } = Search;
    const [id, setId] = useState(`B-${generateRandomNumber()}`);
    const [gatePass, setGatePass] = useState(`G-xxxxxx`);
    const [reference, setReference] = useState('')
    const [customer, setCustomer] = useState({id: 0})

    const [product, setProduct] = useState({id: 0})
    const [qty, setQty] = useState(1)
    const [unit, setUnit] = useState('')
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)

    const [selected, setSelected] = useState([])
    const [selectedPricing, setSelectedPricing] = useState([])
    const [btnText, setText] = useState('Add');
    const [btnPricingText, setPricingText] = useState('Save');

    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [customers, setCustomers] = useState([{id:1, name:"Mudassar"}, {id:2, name:"Faizan"}, {id:3, name:"Hassan"}]);
    const [products, setProducts] = useState([{id:1, product:"Wood Panel", price: 150}, {id:2, product:"Cabinet", price: 135.5}, {id:3, product:"Door", price: 100}]);
    const [items, setItems] = useState([])
    const [pricings, setPricings] = useState([])


    const toggle = () => setOpen(!open);

    const savePricing = (event) => {
        event.preventDefault();
        if (customer.id === 0) {
            document.getElementById("customer").classList.add("border-danger");
        }
        else{
            document.getElementById("customer").classList.remove("border-danger");
            const newGatePass = `G-${generateRandomNumber()}`
            const pricing = {
                id: id,
                gatePass: newGatePass,
                reference: reference,
                customer: customer,
                items: items
            }
            setGatePass(newGatePass);
            setPricings([...pricings, pricing]);
            setVisible(true);
            setTimeout(() => {
                setVisible(false)
            }, 2000);
            allClear();
        }
    }

    const addItem = (event) => {
      event.preventDefault();
      if (btnText === 'Add') {
          if (product.id === 0){
              document.getElementById("product").classList.add("border-danger");
          }
          else {
              document.getElementById("product").classList.remove("border-danger");
              const id = generateRandomNumber()
              setItems([...items, {id, product, unit, qty, discount, total }])
              setProduct({id: 0});
              setQty(1);
              setUnit('');
              setDiscount(0);
              setTotal(0);
          }
      } else if (btnText === 'Update') {
          items.forEach(item => {
              if (item.id === selected[0]) {
                  item.product = product;
                  item.qty = qty;
                  item.discount = discount;
                  item.total = total;
                  item.unit = unit;
                  return;
              }
          });
          setProduct({id: 0});
          setQty(1);
          setUnit('');
          setDiscount(0);
          setTotal(0);
          setText("Add");
          setItems([...items]);
      }
  }

    const deleteItem = () => {
        setItems(items.filter(item => !selected.includes(item.id)));
        setSelected([]);
        setText("Add");
    }

    const editItem = () => {
        items.forEach(item => {
            if (item.id === selected[0]) {
                setProduct(item.product);
                setUnit(item.unit)
                setQty(item.qty)
                setDiscount(item.discount)
                setTotal(item.total)
                setText("Update")
            }
        })
    }

    const onSelect = (row, isSelect) => {
        if (isSelect) {
            setSelected([...selected, row.id])
        } else {
            setSelected(selected.filter(x => x !== row.id))
        }
    }

    const onPricingSelect = (row, isSelect) => {
        if (isSelect) {
            setSelectedPricing([...selectedPricing, row.id])
        } else {
            setSelectedPricing(selectedPricing.filter(x => x !== row.id))
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

    const onPricingSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.id);
        if (isSelect) {
            setSelectedPricing(ids);
        } else {
            setSelectedPricing([])
        }
    }

    const selectRow = {
        mode: 'checkbox',
        selected: selected,
        onSelect: onSelect,
        onSelectAll: onSelectAll
    }

    const selectPricingRow = {
        mode: 'checkbox',
        selected: selectedPricing,
        onSelect: onPricingSelect,
        onSelectAll: onPricingSelectAll
    }

    const columns = [
        {
            dataField: 'sl.no',
            text: 'Sr #',
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return rowIndex + 1;
            },
            sort: true,
        }, {
            dataField: 'product.product',
            text: 'Product',
            sort: true
        }, {
            dataField: 'unit',
            text: 'Unit Price',
        }, {
            dataField: 'qty',
            text: 'Quantity',
        }, {
            dataField: 'discount',
            text: 'Discount',
        }, {
            dataField: 'total',
            text: 'Total',
        }
    ]

    const pricingColumns = [
        {
            dataField: 'sl.no',
            text: 'Sr #',
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return rowIndex + 1;
            },
            sort: true,
        }, {
            dataField: 'id',
            text: 'ID',
            sort: true
        }, {
            dataField: 'gatePass',
            text: 'Gate Pass No.',
        }, {
            dataField: 'reference',
            text: 'Reference No.',
        }, {
            dataField: 'customer.name',
            text: 'Customer',
        }
    ]

    const unitChange = (event) => {
        setUnit(event.target.value);
        if (event.target.value){
            const newUnit = parseFloat(event.target.value);
            const newDiscount = parseFloat(discount);
            const newTotal = (newUnit * qty) - newDiscount;
            if (newTotal < 0) {
                setDiscount(0)
                const newTotal = newUnit * qty;
                setTotal(Math.round(newTotal));
            }
            else {
                setTotal(Math.round(newTotal));
            }
        }
        else {
            setTotal(0)
        }
    }

    const qtyChange = (event) => {
        setQty(event.target.value);
        if (unit && discount !== ''){
            const newUnit = parseFloat(unit);
            const newDiscount = parseFloat(discount);
            const newTotal = (newUnit * event.target.value) - newDiscount;
            if (newTotal < 0) {
                setDiscount(0)
                const newTotal = newUnit * event.target.value;
                setTotal(Math.round(newTotal));
            }
            else {
                setTotal(Math.round(newTotal));
            }
        }
        else {
            setTotal(0)
        }
    }

    const discountChange = (event) => {
        setDiscount(event.target.value)
        if (event.target.value){
            const newUnit = parseFloat(unit);
            const newDiscount = parseFloat(event.target.value);
            const newTotal = (newUnit * qty) - newDiscount;
            if (newTotal < 0) {
                setDiscount(0)
                const newTotal = newUnit * qty;
                setTotal(Math.round(newTotal));
            }
            else {
                setTotal(Math.round(newTotal));
            }
        }
    }

    const allClear = () => {
        setId(`B-${generateRandomNumber()}`);
        setGatePass('G-xxxxxx');
        setReference('');
        setCustomer({id: 0});
        setProduct({id: 0});
        setUnit('');
        setQty(1);
        setDiscount(0);
        setTotal(0);
        setItems([]);
        setSelected([]);
        setText('Add');
        setOpen(false);

    }

    const openPricing = () => {

    }

    const deletePricing = () => {

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


  return (
    <div>
        <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
            Pricing Saved Successfully!
        </Alert>
        <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
            Supplier Details Are Updated!
        </Alert>
        <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
            Selected Supplier Are Deleted!
        </Alert>
        <Modal isOpen={open} toggle={toggle} contentClassName={"pricing-modal"}>
            <ModalHeader toggle={toggle}>
                <strong>Select Pricing</strong>
            </ModalHeader>
            <ModalBody>
                <ToolkitProvider
                    keyField={'id'}
                    columns={pricingColumns}
                    data={pricings}
                    search
                >
                    {
                        props => (
                            <div>
                                <SearchBar { ...props.searchProps }  />
                                <hr />
                                <BootstrapTable
                                    pagination={paginationFactory()}
                                    selectRow={selectPricingRow}
                                    { ...props.baseProps }
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </ModalBody>
            <ModalFooter>
                <Row>
                    <Col>
                        {
                            selectedPricing.length === 1 ?
                                <Button onClick={openPricing} className={"btn btn-primary"}>Open</Button> : <></>
                        }
                    </Col>
                    <Col>
                        {
                            selectedPricing.length >= 1 ?
                                <Button onClick={deletePricing} className={"btn btn-danger"}>Delete</Button> : <></>
                        }

                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
        <Row>
            <Col className={"col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12"}>
                <Card>
                    <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                        <i className="bi bi-receipt-cutoff me-2"> </i>
                        Add Pricing
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={savePricing}>
                            <Row>
                                <Col className={"col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3"}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="name">Pricing No.</Label>
                                                <h5 className={'mt-2'}><b>{id}</b></h5>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="name">Gate Pass No.</Label>
                                                <h5 className={'mt-2'}><b>{gatePass}</b></h5>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className={"col-sm-12 col-md-6 col-lg-2 col-xl-2 col-xxl-2"}>
                                    <FormGroup>
                                        <Label for="reference">Reference Number</Label>
                                        <Input
                                            id="reference"
                                            name="reference"
                                            type="text"
                                            required={true}
                                            value={reference}
                                            onChange={(event) => setReference(event.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col  className={"col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3"}>
                                    <FormGroup>
                                        <Label for="customer">Customer</Label>
                                        <Input  id="customer" value={customer?.id} name="select" type="select" required={true} onChange={(e) => {
                                            setCustomer(customers.filter((customer) =>e.target.value==customer?.id)[0])
                                        }}>
                                            <option value={0}>Choose Customer</option>
                                            {
                                                customers.map((customer) =>{
                                                    return <option key={customer.id} value={customer.id}

                                                    >{customer.name}</option>
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col  className={"col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"} style={{marginTop: '30px'}}>
                                    <Row>
                                        <Col className={'col-3'}>
                                            {
                                                items.length >= 1 ? <Button type={"submit"} className={"btn btn-success"}>{btnPricingText}</Button> : <></>
                                            }
                                        </Col>
                                        <Col  className={'col-3'}>
                                            {
                                                items.length >= 1 ? <Button className={''}>Print</Button> : <></>
                                            }
                                        </Col>
                                        <Col  className={'col-3'}>
                                            {
                                                !open ? <Button onClick={toggle} className={"btn btn-info"}>Open</Button> : <></>
                                            }
                                        </Col>
                                        <Col  className={'col-3'}>
                                            <Button className={"btn btn-warning"} onClick={allClear}>Clear</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col className={"col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4"}>
                <Card>
                    <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                        <i className="bi bi-boxes me-2"> </i>
                        Add Item
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={addItem}>
                            <FormGroup>
                                <Label for="product">Product</Label>
                                <Input id="product" className={"border"} value={product?.id} name="select" type="select" required={true} onChange={(e) => {
                                    setProduct(products.filter((product) =>e.target.value==product?.id)[0])
                                }}>
                                    <option value={0}>Choose Product</option>
                                    {
                                        products.map((product) =>{
                                            return <option key={product.id} value={product.id}>{product.product}</option>
                                        })
                                    }
                                </Input>
                            </FormGroup>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="unit">Unit Price</Label>
                                        <Input
                                            id="unit"
                                            name="unit"
                                            type="number"
                                            required={true}
                                            value={unit}
                                            onChange={(event) => unitChange(event)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="qty">Quantity</Label>
                                        <Input id="qty" value={qty} name="select" type="select" onChange={(event) => qtyChange(event)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                            <option value="24">24</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            <option value="30">30</option>

                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="discount">Discount</Label>
                                        <Input
                                            id="discount"
                                            name="discount"
                                            type="number"
                                            value={discount}
                                            onChange={(event) => discountChange(event)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="total">Total Price</Label>
                                        <h5 className={"mt-2"}><b>{total}</b></h5>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className={'d-flex justify-content-between'}>
                                <Button>{btnText}</Button>
                                {
                                    selected.length == 1 ? <Button className={"btn btn-sm btn-warning"} onClick={editItem}>Edit</Button> : <></>
                                }
                                {
                                    selected.length >= 1 ? <Button className={'btn btn-danger'} onClick={deleteItem}>Delete</Button> : <></>
                                }
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Col className={"col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8"}>
                <Card>
                    <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                        <i className="bi bi-boxes me-2"> </i>
                        Items
                    </CardTitle>
                    <CardBody className="">
                        <ToolkitProvider
                            keyField={'id'}
                            columns={columns}
                            data={items}
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

export default Pricing