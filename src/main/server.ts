import { app } from "./config/app";

const port = 5050;

// eslint-disable-next-line no-console
app.listen(port, () => { console.log(`Server running at port: ${port}`); });
