import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:30360',
  FrontendBaseURL: 'http://localhost:3000'

});

export default instance;
