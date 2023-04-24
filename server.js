const app = require("./app"); //importing app file to the server file

const port = 3000;
// starting the server
const server = app.listen(port, () => {
  console.log(`App running in port ${port}...`);
});
