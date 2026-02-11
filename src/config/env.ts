const NODE = import.meta.env.NODE
const VITE_BACKEND_URL = NODE === "production" ? import.meta.env.VITE_PROD_BACKEND_URL : import.meta.env.VITE_DEV_BACKEND_URL

export { VITE_BACKEND_URL, NODE }  