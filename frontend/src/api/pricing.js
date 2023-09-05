import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllPricings () {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}pricing/showAll`,
      {headers: {"token": token}})
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function createPricing (pricing) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}pricing/create`,
    pricing,
    {headers: {"token": token}})
  return response;
}

export async function getPricing (id) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}pricing/show/${id}`,
      {headers: {"token": token}})
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function updatePricing (id, pricing) {
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}pricing/update/${id}`,
    {pricing},
    {headers: {"token": token}})
  return response;
}

export async function deletePricings (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}pricing/delete`,
    {headers: {"token": token}, data: {ids}});
  return response;
}
