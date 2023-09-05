import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllCustomers () {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}customer/showAll`,
      {headers: {"token": token}})
    return response;
  }
  catch (err) {
    return Promise.reject(err);
  }
}

export async function createCustomer (name, category, reference, phone, address) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}customer/create`,
    {name: name, category: category, reference: reference, phone: phone, address: address},
    {headers: {"token": token}})
  return response;
}

export async function updateCustomer (id, name, category, reference, phone, address) {
  const prompt = {name, category, reference, phone, address};
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}customer/update/${id}`,
    {prompt},
    {headers: {"token": token}})
  return response;
}

export async function deleteCustomers (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}customer/delete`,
    {headers: {"token": token}, data: {ids}});
  console.log(response);
  return response;
}
