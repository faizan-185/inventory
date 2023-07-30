import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllSuppliers () {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}supplier/showAll`,
    {headers: {"token": token}})
  return response;
}

export async function createSupplier (name, category, reference, phone, address) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}supplier/create`,
    {name: name, category: category, reference: reference, phone: phone, address: address},
    {headers: {"token": token}})
  return response;
}

export async function updateSupplier (id, name, category, reference, phone, address) {
  const prompt = {name, category, reference, phone, address};
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}supplier/update/${id}`,
    {prompt},
    {headers: {"token": token}})
  return response;
}

export async function deleteSuppliers (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}supplier/delete`,
    {headers: {"token": token}, data: {ids}});
  console.log(response);
  return response;
}
