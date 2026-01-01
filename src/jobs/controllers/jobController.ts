import { NextFunction, Request, Response } from "express"
import Job from "../models/job"
import JobRepository, { JobRepositoryImplementation } from "../repository/jobRepository"
import { queryAIForJobDetails } from "../../ai/aiservice";
import extractTextFromUrl from "../../scraper/textExtractor";// TODO: rename this file

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

        const listingText = await extractTextFromUrl(
            url,
            website,
        );

        //extract text from joblisting using AI
        const processedText = await queryAIForJobDetails(listingText);
        
        let job = JSON.parse(processedText) as Job;
        job.url = req.body.url;
        job.status = 'interested';

        const newJob = await repo.createJob(job);
        res.status(201).json(newJob);
    } catch(error) {
        next(error)
    }
}