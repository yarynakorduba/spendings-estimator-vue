export const customFetch = async (url, method = "GET", body) => {
  const jwt = localStorage.getItem("jwt");

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers":
        "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    },
    method
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  if (jwt) {
    options.headers.Authorization = `${jwt}`;
  }
  return fetch(`${process.env.VUE_APP_HOST}/${url}`, options)
    .then(x => x.json())
    .then(x => {
      if (x.jwt && x.jwt.length) {
        localStorage.setItem("jwt", x.jwt);
      }
      return x;
    });
};
