import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db/index.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config({
    path: './env'
});

const app = express();

// ✅ CORS enable karo
app.use(cors({
    origin: "http://localhost:4200", // Angular ka frontend
    credentials: true
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Routes mount
app.use("/api/v1/users", userRoutes);

connectdb()
.then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`🚀 Server is running on port ${process.env.PORT || 4000}`);
    });
})
.catch((err) => {
    console.log(`❌ DB Connection Error: ${err.message}`);
});
