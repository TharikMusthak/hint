const dotenv = require("dotenv");

const result = dotenv.config();

console.log(result);

const app = require("./app");

console.log("PORT =", process.env.PORT);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Hint Technologies Backend running on port ${PORT}`);
});