import jwtDecode from "jwt-decode";

export default function currentUser() {
    // Get the token from localStorage
    const authToken = localStorage.getItem("auth-token");

    // If there is no token, return null
    if (!authToken) {
        return null;
    }

    // Decode the token and return the user
    const userData = jwtDecode(authToken);

    return {
        userData,
        token: authToken
    };
}