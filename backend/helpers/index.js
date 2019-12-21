import decodeJWT from "jwt-decode"

export const retrieveUserInfo = (request, result) => {
  const jwt = request.headers.authorization
  const { email, _id } = decodeJWT(jwt)
  if (!jwt) {
    result.status(403).json({ success: false, error: "You are not authorized to access this info" })
  }
  return { email, _id }
}
