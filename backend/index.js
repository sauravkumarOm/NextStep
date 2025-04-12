import dotenv from "dotenv";
import connectDB from "./db/main.js";
import { app } from "./app.js";

dotenv.config();

app.get("/", (req, res) => {
    res.send("Hello World");
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`MongoDB connection failed: ${err}`);
    });
