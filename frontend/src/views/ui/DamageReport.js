import React, { useEffect, useRef, useState } from "react";
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
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { saveAs } from 'file-saver';
import generateRandomNumber from "../../utils/helper";
import "../../assets/css/style.css";
import "../../assets/css/pricing.css";
import Loader from "../../layouts/loader/Loader";
import { getAllCustomers } from "../../api/customer";
import {filterProducts, getAllProducts} from "../../api/stock";
import { getAllPricings, createPricing, getPricing, deletePricings, updatePricing } from "../../api/pricing";
// import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import Template from '../../layouts/Template';
import { useNavigate } from 'react-router-dom';


const DamageReport = () => {
  const navigate = useNavigate();
  const { SearchBar } = Search;
  const [id, setId] = useState(`D-xxxxxx`);
  const [gatePass, setGatePass] = useState(`G-xxxxxx`);
  const [reference, setReference] = useState("");
  const [customer, setCustomer] = useState({ id: 0 });

  const [product, setProduct] = useState({ id: 0 });
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("");
  const [total, setTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);

  const [selected, setSelected] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState([]);
  const [btnText, setText] = useState("Add");
  const [btnPricingText, setPricingText] = useState("Save");

  const [open, setOpen] = useState(false);
  const [printButton, setPrintButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [pricings, setPricings] = useState([]);
  const [printingPricing, setPrintingPricing] = useState(null);
  const reportTemplateRef = useRef(null);

  const [companyNames, setCompanyNames] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [codeNames, setCodeNames] = useState([]);
  const [sizeNames, setSizeNames] = useState([]);
  const [thicknessNames, setThicknessNames] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedThickness, setSelectedThickness] = useState("");

  const toggle = () => setOpen(!open);

  const save = async () => {
    const newGatePass = `G-${generateRandomNumber()}`;
    const pricing_items = items.map(item => {
      return {
        unit_price: item.unit_price,
        qty: item.qty,
        total: item.total,
        productId: item.product.id
      }
    })
    const pricing = {
      gatepass_no: newGatePass,
      reference: reference,
      customer_id: customer.id,
      pricing_items: pricing_items,
      total: netTotal,
      tax: tax,
      discount: discount,
      gross: grossTotal,
      type: "damage"
    };
    setLoading(true)
    await createPricing(pricing).then(async res => {
      if (res.status === 200) {
        setId(`D-${res.data.id}`)
        setGatePass(newGatePass);
        setPricings([...pricings, { ...pricing, id: res.data.id, customer: customer }]);
        setLoading(false);
        setPrintButton(true);
        setVisible(true);
        setTimeout(() => {
          setVisible(false);
        }, 2000);
        await printInvoice()
      } else {
        setLoading(false)
        setVisible3(true)
      }
    }).catch(err => {
      setLoading(false)
      setVisible3(true)
    })
  }

  const update = async () => {
    const pricing_items = items.map(item => {
      return {
        unit_price: item.unit_price,
        qty: item.qty,
        total: item.total,
        productId: item?.product?.id
      }
    })
    let status = true;
    for (const pricing_item of pricing_items) {
      if (!pricing_item.productId) {
        status = false;
        break;
      }
    }
    if (status) {
      const pricing = {
        gatepass_no: gatePass,
        reference: reference,
        customer_id: customer.id,
        pricing_items: pricing_items,
        total: netTotal,
        tax: tax,
        discount: discount,
        gross: grossTotal
      };
      setLoading(true)
      await updatePricing(id, pricing).then(res => {
        if (res.status === 200) {
          setLoading(false);
          setVisible1(true);
          setTimeout(() => {
            setVisible1(false);
          }, 2000);
        } else {
          setLoading(false)
          setVisible3(true)
        }
      }).catch(err => {
        console.log(err)
        setLoading(false)
        setVisible3(true)
      })
    } else {
      alert("There are some items in pricing that don't belong to any product (N/A), Please delete them before updating!")
    }
  }

  const savePricing = async (event) => {
    event.preventDefault();
    if (customer.id === 0) {
      document.getElementById("customer").classList.add("border-danger");
    } else {
      document.getElementById("customer").classList.remove("border-danger");
      if (btnPricingText === "Save") {
        await save();
      } else if (btnPricingText === "Update") {
        await update();
      }
    }
  };

  const addItem = (event) => {
    event.preventDefault();
    if (btnText === "Add") {
      if (product.id === 0) {
        document.getElementById("product").classList.add("border-danger");
      } else {
        document.getElementById("product").classList.remove("border-danger");
        const id = generateRandomNumber();
        setItems([...items, { id, product, unit_price: unit, qty, total }]);
        setProduct({ id: 0 });
        setQty(1);
        setUnit("");
        setTotal(0);
        setNetTotal(netTotal + total);
      }
    } else if (btnText === "Update") {
      let prevNetTotal = netTotal;
      items.forEach((item) => {
        if (item.id === selected[0]) {
          item.product = product;
          item.qty = qty;
          prevNetTotal = prevNetTotal - item.total
          setNetTotal(prevNetTotal)
          item.total = total;
          item.unit_price = unit;
          return;
        }
      });
      setProduct({ id: 0 });
      setQty(1);
      setUnit("");
      setTotal(0);
      setNetTotal(prevNetTotal + total);
      setText("Add");
      setItems([...items]);
      setSelected([]);
    }
  };

  const deleteItem = () => {
    setItems(items.filter((item) => {
      setNetTotal(netTotal - item.total);
      return !selected.includes(item.id);
    }));
    setSelected([]);
    setText("Add");
  };

  const editItem = () => {
    items.forEach((item) => {
      if (item.id === selected[0]) {
        setProduct(item.product);
        setSelectedCompany(item.product.company);
        setSelectedProduct(item.product.name)
        setSelectedCode(item.product.code)
        setSelectedSize(item.product.size)
        setSelectedThickness(item.product.thickness)
        setUnit(item.unit_price);
        setQty(item.qty);
        setTotal(item.total);
        setText("Update");
      }
    });
  };

  const onSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([...selected, row.id]);
    } else {
      setSelected(selected.filter((x) => x !== row.id));
    }
  };

  const onPricingSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedPricing([...selectedPricing, row.id]);
    } else {
      setSelectedPricing(selectedPricing.filter((x) => x !== row.id));
    }
  };

  const onSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r.id);
    if (isSelect) {
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const onPricingSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r.id);
    if (isSelect) {
      setSelectedPricing(ids);
    } else {
      setSelectedPricing([]);
    }
  };

  const selectRow = {
    mode: "checkbox",
    selected: selected,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
  };

  const selectPricingRow = {
    mode: "checkbox",
    selected: selectedPricing,
    onSelect: onPricingSelect,
    onSelectAll: onPricingSelectAll,
  };

  const nullChecker = cell => (!cell ? "N/A" : cell);

  const columns = [
    {
      dataField: "sl.no",
      text: "Sr #",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
      sort: true,
    },
    {
      dataField: "product.name",
      text: "Product",
      sort: true,
      formatter: nullChecker
    },
    {
      dataField: "unit_price",
      text: "Unit Price",
    },
    {
      dataField: "qty",
      text: "Quantity",
    },
    {
      dataField: "total",
      text: "Total",
    },
  ];

  const pricingColumns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "gatepass_no",
      text: "Gate Pass No.",
    },
    {
      dataField: "reference",
      text: "Reference No.",
    },
    {
      dataField: "customer.name",
      text: "Customer",
    },
    {
      dataField: "type",
      text: "Type",
    },
  ];

  const unitChange = (event) => {
    setUnit(event.target.value);
    if (event.target.value) {
      const newUnit = parseFloat(event.target.value);
      const newTotal = newUnit * qty;
      if (newTotal < 0) {
        const newTotal = newUnit * qty;
        setTotal(Math.round(newTotal));
      } else {
        setTotal(Math.round(newTotal));
      }
    } else {
      setTotal(0);
    }
  };

  const qtyChange = (event) => {
    const prods = products.filter(prod => prod.id === product.id)
    if (prods.length === 0) {
      setQty(1);
    }
    else if (prods.length === 1 && parseInt(event.target.value) > prods[0].qty) {
      alert(`Input quantity for ${prods[0].name} should be less than or equal to ${prods[0].qty}`)
    }
    else {
      setQty(event.target.value);
      if (unit) {
        const newUnit = parseFloat(unit);
        const newTotal = newUnit * event.target.value;
        if (newTotal < 0) {
          const newTotal = newUnit * event.target.value;
          setTotal(Math.round(newTotal));
        } else {
          setTotal(Math.round(newTotal));
        }
      } else {
        setTotal(0);
      }
    }
  };


  const allClear = () => {
    setId('B-xxxxxx');
    setGatePass("G-xxxxxx");
    setReference("");
    setCustomer({ id: 0 });
    setProduct({ id: 0 });
    setUnit("");
    setQty(1);
    setTotal(0);
    setNetTotal(0);
    setDiscount(0);
    setTax(0);
    setGrossTotal(0);
    setItems([]);
    setSelected([]);
    setSelectedPricing([]);
    setText("Add");
    setPricingText("Save");
    setPrintButton(false);
    setOpen(false);
  };

  const openPricing = async () => {
    setLoading(true);
    await getPricing(selectedPricing[0]).then(res => {
      if (res.status === 200) {
        setOpen(false);
        setLoading(false);
        setSelectedPricing([]);
        const data = res.data;
        setId(data.id);
        setGatePass(data.gatepass_no);
        setReference(data.reference);
        setCustomer(data.customer);
        setNetTotal(data.total);
        setDiscount(data.discount);
        setTax(data.tax);
        setGrossTotal(data.gross);
        setItems(data.pricing_items);
        setPricingText("Update");
        setPrintButton(true);
      } else {
        setSelectedPricing([]);
        setOpen(false);
        setLoading(false);
        setVisible3(true);
      }
    }).catch(err => {
      setSelectedPricing([]);
      setOpen(false);
      setLoading(false);
      setVisible3(true);
    })
  };

  const deletePricing = async () => {
    setLoading(true);
    await deletePricings(selectedPricing).then(res => {
      if (res.status === 200) {
        setLoading(false);
        setPricings(pricings.map(pricing => !selectedPricing.includes(pricing.id)));
        setSelectedPricing([]);
        setOpen(false);
        allClear();
        setVisible2(true);
        setTimeout(() => {
          setVisible2(false);
        }, 2000);
      } else {
        setOpen(false);
        setSelectedPricing([]);
        setLoading(false);
        setVisible3(true);
      }
    }).catch(err => {
      setOpen(false);
      setSelectedPricing([]);
      setLoading(false);
      setVisible3(true);
    })
  };

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

  function getFormattedTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  const printInvoice = async () => {
    const dateTime = getFormattedTimestamp();
    const data = {
      id: id,
      name: "DAMAGE PRICING",
      gatepass: gatePass,
      reference: reference,
      customer_name: customer.name,
      date: dateTime,
      products: items,
      net_total: netTotal,
      discount: discount,
      tax: tax,
      gross_total: grossTotal,
    }
    setPrintingPricing(data);
  }

  useEffect(() => {
    setLoading(true);
    getAllCustomers().then((customers) => {
      if (customers.status === 200) {
        setCustomers(customers.data);
      } else {
        setLoading(false);
        setVisible3(true);
      }
    });
    // getAllProducts().then((products) => {
    //   if (products.status === 200) {
    //     setProducts(products.data);
    //   } else {
    //     setLoading(false);
    //     setVisible3(true);
    //   }
    // });
    getAllPricings("damage").then((pricings) => {
      if (pricings.status === 200) {
        setPricings(pricings.data);
        setLoading(false);
      } else {
        setLoading(false);
        setVisible3(true);
      }
    });
    filterProducts({"target": ["company"]}).then((companies) => {
      if (companies.status === 200) {
        setCompanyNames(companies.data.map(company => company.company));
        setLoading(false);
      } else {
        setLoading(false);
        setVisible3(true);
      }
    })
  }, []);

  useEffect(() => {
    let floatTax = 0
    let floatDiscount = 0
    if (discount !== '') {
      floatDiscount = parseFloat(discount)
    } else {
      floatDiscount = 0
    }
    if (tax !== '') {
      floatTax = parseFloat(tax)
    } else {
      floatTax = 0
    }
    const gross = (parseFloat(netTotal) - floatDiscount) + floatTax;
    setGrossTotal(gross.toFixed(0));
  }, [netTotal, discount, tax]);

  useEffect(() => {
    if(selectedCompany && selectedCompany !== "") {
      filterProducts({"target": ["name"], "company": selectedCompany}).then(product => {
        if (product.status === 200) {
          setProductNames(product.data.map(company => company.name));
          setLoading(false);
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })
    }
  }, [selectedCompany])

  useEffect(() => {
    if(selectedProduct && selectedProduct !== "") {
      filterProducts({"target": ["code"], "company": selectedCompany, "name": selectedProduct}).then(code => {
        if (code.status === 200) {
          setCodeNames(code.data.map(code => code.code));
          setLoading(false);
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })
    }
  }, [selectedProduct])

  useEffect(() => {
    if(selectedCode && selectedCode !== "") {
      filterProducts({"target": ["size"], "company": selectedCompany, "name": selectedProduct, "code": selectedCode}).then(size => {
        if (size.status === 200) {
          setSizeNames(size.data.map(size => size.size));
          setLoading(false);
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })
    }
  }, [selectedCode])

  useEffect(() => {
    if(selectedSize && selectedSize !== "") {
      filterProducts({"target": ["thickness", "name", "id", "total_qty"], "company": selectedCompany, "name": selectedProduct, "code": selectedCode, "size": selectedSize}).then(products => {
        if (products.status === 200) {
          setProducts(products.data)
          setThicknessNames(products.data.map(product => product.thickness));
          setLoading(false);
        } else {
          setLoading(false);
          setVisible3(true);
        }
      })
    }
  }, [selectedSize])

  useEffect(() => {
    if(selectedThickness && selectedThickness !== "") {
      setProduct(products.filter(product => product.thickness === selectedThickness)[0])
    }
  }, [selectedThickness])

  useEffect(() => {
    if(printingPricing) {
      const filename = `${printingPricing.customer_name}-damage-invoice-${printingPricing.date}.pdf`
      const pdfOptions = {
        filename: filename,
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'A4', orientation: 'portrait' },
      };

      html2pdf().set(pdfOptions).from(reportTemplateRef.current).to('pdf').save(filename);
      html2pdf().set(pdfOptions).from(reportTemplateRef.current).toPdf().get('pdf').then((pdf) => {
        window.open(pdf.output('bloburl'), '_blank');
      });
      setPrintingPricing(null)
    }
  }, [printingPricing])

  if (loading) {
    return <Loader />
  }

  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <>
      <div style={{ flexDirection: "row", display: "flex", gap: " 25px", marginBottom: "25px" }}>
        <Button style={{ border: "none" }} outline color="info" onClick={() => handleNavigation("/pricing")}><b>Pricing</b></Button>
        <Button style={{ border: "none" }} outline color="warning" onClick={() => handleNavigation("/return")}><b>Returned</b></Button>
        <Button outline active color="danger" onClick={() => handleNavigation("/damage")}>Damage</Button>
      </div>
      <div>
        <div style={{ display: 'none' }}>
          <div ref={reportTemplateRef}>
            {
              printingPricing && (
                <Template data={printingPricing} />
              )
            }
          </div>
        </div>
        <Alert color="success" isOpen={visible} toggle={onDismiss.bind(null)}>
          Pricing Saved Successfully!
        </Alert>
        <Alert color="info" isOpen={visible1} toggle={onDismiss1.bind(null)}>
          Pricing Details Are Updated!
        </Alert>
        <Alert color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
          Selected Pricings Are Deleted!
        </Alert>
        <Alert color="danger" isOpen={visible3} toggle={onDismiss3.bind(null)}>
          An Error Occurred!
        </Alert>
        <Modal isOpen={open} toggle={toggle} contentClassName={"pricing-modal"}>
          <ModalHeader toggle={toggle}>
            <strong>Select Damage Pricing</strong>
          </ModalHeader>
          <ModalBody>
            <ToolkitProvider
              keyField={"id"}
              columns={pricingColumns}
              data={pricings}
              search
            >
              {(props) => (
                <div>
                  <SearchBar {...props.searchProps} />
                  <hr />
                  <BootstrapTable
                    pagination={paginationFactory()}
                    selectRow={selectPricingRow}
                    {...props.baseProps}
                  />
                </div>
              )}
            </ToolkitProvider>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col>
                {selectedPricing.length === 1 ? (
                  <Button onClick={openPricing} className={"btn btn-primary"}>
                    Open
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
              <Col>
                {selectedPricing.length >= 1 ? (
                  <Button onClick={deletePricing} className={"btn btn-danger"}>
                    Delete
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
        <Row>
          <Col className={"col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4"}>
            <Card className="mb-1">
              <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                <i className="bi bi-boxes me-2"> </i>
                Add Item
              </CardTitle>
              <CardBody>
                <Form onSubmit={addItem}>
                  <FormGroup>
                    <Label for="company">Company</Label>
                    <Input
                      id="company"
                      className={"border"}
                      value={selectedCompany}
                      name="select"
                      type="select"
                      required={true}
                      onChange={(e) => {
                        setSelectedCompany(
                          companyNames.filter(
                            (company) => e.target.value === company
                          )[0]
                        );
                      }}
                    >
                      <option value={""}>Choose Company</option>
                      {companyNames.map((company, index) => {
                        return (
                          <option key={index} value={company}>
                            {company}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="product">Product</Label>
                    <Input
                      id="product"
                      className={"border"}
                      value={selectedProduct}
                      name="select"
                      type="select"
                      required={true}
                      onChange={(e) => {
                        setSelectedProduct(
                          productNames.filter(
                            (product) => e.target.value === product
                          )[0]
                        );
                      }}
                    >
                      <option value={""}>Choose Product</option>
                      {productNames.map((product, index) => {
                        return (
                          <option key={index} value={product}>
                            {product}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="code">Code</Label>
                    <Input
                      id="code"
                      className={"border"}
                      value={selectedCode}
                      name="select"
                      type="select"
                      required={true}
                      onChange={(e) => {
                        setSelectedCode(
                          codeNames.filter(
                            (code) => e.target.value === code
                          )[0]
                        );
                      }}
                    >
                      <option value={""}>Choose Code</option>
                      {codeNames.map((code, index) => {
                        return (
                          <option key={index} value={code}>
                            {code}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="size">Size</Label>
                    <Input
                      id="size"
                      className={"border"}
                      value={selectedSize}
                      name="select"
                      type="select"
                      required={true}
                      onChange={(e) => {
                        setSelectedSize(
                          sizeNames.filter(
                            (size) => e.target.value === size
                          )[0]
                        );
                      }}
                    >
                      <option value={""}>Choose Size</option>
                      {sizeNames.map((size, index) => {
                        return (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="thickness">Thickness</Label>
                    <Input
                      id="size"
                      className={"border"}
                      value={selectedThickness}
                      name="select"
                      type="select"
                      required={true}
                      onChange={(e) => {
                        setSelectedThickness(
                          thicknessNames.filter(
                            (thickness) => e.target.value === thickness
                          )[0]
                        );
                      }}
                    >
                      <option value={""}>Choose Thickness</option>
                      {thicknessNames.map((thickness, index) => {
                        return (
                          <option key={index} value={thickness}>
                            {thickness}
                          </option>
                        );
                      })}
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
                        <Input
                          id="qty"
                          value={qty}
                          name="select"
                          type="select"
                          onChange={(event) => qtyChange(event)}
                        >
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
                    <Col>
                      <FormGroup>
                        <Label for="total">Total Price</Label>
                        <h5 className={"mt-2"}>
                          <b>{total}</b>
                        </h5>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className={"d-flex justify-content-between"}>
                    <Button>{btnText}</Button>
                    {selected.length == 1 ? (
                      <Button
                        className={"btn btn-sm btn-warning"}
                        onClick={editItem}
                      >
                        Edit
                      </Button>
                    ) : (
                      <></>
                    )}
                    {selected.length >= 1 ? (
                      <Button className={"btn btn-danger"} onClick={deleteItem}>
                        Delete
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className={"col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8"}>
            <Card className="mb-1">
              <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                <i className="bi bi-boxes me-2"> </i>
                Items
              </CardTitle>
              <CardBody>
                <ToolkitProvider keyField={"id"} columns={columns} data={items}>
                  {(props) => (
                    <div className="my-table">
                      <BootstrapTable
                        selectRow={selectRow}
                        {...props.baseProps}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col className={"col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12"}>
            <Card>
              <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                <i className="bi bi-receipt-cutoff me-2"> </i>
                Add Damage Pricing
              </CardTitle>
              <CardBody>
                <Form onSubmit={savePricing}>
                  <Row>
                    <Col
                      className={"col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3"}
                    >
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label for="name">Net Total</Label>
                            <h5 className={"mt-2"}>
                              <b>{netTotal}</b>
                            </h5>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="discount">Discount</Label>
                            <Input
                              id="discount"
                              name="discount"
                              type="number"
                              required={true}
                              value={discount}
                              onChange={(event) => setDiscount(event.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label for="tax">Tax</Label>
                            <Input
                              id="tax"
                              name="tax"
                              type="number"
                              required={true}
                              value={tax}
                              onChange={(event) => setTax(event.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="name">Gross Total</Label>
                            <h5 className={"mt-2"}>
                              <b>{grossTotal}</b>
                            </h5>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
                      <FormGroup>
                        <Label for="name">Type</Label>
                        <h5 className={"mt-2"}>
                          <b>Damage Pricing</b>
                        </h5>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      className={"col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3"}
                    >
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label for="name">Damage No.</Label>
                            <h5 className={"mt-2"}>
                              <b>{id}</b>
                            </h5>
                          </FormGroup>
                        </Col>

                        <Col>
                          <FormGroup>
                            <Label for="name">Gate Pass No.</Label>
                            <h5 className={"mt-2"}>
                              <b>{gatePass}</b>
                            </h5>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      className={"col-sm-12 col-md-6 col-lg-2 col-xl-2 col-xxl-2"}
                    >
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
                    <Col
                      className={"col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3"}
                    >
                      <FormGroup>
                        <Label for="customer">Customer</Label>
                        <Input
                          id="customer"
                          value={customer?.id}
                          name="select"
                          type="select"
                          required={true}
                          onChange={(e) => {
                            setCustomer(
                              customers.filter(
                                (customer) => e.target.value == customer?.id
                              )[0]
                            );
                          }}
                        >
                          <option value={0}>Choose Customer</option>
                          {customers.map((customer) => {
                            return (
                              <option key={customer.id} value={customer.id}>
                                {customer.name}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col
                      className={"col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"}
                      style={{ marginTop: "30px" }}
                    >
                      <Row>
                        <Col className={"col-3"}>
                          {items.length >= 1 ? (
                            <Button type={"submit"} className={"btn btn-success"}>
                              {btnPricingText}
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Col>
                        <Col className={"col-3"}>
                          {items.length >= 1 ? (
                            <Button className={""} onClick={printInvoice}>Print</Button>
                          ) : (
                            <></>
                          )}
                        </Col>
                        <Col className={"col-3"}>
                          {!open ? (
                            <Button onClick={toggle} className={"btn btn-info"}>
                              Open
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Col>
                        <Col className={"col-3"}>
                          <Button
                            className={"btn btn-warning"}
                            onClick={allClear}
                          >
                            Clear
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>

  );
};

export default DamageReport;
