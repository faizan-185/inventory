import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllPricings(query) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}pricing/showAll?type=${query}`,
      { headers: { "token": token } })
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function createPricing(pricing) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}pricing/create`,
    pricing,
    { headers: { "token": token } })
  return response;
}

export async function createReturnPricing(pricing) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}pricing/return`,
    pricing,
    { headers: { "token": token } })
  return response;
}

export async function getPricing(id, query = null) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}pricing/show/${id}?type=${query}`,
      { headers: { "token": token } })
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function updatePricing(id, pricing) {
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}pricing/update/${id}`,
    { pricing },
    { headers: { "token": token } })
  return response;
}

export async function updateReturnPricing(id, pricing) {
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}pricing/return/update/${id}`,
    { pricing },
    { headers: { "token": token } })
  return response;
}

export async function deletePricings(ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}pricing/delete`,
    { headers: { "token": token }, data: { ids } });
  return response;
}

export async function deleteReturnPricings(ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}pricing/return/delete`,
    { headers: { "token": token }, data: { ids } });
  return response;
}

export async function getProfitData(date) {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}pricing/profit?startDate=${date.startDate}&endDate=${date.endDate}`,
    { headers: { "token": token } });
  return response;
}

export async function getProductIndications(date) {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}product/indication?startDate=${date.startDate}&endDate=${date.endDate}`,
    { headers: { "token": token } });
  return response;
}