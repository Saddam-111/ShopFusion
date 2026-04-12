import app from "./app.js"
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
configDotenv()

const PORT = process.env.PORT || 3000;


connectDB()


app.get('/', (req, res) => {
  res.status(200).json({
    message: "Working!"
  })
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});