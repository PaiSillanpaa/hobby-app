import { getEmailFromToken, getUserIdFromToken } from "./Token";

export const fetchUserId = async () => {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include", // tärkeää! jotta HttpOnly-cookie menee mukana
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    return data.user.id; // Oletetaan että backend palauttaa { userId: "abc123" }
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    const userIdFromToken = getUserIdFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty

    if (!userIdFromToken) {
      alert("Et ole kirjautunut sisään.");
    }
    
    return userIdFromToken || null; // Palautetaan null, jos ei löydy
  }
};

export const fetchUserEmail = async () => {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Käyttäjän tunnistus epäonnistui");

    const data = await response.json();
    return data.user.email;
  } catch (err) {
    console.error("Virhe käyttäjätiedon haussa:", err);
    const userEmailFromToken = getEmailFromToken(); // Tämän haun voi poistaa, kun backend on yhdistetty

    if (!userEmailFromToken) {
      alert("Et ole kirjautunut sisään.");
    }
    
    return userEmailFromToken || null;
  }
};
