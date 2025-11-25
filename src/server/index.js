import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/api/jamai", async (req, res) => {

  try {
    const response = await fetch(
      `https://api.jamaibase.com/api/v2/projects?project_id=${process.env.JAMAI_PROJECT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JAMAI_API_PAT}`,
          accept: "application/json",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("JamAI error:", err);
    res.status(500).json({ error: "Failed to fetch JamAI data" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
