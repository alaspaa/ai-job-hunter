import  Job  from "../models/job";
import { datasource } from "../../datasource/datasource";


export default interface JobRepository {

    getAllJobs(): Promise<Job[]>;

    getJobById(id: number): Promise<Job | null>;

    createJob(job: Job): Promise<Job>;

    updateJob(id: number, job: Partial<Job>): Promise<Job | null>;

    deleteJob(id: number): Promise<boolean>;

    urlExists(url: string): Promise<boolean>;
}

class JobRepositoryImplementation implements JobRepository {

    async getAllJobs(): Promise<Job[]> {
        const result = await datasource.many('SELECT * FROM jobs');
        return result as Job[];
    }

    async getJobById(id: number): Promise<Job | null> {
        const result = await datasource.one('SELECT * FROM jobs WHERE id = $1 LIMIT 1', [id]);
        return result;
    }           
    async createJob(job: Job): Promise<Job> {  
        const result = await datasource.one(
            `INSERT INTO jobs (company, title, location, url, job_listing, status, application_deadline) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`, 
            [job.company, job.jobTitle, job.location, job.url, job.jobListing, job.status, job.applicationDeadline]
        );
        return result;
    }

    async updateJob(id: number, job: Partial<Job>): Promise<Job | null> {
        return null; // Placeholder implementation
    }

    async deleteJob(id: number): Promise<boolean> {
        return false; // Placeholder implementation
    }   

    async urlExists(url: string): Promise<boolean> {
        const result = await datasource.oneOrNone('SELECT 1 FROM jobs WHERE url = $1 LIMIT 1', [url]);
        return result !== null;
    }
}

export { JobRepositoryImplementation, JobRepository };