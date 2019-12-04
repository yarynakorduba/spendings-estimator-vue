export const customFetch = async (url, method = "GET", body) => {
  const jwt = localStorage.getItem("jwtToken")

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers":
        "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    },
    method
  }

  if (body) {
    options.body = JSON.stringify(body)
  }
  if (jwt) {
    options.headers.Authorization = `${jwt}`
  }

  return await fetch(`http://localhost:4000/${url}`, options).then(x => x.json())
}
