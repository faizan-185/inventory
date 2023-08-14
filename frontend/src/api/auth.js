import axios from "axios";

export async function adminLogin (password) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}authentication/login`,
      {name: "Admin", password: password})
    return response;
  } catch (error) {
    return error;
  }
}

export async function workerLogin (password) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}authentication/login`,
    {name: "Worker", password: password})
  return response;
}