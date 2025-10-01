export const parseJwt = (token) => {

  const base64Url = token.split('.')[1];

  let decodedBase64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  const padding = decodedBase64.length % 4;
  if (padding) {
    decodedBase64 += '='.repeat(4 - padding);
  }

  const jsonPayload = atob(decodedBase64);

  return JSON.parse(jsonPayload);
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {

      const decodedToken = parseJwt(token);
      return decodedToken.userId;
    }
    catch(error) {
      console.error("Token decoding failed:", error);
    }
  }
  return null;
};

export const getEmailFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {

      const decodedToken = parseJwt(token);
      return decodedToken.email;
    }
    catch(error) {
      console.error("Token decoding failed:", error);
    }
  }
  return null;
};

