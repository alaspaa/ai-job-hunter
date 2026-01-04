import { Router } from "express";
import { getJobs, createJob, getJobById, createCoverLetter } from "./controllers/jobController";

const router = Router()

router.get('/', getJobs)

router.get('/:id', getJobById)

router.post('/', createJob)

router.post('/:id/createCoverLetter', createCoverLetter)

export default router