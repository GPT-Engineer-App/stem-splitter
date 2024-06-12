const path = require("path");

module.exports = (req, res) => {
  const filePath = req.query.file;
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send("File not found.");
    }
  });
};
