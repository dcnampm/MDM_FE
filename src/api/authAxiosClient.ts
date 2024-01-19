import axios from 'axios';
//auth axios client using keycloak endpoint
const authAxiosClient = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_URL,
});
export default authAxiosClient;