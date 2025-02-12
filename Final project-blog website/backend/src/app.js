/**
 * This program shows how we can use Express Routers to break up our route handlers into multiple, well-organized files.
 */

// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path"; // ✅ 新增，处理文件路径
import bodyParser from "body-parser";


// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

//调整文章图片上传大小

app.use(bodyParser.json({ limit: '10mb' }));  // 可以根据需要调整大小
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Configure middleware (logging, CORS support, JSON parsing support, static files support)
app.use(morgan("combined"));

// For CORS, since we're using cookies with fetch(), we have to allow credentials and give an explicit list of allowed origins.
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Import and use our application routes.
import routes from "./routes/routes.js";
app.use("/", routes);

// ✅ 让 "/uploads" 目录下的图片可以通过 URL 访问
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Make sure DB is created and opened.
import { getDatabase } from "./db/database.js";
await getDatabase();

// Start the server running.
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
