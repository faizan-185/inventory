import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllSuppliers () {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}supplier/showAll`,
    {headers: {"token": `Bearer ${token}`}})
  return response;
}

export async function createSupplier (name, category, company, phone, address) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}supplier/create`,
    {name: name, category: category, company: company, phone: phone, address: address},
    {headers: {"token": `Bearer ${token}`}})
  return response;
}

export async function updateSupplier (id, name, category, company, phone, address) {
  const prompt = {name, category, company, phone, address};
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}supplier/update/${id}`,
    {prompt},
    {headers: {"token": `Bearer ${token}`}})
  return response;
}

export async function deleteSuppliers (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}supplier/delete`,
    {headers: {"token": `Bearer ${token}`}, data: {ids}});
  console.log(response);
  return response;
}
