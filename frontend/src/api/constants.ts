const API_ROOT = "http://localhost:8000/api/v1";

export const loginURL = `${API_ROOT}/users/create-session`;
export const signupURL = `${API_ROOT}/users/signup`;
export const createJobURL = `${API_ROOT}/users/createjob`;

export const ToastStyle = {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  };