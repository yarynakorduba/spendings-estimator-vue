import decodeJWT from "jwt-decode";

export const retrieveUserInfo = (request, result) => {
  const jwt = request.headers.authorization;
  if (!jwt) {
    result.status(403).json({ success: false, error: "You are not authorized to access this info" });
  }
  const { email, _id } = decodeJWT(jwt);
  return { email, _id };
};
