import axios from 'axios';
import logger from '../middleware/logger.js'; // We'll create this next

class HttpClient {
    constructor(baseURL, headers = {}) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                logger.error(`API Call Failed: ${error.message} - URL: ${error.config?.url}`);
                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data, config = {}) {
        return this.client.post(url, data, config);
    }

    async put(url, data, config = {}) {
        return this.client.put(url, data, config);
    }

    async delete(url, config = {}) {
        return this.client.delete(url, config);
    }
}

export default HttpClient;
