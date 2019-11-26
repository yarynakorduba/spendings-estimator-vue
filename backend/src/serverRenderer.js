const path = require("path")
const fs = require("fs")

//TODO: handle console warnings

export default (req, res) => {
  const filePath = path.resolve("..", "frontend", "build", "index.html")

  fs.readFile(filePath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("err", err)
      return res.status(404).end()
    }

    return res.send(htmlData.replace(`<div id="root"></div>`, `<div id="root">${html}</div>`))
  })
}
