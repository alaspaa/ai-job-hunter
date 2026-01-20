import  Job  from "../models/job";
import { datasource } from "../../datasource/datasource";


export default interface JobRepository {

    getAllJobs(): Promise<Job[]>;

    getJobById(id: number): Promise<Job | null>;

    createJob(job: Job): Promise<Job>;

    updateJob(id: number, job: Partial<Job>): Promise<Job | null>;

    deleteJob(id: number): Promise<boolean>;

    urlExists(url: string): Promise<boolean>;

    updateJobCoverLetter(id: number, coverLetter: string): Promise<Job>;
}

class JobRepositoryImplementation implements JobRepository {
    private allColumns: string = `
    id, 
    title, 
    url, 
    description, 
    status, 
    company,
    application_deadline as applicationdeadline,
    job_listing as joblisting,
    location,
    cover_letter as coverletter,
    created_at, 
    updated_at`

    async getAllJobs(): Promise<Job[]> {
        const result = await datasource.manyOrNone(
            `SELECT 
                ${this.allColumns}
            FROM 
                jobs`
        );
        return result as Job[] ?? [];
    }

    async getJobById(id: number): Promise<Job | null> {
        const result = await datasource.oneOrNone
        (`SELECT 
            ${this.allColumns}
        FROM 
            jobs 
        WHERE 
            id = $1 LIMIT 1`
            , [id]);
        return result;
    }           
    async createJob(job: Job): Promise<Job> {  
        const result = await datasource.one(
            `INSERT INTO jobs (company, title, location, url, job_listing, status, application_deadline) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING ${this.allColumns}`, 
            [job.company, job.jobtitle, job.location, job.url, job.joblisting, job.status, job.applicationdeadline]
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
    
    async updateJobCoverLetter(id: number, coverLetter: string): Promise<Job> {
        return await datasource.one(`UPDATE jobs SET cover_letter = $1, updated_at = NOW() WHERE id = $2 ${this.allColumns} *`, [coverLetter, id]);
    }
}

export { JobRepositoryImplementation, JobRepository };