import Cookies from "js-cookie";

export const checkToken = () => {
  const token = Cookies.get("token");
  if (token) {
    console.log("Token found in cookies:", token);
  } else {
    console.log("No token found in cookies.");
  }
};
