import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// ✅ Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: 'https://next-step-lyart.vercel.app',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// app.options('*', cors());
app.use(cookieParser());

// Routers
import userRouter from './routes/user.routes.js';
import recruiterRouter from './routes/recruiter.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/recruiters", recruiterRouter);

export { app };
