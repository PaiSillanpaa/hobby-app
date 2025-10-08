//import { getEmailFromToken, getUsernameFromToken } from "./Token";
//const baseurl = "https://hobbly-app.onrender.com";
export const fetchUserId = async () => {
  try {
    const response = await fetch(`/api/user/info`, {
      method: "GET",
      credentials: "include", // tärkeää! jotta HttpOnly-cookie menee mukana
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    return data.userId; // Oletetaan että backend palauttaa { userId: "abc123" }
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    //const userIdFromToken = getUserIdFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty
    
    return null; // Palautetaan null, jos ei löydy
  }
};

export const fetchUserEmail = async () => {
  try {
    const response = await fetch(`/api/user/info`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    return data.email;
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    //const userEmailFromToken = getEmailFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty
    
    return  null;
  }
};

export const fetchUsername = async () => {
  try {
    const response = await fetch(`/api/user/info`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    console.log("userdata",data)
    return data.username;
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    //const usernameFromToken = getUsernameFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty
    
    return null;
  }
};

export const fetchRank = async () => {
  try {
    const response = await fetch(`/api/user/info`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    return data.rank;
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    //const usernameFromToken = getUsernameFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty
    
    return null;
  }
};


export const deleteCookie = async () => {
  try {
    await fetch(`/api/user/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  } catch(error) {
    console.error("Error when deleting cookie", error)
  }
}
