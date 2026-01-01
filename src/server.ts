import app from './app';
import config from './config/config';
import { migrate } from './migration/migrate';


migrate().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});