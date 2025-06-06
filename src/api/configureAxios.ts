'use client'

import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';
export default axios;