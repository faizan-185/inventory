import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllProducts () {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}product/showAll`,
      {headers: {"token": `Bearer ${token}`}})
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function filterProducts (prompt) {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}product/filter`,
      {prompt},
      {headers: {"token": `Bearer ${token}`}})
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function createProduct (stocks) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}product/create`,
    {data: stocks},
    {headers: {"token": `Bearer ${token}`}})
  return response;
}

export async function updateProduct (id, name, supplierId, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost) {
  const prompt = {name, supplierId, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost};
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}product/update/${id}`,
    {prompt},
    {headers: {"token": `Bearer ${token}`}})
  return response;
}

export async function deleteProducts (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}product/delete`,
    {headers: {"token": `Bearer ${token}`}, data: {ids}});
  return response;
}
