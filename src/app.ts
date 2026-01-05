import express from 'express'
import config from './config/config'
import { errorHandler } from './middlewares/errorHandler'
import  { schemaChecker }  from './middlewares/schemaChecker'
import JobRouter from './jobs/jobsRouter'
import CVRouter from './cv/cvRouter'
import cors from 'cors'

const app = express()
const port = config.port
const corsMiddleware = cors()

// TODO: Do something about this
app.use(corsMiddleware)

app.use(express.json())

app.use(schemaChecker);

//Routes
// Add routes using app use and router
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/job', JobRouter)

// Mount CV router
app.use('/api/cv', CVRouter)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;