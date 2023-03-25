// const dotenv = require('dotenv')
// dotenv.config()
// export const BACKEND_URL = "http://localhost:8000"
// export const BACKEND_URL = "http://192.168.0.7:8000"
// export const BACKEND_URL = "http://10.2.1.165:8000"
// export const BACKEND_URL = "http://192.168.68.181:8000"
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
console.log(process.env.REACT_APP_BACKEND_URL
    )