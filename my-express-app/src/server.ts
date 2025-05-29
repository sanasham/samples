import { createApp } from "./app";
import { config } from "../src/config/env";

const app = createApp();

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
