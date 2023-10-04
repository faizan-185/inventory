import React from "react";
import '../assets/css/pdf.css';

const Template = ({ data }) => {

  return (
    <div >
      <div className='bill'>

        <div className="bill-header">
          <div>
            &ensp;I N V O I C E ({data?.name})&ensp; # {data?.id}
          </div>
          <div>
            {data?.date}&ensp;
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
                <b>Customer:</b>&ensp;
                {data?.customer_name}
              </p>
            </div>
            <div>
              <p className="custom-p">
                <b>Reference No:</b>&ensp;
                {data?.reference}
              </p>
            </div>
            {
              data.name === "RETURN" && (<div>
                <p className="custom-p">
                  <b>Previous Pricing No:</b>&ensp;
                  {data?.Previous_Pricing}
                </p>
              </div>)
            }
          </div>
          <div className="gross-balance-top">
            <b>Total Paid:</b> &ensp;
            <b>{data?.gross_total} Rs.</b>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="table-header-cells" style={{ width: "50px" }}>#</th>
              <th className="table-header-cells">Name</th>
              <th className="table-header-cells" style={{ width: "100px" }}>Unit Price</th>
              <th className="table-header-cells" style={{ width: "60px" }}>Qty.</th>
              <th className="table-header-cells" style={{ width: "120px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.products?.map((item, i) => (
                <tr key={i}>
                  <td className="table-body-cells table-cells-center">{i + 1}</td>
                  <td className="table-body-cells">{item.product.name}</td>
                  <td className="table-body-cells table-cells-center">{item.unit_price} Rs.</td>
                  <td className="table-body-cells table-cells-center">{item.qty}</td>
                  <td className="table-body-cells table-cells-center">{item.total} Rs.</td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div className="display-flex-row rates" style={{ width: '210px' }}>
            <div className="display-flex-column">
              <b className="custom-p">Net Total: </b>
              <b className="custom-p">Discount: </b>
              <b className="custom-p">Tax: </b>
              <b className="custom-p">Gross Total:</b>
            </div>
            <div className="display-flex-column">
              <p className="custom-p">{data?.net_total} Rs.</p>
              <p className="custom-p">{data?.discount} Rs.</p>
              <p className="custom-p">{data?.tax} Rs.</p>
              <p className="custom-p">{data?.gross_total} Rs.</p>
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

export default Template;
