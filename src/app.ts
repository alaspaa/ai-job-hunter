import express, { Request, Response } from 'express'
import config from './config/config'
import { errorHandler } from './middlewares/errorHandler'
import  { schemaChecker }  from './middlewares/schemaChecker'
import JobRouter from './jobs/jobsRouter'
import CVRouter from './cv/cvRouter'
import cors from 'cors'
import JobSocket from './jobs/ws/JobSocket'

const expressws = require('express-ws')(express())
const app = expressws.app
const port = config.port


// Middlewares
app.use(express.json())

// TODO: Do something about this
app.use(cors())

// TODO: Implement
app.use(schemaChecker);

//Web sockets
export const jobSocket = new JobSocket(expressws)

//Routes
app.use('/api/job', JobRouter)

// Mount CV router
app.use('/api/cv', CVRouter)

// Error handling
app.use(errorHandler);

export default app;