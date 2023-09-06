import React from 'react'

const Template = ({data}) => {
    const billStyle = {
        fontFamily: 'Roboto, sans-serif',
        padding:"2rem",
        
      };
      
      const headerStyle = {
        display:"flex",
        flexDirection:"row",
        textAlign: 'left',
        justifyContent:"space-between",
       
      };
      const childHeaderStyle={
        textAlign:"right",
        textTransform: 'uppercase',
        
      }
      const customerStyle = {
        marginTop: '1rem',
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:"1rem"
      };
      const balanceStyle={
        backgroundColor:"#dedede",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-around",
        paddingLeft:"0.5rem",
        paddingRight:"0.5rem",
        borderRadius:"8px",
        gap:"2rem"
      }
      const tableStyle = {
        marginTop:"1rem",
        width: '100%',
        borderCollapse: 'collapse',
       
      };
      
      const tableHeaderCellStyle = {
        border: '1px solid #000',
        padding: '5px',
        textAlign: 'center',
        backgroundColor:"#cccccc ",
        fontWeight:"600"
      };
      
      const tableCellStyle = {
        border: '1px solid #000',
        padding: '5px',
        textAlign: 'center',
      };
      
      const footerStyle = {
        textAlign: 'right',
        marginTop: '20px',
        fontWeight:"500",
        fontFamily:"Arial"
      };
      
      const termsStyle = {
        marginTop: '20px',
      };
      
	return (
        <div style={{maxWidth:"860px"}}>
        <div style={billStyle}>
        <div style={headerStyle}>
          <div >
          <h1 style={childHeaderStyle}>Tawakkal Plai</h1>
          <p style={{marginTop:"1.5rem",left:"20px"}}><b>Customer:</b> {data?.customer_name?data.customer_name:"Null"}</p>
          </div>
          <div style={childHeaderStyle}>
          <p><b>#{data?.id?data.id:"Null"}</b></p>
          <p><b>Date:</b> {data?.date?data.date:"Null"}</p>
          </div>
        </div>
        <div style={customerStyle}>
          <div style={{display:"flex",gap:"1rem"}}>
          <p><b>Gatepass:</b> {data?.gatepass?data.gatepass:"Null"}</p>
          <p><b>Reference:</b> {data?.reference?data.reference:"Null"}</p>
          </div>
          <div style={balanceStyle}>
            <b>Balance Due:</b>
            <p style={{marginTop:"1rem",fontWeight:"500",fontFamily:"Arial"}}><b>{data?.gross_total?data.gross_total:"Null"} Rs</b></p>
          </div>
          </div>
        <table  style={tableStyle}>
          <thead  >
            <tr>
              <th style={tableHeaderCellStyle}>Sr No</th>
              <th style={tableHeaderCellStyle}>Name</th>
              <th style={tableHeaderCellStyle}>Unit Price</th>
              <th style={tableHeaderCellStyle}>Qty</th>
              <th style={tableHeaderCellStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            {
                data?.products?.map((item,i) => (
                    <tr key={i}>
                    <td style={tableCellStyle}>{i+1}</td>
                    <td style={tableCellStyle}>{item.name}</td>
                    <td style={tableCellStyle}>{item.unit_price} Rs</td>
                    <td style={tableCellStyle}>{item.qty}</td>
                    <td style={tableCellStyle}>{item.total} Rs</td>
                  </tr>
                  ))
            }
           
          </tbody>
        </table>
  
        <div style={footerStyle}>
          <p><b>Net Total: </b> {data?.net_total?data.net_total:"Null"} Rs</p>
          <p><b>Discount: </b>{data?.discount?data.discount:"Null"} Rs</p>
          <p><b>Tax: </b>{data?.tax?data.tax:"Null"} RS</p>
          <p><b>Gross Total:</b> {data?.gross_total?data.gross_total:"Null"} Rs</p>
        </div>
  
        <div style={termsStyle}>
          <h4>Terms & Conditions</h4>
          <ul>
            <li>Bullet text 1</li> 
            <li>Bullet text 2</li>
            <li>Bullet text 3</li>
          </ul>
        </div>
      </div>
    </div>
	);
}

export default Template