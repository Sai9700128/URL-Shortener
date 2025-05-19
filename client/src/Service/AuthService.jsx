import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    login(username, password) {
        return axios
            .post(AUTH_API_URL + 'login', { username, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify({
                        username: response.data.username,
                        email: response.data.email
                    }));
                }
                return response.data;
            });
    }

    logout() {
        const token = localStorage.getItem('token');

        // If token exists, call the backend logout endpoint
        if (token) {
            console.log("Calling logout API endpoint");
            // Return the promise from axios for proper chaining
            return axios.post(AUTH_API_URL + 'logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log("Logout API response:", response.data);
                    // Clear localStorage regardless of the API response
                    this.clearLocalStorage();
                    return response.data;
                })
                .catch(error => {
                    console.error("Logout API error:", error);
                    // Clear localStorage even if the API call fails
                    this.clearLocalStorage();
                    // Re-throw the error to be handled by the caller
                    throw error;
                });
        } else {
            // If no token exists, just clear localStorage
            console.log("No token found, clearing local storage only");
            this.clearLocalStorage();
            // Return a resolved promise for consistent behavior
            return Promise.resolve("No active session");
        }
    }

    // Helper method to clear localStorage
    clearLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    register(username, email, password) {
        return axios.post(AUTH_API_URL + 'register', {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            this.clearLocalStorage();
            return null;
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return Promise.reject("No refresh token available");

        return axios.post(AUTH_API_URL + 'refresh-token', refreshToken, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
                return response.data;
            });
    }

    // Setup axios interceptor for token refresh
    setupAxiosInterceptors() {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If error is 401 and not already retrying
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Try to refresh the token
                        const response = await this.refreshToken();

                        // Update the authorization header
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
                        originalRequest.headers['Authorization'] = 'Bearer ' + response.token;

                        // Retry the original request
                        return axios(originalRequest);
                    } catch (refreshError) {
                        // If refresh fails, logout
                        this.clearLocalStorage();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}

export default new AuthService();