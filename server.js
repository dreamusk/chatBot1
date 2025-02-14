// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;
const router = express.Router();

app.use(cors()); // Use the cors middleware
app.use(express.json());
app.use("/api", router);
// Middleware to parse JSON requests
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!", code: 0 });
});

// Route to handle POST requests
router.route("/predict").post(async (req, res) => {
  const payload = {
    query_metadata: {
      system: "You are a chatbot assistant.",
      query: req.body.message || "what is the capital of france?",
      template_name: "system_query",
    },
    llm_metadata: {
      model: "techhub-pool-world-gpt-4o",
      temperature: 0,
    },
    platform_metadata: {
      platform: "azure",
    },
  };

  const url_webhook = "https://hackathonllm.app.dev.techhubnttdata.com";
  const api_key = "3c718f38f97e4817a5d9217543bd6330";

  try {
    const response = await axios.post(`${url_webhook}/llm/predict`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
    });

    // Pass through the response as is
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      status: "error",
      status_code: 500,
      result: {
        answer: "An error occurred while processing your request.",
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
