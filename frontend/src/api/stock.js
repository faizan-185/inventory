import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllProducts () {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}product/showAll`,
      {headers: {"token": token}})
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function createProduct (name, supplier_id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}product/create`,
    {name, supplier_id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost},
    {headers: {"token": token}})
  return response;
}

export async function updateProduct (id, name, supplier_id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost) {
  const prompt = {name, supplier_id, godown, company, thickness, size, code, qty, price, deliveryCost, additionalCost};
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}product/update/${id}`,
    {prompt},
    {headers: {"token": token}})
  return response;
}

export async function deleteProducts (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}product/delete`,
    {headers: {"token": token}, data: {ids}});
  console.log(response);
  return response;
}
