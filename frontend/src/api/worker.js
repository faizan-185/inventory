import axios from "axios";

const token = localStorage.getItem("token");

export async function getAllWorkers () {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}worker/showAll`,
    {headers: {"token": token}})
  return response;
}

export async function createWorker (formData) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}worker/create`,
    formData,
    {headers: {"token": token, 'Content-Type': 'multipart/form-data'}})
  return response;
}

export async function updateWorker (id, formData) {
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}worker/update/${id}`,
    formData,
    {headers: {"token": token, 'Content-Type': 'multipart/form-data'}})
  return response;
}

export async function deleteWorkers (ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}worker/delete`,
    {headers: {"token": token}, data: {ids}});
  return response;
}
