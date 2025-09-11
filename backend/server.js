import app from "./app.js"
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
configDotenv()

const PORT = process.env.PORT;


//database connecting
connectDB()


app.get('/', (req , res ) => {
  res.status(200).json({
    message: "Working!"
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on  ${PORT}`);
})