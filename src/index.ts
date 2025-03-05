import express from 'express';

import { connectToDb } from '#features/database';
import { errorHandler } from '#app/routes/errorHandler.router';
import catchall from '#app/routes/catchall.router';
import apiRouter from '#app/routes/api/api.router';
import { globalMiddleware, storageMiddleware } from '#app/middleware';
import { uiController } from '#app/controllers/ui/ui.controller';

connectToDb(process.env.MONGO_URI as string);

const app = express();

app.use(globalMiddleware);

app.use('/storage', storageMiddleware);

app.use('/api', apiRouter);

app.get('*any', uiController);

app.use(catchall);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
	console.log(
		`[backend/index] Server is listening on port: ${process.env.PORT || 3000}`
	);
});
