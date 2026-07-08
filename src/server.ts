import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

createApp().listen(port, () => {
  console.log(`NoveLAI backend listening on port ${port}`);
});
