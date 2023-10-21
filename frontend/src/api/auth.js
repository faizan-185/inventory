import axios from "axios";


const token = localStorage.getItem("token");

export async function adminLogin(username, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}authentication/login`,
    { username: username, password: password })

  return response;
}

export async function updateHomeIndication(params) {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}authentication/indication_date`, { params },
    { headers: { "token": token } })
  return response;
}

export async function workerLoginRequest(username) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}login/request`,
    { username })
  return response;
}

export async function workerLogin(username, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}authentication/login`,
    { username: username, password: password })
  return response;
}

export async function getAllLogins() {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}login/getAll`,
    { headers: { "token": token } })
  return response;
}

export async function deleteLogins(ids) {
  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}login/delete`,
    { headers: { "token": token }, data: { ids } });
  return response;
}

export async function updateLogin(id, formData) {
  const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}login/update/${id}`,
    { expiration_hours: formData.expiration_hours, expiration_minutes: formData.expiration_minutes, status: formData.status, username: formData.username },
    { headers: { "token": token } })
  return response;
}

export async function checkLogin(id, username) {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}login/check`,
    { id: id, username: username })
  return response;
}
