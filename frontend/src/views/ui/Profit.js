import { useRef, useState } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Alert, Button, Card, CardBody, CardTitle } from 'reactstrap';
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { getProfitData } from '../../api/pricing';
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "../../layouts/loader/Loader";
import html2pdf from 'html2pdf.js';
import ProfitTemplate from '../../layouts/ProfitTemplate';

const Profit = () => {
  const [visible, setVisible] = useState(false)
  const [dateRange, setDateRange] = useState(null);
  const [pricings, setPricings] = useState([])
  const [totalProfit, setTotalProfit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState({})
  const [printingProfit, setPrintingProfit] = useState(null);
  const reportTemplateRef = useRef(null);
  const [detail, setDetail] = useState({})
  const [dateToDisplay, setDateToDisplay] = useState([{
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

  const handleClick = () => {
    if (!dateRange) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);
      return
    }
    setLoading(true)
    getProfitData(dateRange).then(res => {
      setPricings(res.data.format_response)
      setTotalProfit(res.data.totalProfit)
      setDate(res.data.date)
      const expenseDetail = { totalExpense: res.data.totalExpense, totalSale: res.data.totalRevenue }
      setDetail(expenseDetail)
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

  const columns = [
    {
      dataField: "id",
      text: "Pricing No",
      sort: true,
    },
    {
      dataField: "gatepass_no",
      text: "Gate Pass No.",
    },
    {
      dataField: "type",
      text: "Type",
    },
    {
      dataField: "total_price",
      text: "Total Sale(revenue)",
    },
    {
      dataField: "total_expense",
      text: "Total Expense(cost, delivery etc)",
    },
    {
      dataField: "profit",
      text: "Profit",
    },
  ];

  const printProfit = async () => {
    const data = {
      name: "P R O F I T   C A L C U L A T I O N ",
      pricings: pricings,
      date: date,
      totalProfit,
      detail
    }
    setPrintingProfit(data);
    const pdfOptions = {
      filename: 'my-document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'A4', orientation: 'portrait' },
    };

    html2pdf().set(pdfOptions).from(reportTemplateRef.current).to('pdf').save(`profit`);
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div style={{ display: 'none' }}>
        <div ref={reportTemplateRef}>
          {
            printingProfit && (
              <ProfitTemplate data={printingProfit} />
            )
          }
        </div>
      </div>
      <div style={{ display: "flex", gap: " 25px", flexDirection: "column", marginBottom: "40px" }}>
        <Alert color="warning" isOpen={visible} toggle={onDismiss.bind(null)}>
          Please Select Dates To Get the Profit Results
        </Alert>
        <h1 style={{ fontSize: "24px", color: "black" }}>Select Date Range to Calculate Profit</h1>
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
            {dateRange?.startDate ? <p>Are you sure you want to see profits from <b>{dateRange?.startDate.substring(0, 10)}</b> to <b>{dateRange?.endDate.substring(0, 10)}</b> date?</p> :
              <p>Select dates between you want to calculate the profits for revenue</p>
            }
            < Button outline color='warning' style={{ marginRight: "40px" }} onClick={handleClear} disabled={!dateRange}> Clear Dates</Button>
            <Button outline color="success" onClick={handleClick}>Get Profit</Button>
          </div>
        </div >
      </div >
      <div style={{ display: "flex", justifyContent: "end", marginBottom: "30px" }}>
        {pricings.length ? (
          <Button className={""} onClick={printProfit}>Print Profit</Button>
        ) : (
          <></>
        )}
      </div>
      <Card className="mb-1">
        <CardTitle tag="h5" className="border-bottom p-3 mb-0">
          <i className="bi bi-boxes me-2"> </i>
          Pricings
        </CardTitle>
        <CardBody>
          <ToolkitProvider keyField={"id"} columns={columns} data={pricings}>
            {(props) => (
              <div className="my-table">
                <BootstrapTable
                  {...props.baseProps}
                />
              </div>
            )}
          </ToolkitProvider>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}>
            <h4>Total Profit: {totalProfit}</h4>
          </div>
        </CardBody>
      </Card>
    </>

  )
}

export default Profit