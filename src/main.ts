import { app } from './config/app';
import { dataSource } from './config/db';

dataSource
	.initialize()
	.then(async () => {
		console.log('Database connection has been initialized');
	})
	.catch((err) => {
		console.error('Error connection: ', err);
	});

app.listen(app.get('port'), () => {
	console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
	console.log('Press CTRL-C to stop');
});
