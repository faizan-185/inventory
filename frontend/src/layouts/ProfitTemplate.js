import React from "react";
import '../assets/css/pdf.css';

const ProfitTemplate = ({ data }) => {
  const date = new Date()

  const formatDate = (date, top = false) => {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1)?.padStart(2, '0');
    const day = String(date?.getDate())?.padStart(2, '0');

    if (top) {
      return `${day}-${month}-${year}`
    }

    return `${day}/${month}/${year}`;
  }

  return (
    <div >
      <div className='bill'>

        <div className="bill-header">
          <div>
            &ensp; P R O F I T &ensp;  C A L C U L A T I O N
            <div style={{ fontSize: "14px" }}>
              (from {formatDate(new Date(data?.date?.startDate), true)} to {formatDate(new Date(data?.date?.endDate), true)})
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {formatDate(date)}&ensp;
          </div>
        </div>

        <div className="display-flex-row">
          <h1 className="company-name">TAWAKKAL PLAI</h1>
        </div>

        <div className="dash"></div>

        <div className="header">
          <div className="display-flex-column" style={{ marginTop: '1rem' }}>
            <div>
              <p className="custom-p">
                <b>Date Range:</b>&ensp;
                {formatDate(new Date(data?.date?.startDate), true)} to {formatDate(new Date(data?.date?.endDate), true)}
              </p>
            </div>
            <div>
              <p className="custom-p">
                <b>Profit:</b>&ensp;
                {data?.totalProfit}
              </p>
            </div>
          </div>
          <div className="gross-balance-top">
            <b>Total Profit:</b> &ensp;
            <b>{data?.totalProfit} Rs.</b>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="table-header-cells">#</th>
              <th className="table-header-cells">Gate Pass No.</th>
              <th className="table-header-cells">Type</th>
              <th className="table-header-cells">Total Sale(revenue)</th>
              <th className="table-header-cells">Total Expense(cost, delivery etc)</th>
              <th className="table-header-cells">Profit</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.pricings?.map((pricing, i) => (
                <tr key={i}>
                  <td className="table-body-cells table-cells-center">{i + 1}</td>
                  <td className="table-body-cells">{pricing?.gatepass_no}</td>
                  <td className="table-body-cells table-cells-center">{pricing.type}</td>
                  <td className="table-body-cells table-cells-center">{pricing?.total_price} Rs.</td>
                  <td className="table-body-cells table-cells-center">{pricing?.total_expense} Rs</td>
                  <td className="table-body-cells table-cells-center">{pricing.profit} Rs.</td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div className="display-flex-row rates" style={{ width: '210px' }}>
            <div className="display-flex-column">
              <b className="custom-p">Total Sale: </b>
              <b className="custom-p">Total Expenses: </b>
              <div style={{ width: "100%", borderBottom: "1px solid grey" }}></div>
              <b className="custom-p">Total Profit: </b>
            </div>
            <div className="display-flex-column">
              <p className="custom-p">{data?.detail?.totalSale} Rs.</p>
              <p className="custom-p">{data?.detail?.totalExpense} Rs.</p>
              <div style={{ width: "100%", borderBottom: "1px solid grey" }}></div>
              <p className="custom-p">{data?.totalProfit} Rs.</p>
            </div>
          </div>
        </div>

        {/*<div style={termsStyle}>*/}
        {/*  <h4>Terms & Conditions</h4>*/}
        {/*  <ul>*/}
        {/*    <li>Bullet text 1</li> */}
        {/*    <li>Bullet text 2</li>*/}
        {/*    <li>Bullet text 3</li>*/}
        {/*  </ul>*/}
        {/*</div> */}
      </div>
    </div>
  );
};

export default ProfitTemplate;
