import axios from "axios";
const token = localStorage.getItem("token");

export async function GeneratePDF (data) {
  try {
    const response = await axios.post(`${process.env.REACT_APP_PDF_API_URL}`,
      data,
      {headers: {"content-type": "application/json"}, responseType: 'blob'}
    )
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function createInvoice(data)  {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}pricing/invoice`,
      {data},
      {headers: {"token": token}, responseType: 'blob'}
    )
    return response;
  } catch (err) {

  }
}