import app from "./app.js"
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
configDotenv()

const PORT = process.env.PORT || 5000;


//database connecting
connectDB()


app.get('/', (req , res ) => {
  res.status(200).json({
    message: "Working!"
  })
})

app.listen(PORT, () => {
  // Server started
})