import { JobListingSchema } from "../../ai/aiservice.js";

export default interface Job {
    id: number | null;
    jobtitle?: string | null;
    url: string;
    description?: string;
    status: 'interested' | 'applied' | 'completed' | 'failed';
    applicationdeadline?: Date | null;
    company?: string | null;
    location?: string | null;
    joblisting?: string | null;
    coverletter?: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}


export const fromJobListingSchema = (jobListing: JobListingSchema, url: string): Job => { 
    return {
        id: null,
        company: jobListing.company,
        jobtitle: jobListing.jobTitle,
        location: jobListing.location,
        applicationdeadline: new Date(jobListing.applicationDeadline),
        joblisting: jobListing.jobListing,
        status: 'interested',
        url: url,
        created_at: null,
        updated_at: null,
    };
}