import express from 'express'

const app = express();

const port = 5050;

// eslint-disable-next-line no-console
app.listen(port, () => { console.log(`Server running at port: ${port}`); });
