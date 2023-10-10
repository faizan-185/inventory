import {  useState } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Alert, Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { getProductIndications } from '../../api/pricing';
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "../../layouts/loader/Loader";
import { updateHomeIndication } from '../../api/auth';

const ProductIndication = () => {
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [dateRange, setDateRange] = useState(null);
  const [homeDateRange, setHomeDateRange] = useState(null);
  const [deadProducts, setDeadProducts] = useState([])
  const [sellingProducts, setSellingProducts] = useState([])
  const [qtyIndicationProducts, setQtyIndcationProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState({})
  const [response, setResponse] = useState(false)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)
  const [dateToDisplay, setDateToDisplay] = useState([{
    startDate: new Date(),
    endDate: new Date(),
  }])
  const [dateToDisplayModal, setDateToDisplayModal] = useState([{
    startDate: new Date(),
    endDate: new Date(),
  }])

  const formatDate = (date, isEndDate = false) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    if (isEndDate) {
      hours = '23';
      minutes = '59';
      seconds = '59';
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (item) => {
    setDateToDisplay([item.range1])
    const formattedStartDate = formatDate(item.range1.startDate);
    const formattedEndDate = formatDate(item.range1.endDate, true);

    const newState =
    {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }

    setDateRange(newState);
  };

  const handleDateChangeModal = (item) => {
    setDateToDisplayModal([item.range1])
    const formattedStartDate = formatDate(item.range1.startDate);
    const formattedEndDate = formatDate(item.range1.endDate, true);

    const newState =
    {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }

    setHomeDateRange(newState);
  };

  const handleToggle = () => {
    setOpen(!open)
    setHomeDateRange(null)
    setDateToDisplayModal([{
      startDate: new Date(),
      endDate: new Date(),
    }])
  }

  const handleClick = () => {
    if (!dateRange) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);
      return
    }
    setLoading(true)

    getProductIndications(dateRange).then(res => {
      if (res.status === 200) {
        setResponse(true)
        setDeadProducts(res.data.deadProducts)
        setSellingProducts(res.data.sellingProducts)
        setQtyIndcationProducts(res.data.qtyIndication)
        setLoading(false)
      }
    }).catch(error => {
      setResponse(false)
      setLoading(false)
      setVisible1(true)
      setError(error.response.data)
      setTimeout(() => {
        setVisible1(false);
      }, 5000);
    })
  }

  const handleModalClick = () => {
    setLoading(true)
    updateHomeIndication(homeDateRange).then(res => {
      setVisible2(true)
      handleToggle()
      setLoading(false)
      setTimeout(() => {
        setVisible2(false);
      }, 3000);
    }).catch(error => {
      handleToggle()
      setVisible2(true)
      setTimeout(() => {
        setVisible2(false);
      }, 5000);
      setError(error.response.data)
      setLoading(false)
    })
  }

  const handleClear = () => {
    setDateToDisplay([{
      startDate: new Date(),
      endDate: new Date(),
    }])
    setDateRange(null)
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

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "name",
      text: "Product",
    },
    {
      dataField: "supplier.name",
      text: "Supplier",
    },
    {
      dataField: "godown",
      text: "Godown",
    },
    {
      dataField: "company",
      text: "Company",
    },
    {
      dataField: "code",
      text: "Code",
    },
    {
      dataField: "qty",
      text: "Remaining Qty.",
    },
    {
      dataField: "sold_qty",
      text: "Sold Qty.",
    },
  ];

  const columns1 = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "name",
      text: "Product",
    },
    {
      dataField: "supplier.name",
      text: "Supplier",
    },
    {
      dataField: "godown",
      text: "Godown",
    },
    {
      dataField: "company",
      text: "Company",
    },
    {
      dataField: "code",
      text: "Code",
    },
    {
      dataField: "qty",
      text: "Remaining Qty.",
    },
    {
      dataField: "total_qty",
      text: "Total Qty. At Start",
    },
  ];

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div style={{ display: "flex", gap: " 25px", flexDirection: "column", marginBottom: "40px" }}>
        <Alert color="warning" isOpen={visible} toggle={onDismiss.bind(null)}>
          Please Select Dates To get indication for products
        </Alert>
        <Alert color="success" isOpen={visible2} toggle={onDismiss2.bind(null)}>
          Indication dates for HOME page is saved successfully
        </Alert>
        <Alert color="danger" isOpen={visible1} toggle={onDismiss1.bind(null)}>
          An Error Occurred! {error}
        </Alert>

        <Modal isOpen={open} toggle={handleToggle} contentClassName={"pricing-modal"}>
          <ModalHeader toggle={handleToggle}>
            <strong>Select Pricing</strong>
          </ModalHeader>
          <ModalBody style={{ padding: "50px" }}>
            <h1 style={{ fontSize: "24px", color: "black" }}>Select Dates For &ensp; H O M E &ensp; Indications</h1>
            <div style={{ display: "flex", gap: " 25px", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <DateRange
                editableDateInputs={true}
                onChange={item => handleDateChangeModal(item)}
                moveRangeOnFirstSelection={false}
                ranges={dateToDisplayModal}
                maxDate={new Date()}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <Button className={"btn btn-success"} onClick={handleModalClick} disabled={!homeDateRange}>
                Set home indication dates
              </Button>
            </div>
          </ModalFooter>
        </Modal>
        <h1 style={{ fontSize: "24px", color: "black" }}>Please Select Dates To Get &ensp; I N D I C A T I O N &ensp; for Products</h1>
        <div style={{ display: "flex", gap: " 25px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <DateRange
              editableDateInputs={true}
              onChange={item => handleDateChange(item)}
              moveRangeOnFirstSelection={false}
              ranges={dateToDisplay}
              maxDate={new Date()}
            />
          </div>
          <div  >
            {dateRange?.startDate ? <p>Do you want to see indication between these date: <b>{dateRange?.startDate.substring(0, 10)}</b> to <b>{dateRange?.endDate.substring(0, 10)}</b> date?</p> :
              <p>Select dates between you want to get the indication</p>
            }
            < Button outline color='warning' className='me-3' onClick={handleClear} disabled={!dateRange}> Clear Dates</Button>
            <Button outline color="success" onClick={handleClick}>Get Indications</Button>
            <Button outline color='info' className='ms-3' onClick={() => setOpen(true)}>Dates for home Indications</Button>
          </div>
        </div >
      </div >
      {
        response &&
        <>
          <h3 style={{ marginBottom: "15px" }}> The indications for selected Date are:</h3>
          {deadProducts.length ? <Card className="mb-4">
            <CardTitle tag="h5" className="border-bottom p-3">
              <i className="bi bi-boxes me-2"> </i>
              Dead Products(Between {dateRange?.startDate.substring(0, 10)} to {dateRange?.endDate.substring(0, 10)})
            </CardTitle>
            <CardBody>
              <ToolkitProvider keyField={"id"} columns={columns} data={deadProducts}>
                {(props) => (
                  <div className="my-table">
                    <BootstrapTable
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </CardBody>
          </Card> :
            <Card>
              <CardBody>
                There are no dead products between <b>{dateRange?.startDate.substring(0, 10)}</b> to <b>{dateRange?.endDate.substring(0, 10)}</b>
              </CardBody>
            </Card>
          }

          {sellingProducts.length ? <Card className="mb-1">
            <CardTitle tag="h5" className="border-bottom p-3 mb-0">
              <i className="bi bi-boxes me-2"> </i>
              Best Selling Products(Between {dateRange?.startDate.substring(0, 10)} to {dateRange?.endDate.substring(0, 10)})
            </CardTitle>
            <CardBody>
              <ToolkitProvider keyField={"id"} columns={columns} data={sellingProducts}>
                {(props) => (
                  <div className="my-table">
                    <BootstrapTable
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </CardBody>
          </Card> :
            <Card>
              <CardBody>
                There are no hot selling products between <b>{dateRange?.startDate.substring(0, 10)}</b> to <b>{dateRange?.endDate.substring(0, 10)}</b>
              </CardBody>
            </Card>
          }

          {qtyIndicationProducts.length ? <Card className="mb-1">
            <CardTitle tag="h5" className="border-bottom p-3 mb-0">
              <i className="bi bi-boxes me-2"> </i>
              Products with Quantity to be Sold Out(Between {dateRange?.startDate.substring(0, 10)} to {dateRange?.endDate.substring(0, 10)})
            </CardTitle>
            <CardBody>
              <ToolkitProvider keyField={"id"} columns={columns1} data={qtyIndicationProducts}>
                {(props) => (
                  <div className="my-table">
                    <BootstrapTable
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </CardBody>
          </Card> :
            <Card>
              <CardBody>
                There are no products between <b>{dateRange?.startDate.substring(0, 10)}</b> to <b>{dateRange?.endDate.substring(0, 10)}</b> these date whose quantity is going to be end
              </CardBody>
            </Card>
          }
        </>
      }
    </>

  )
}

export default ProductIndication