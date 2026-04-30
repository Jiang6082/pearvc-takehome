import "dotenv/config";
import cron from "node-cron";
import { app } from "./app.js";
import { runMockIngestion } from "./services/mockIngestion.service.js";

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`Founder Watchlist API running on http://localhost:${port}`);
});

if (process.env.ENABLE_MOCK_CRON === "true") {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const created = await runMockIngestion();
      console.log(`Mock ingestion created ${created.length} update(s).`);
    } catch (error) {
      console.error("Mock ingestion failed", error);
    }
  });
}
