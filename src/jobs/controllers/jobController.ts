import { NextFunction, Request, Response } from "express"
import Job, { fromJobListingSchema } from "../models/job"
import JobRepository, { JobRepositoryImplementation } from "../repository/jobRepository"
import { queryAIForJobDetails, queryAIForCoverLetter, JobListingSchema } from "../../ai/aiservice";
import { getCVAsText } from "../../cv/cvController"
import extractTextFromUrl from "../../scraper/textExtractor";// TODO: rename this file
import { addJobListingToQueue, createListing } from "../../queue/MessageQueue";
import { jobSocket } from "../../app";

const repo: JobRepository = new JobRepositoryImplementation();

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Fetching all jobs");
    try {
        const jobs = await repo.getAllJobs();
        res.status(200).json(jobs);
    } catch(error) {
        next(error)
    }
} 

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const job = await repo.getJobById(id);
        if (job) {
            res.status(200).json(job);
        } else {
            res.status(404).send('Job not found');
        }
    } catch(error) {
        next(error)
    }
}   

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = req.body.url;
        const website = req.body.website;

        if (!url) {
            return res.status(400).send('Invalid job data: URL is required');
        }

        if(await repo.urlExists(url)) {
            return res.status(409).send('Job with the same URL already exists');
        }

        addJobListingToQueue({
            url: url,
            website: website
        })

        return res.status(202).json({"status": "accepted"})
    } catch(error) {
        next(error)
    }
}

export const createJobFromlistingAddress = async (listing: createListing) => {
    try {
        console.info(`Creating new job for ${listing.url}`)

        const listingText = await extractTextFromUrl(listing)
        
        const aiResponse: JobListingSchema = await queryAIForJobDetails(listingText)

        const newJob = await repo.createJob(
            fromJobListingSchema(aiResponse, listing.url)
        ) 

        jobSocket.emitJobUpdate(newJob)
    } catch(error) {
        console.error(error)
        throw error
    }
}

export const createCoverLetter = async (req: Request, res: Response, next: NextFunction) => {
    console.info(`creating cover letter`)
    const jobId = Number(req.params.id)
    if(isNaN(jobId)) {
        return res.status(400).json({error: `${req.params.id} cannot be cast to number`})
    }
    
    const cvName = req.body.cvName
    if(!cvName) {
        return res.status(400).json({error: "cvName cannot be null"})
    }
    try {
        console.info("geting job info")
        const job: Job | null = await repo.getJobById(jobId)
        if(!job) {
            return res.status(404).json({error: `Could not find job with the id ${jobId}`})
        }
        if(job.coverletter) {
            return res.status(400).json({error: `Job with the id ${jobId} already has a cover letter`})
        }
        if(!job.joblisting) {
            console.info(job)
            return res.status(400).json({error: `Could not find job listing for job with the id ${jobId}`})
        }


        console.info("getting cv text")
        const cv = await getCVAsText(cvName)

        const coverLetter = await queryAIForCoverLetter(job.joblisting, cv)

        // save cover letter to db
        const updatedJob = await repo.updateJobCoverLetter(
            jobId,
            coverLetter,
        )

        return res.status(200).json(updatedJob)
    } catch(error) {
        console.error(error)
        next(error)
    }
    
}