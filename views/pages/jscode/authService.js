// auth.js

const auth = {
    // Function to set the token in localStorage
    setToken: (token) => {
      localStorage.setItem('token', token);
    },
  
    // Function to get the token from localStorage
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    // Function to make authenticated requests
    fetchWithAuthentication: async (url, options = {}) => {
      const token = auth.getToken();
  
      if (token) {
        // Add the token to the request headers
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
  
      // Make the fetch request
      return fetch(url, options);
    },
  };
  
  // Make the auth object globally accessible
  window.auth = auth;
  