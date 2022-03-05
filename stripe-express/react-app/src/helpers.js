import { auth } from "./firebase";
// const API = "http://1920-49-37-219-117.ngrok.io";
const API = "http://localhost:2222";

/**
 * A helper function to fetch data fcrom your API.
 * It sets the Firebase auth token on the request.
 */
export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: "POST", body: null, ...opts };

  const user = auth.currentUser;

  const token = user && (await user.getIdToken());
  console.log(endpointURL);

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
