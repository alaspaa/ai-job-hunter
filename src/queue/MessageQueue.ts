import { Queue, Worker } from "bullmq";
import { createJobFromlistingAddress } from "../jobs/controllers/jobController";

const QUEUE_CREATEJOBLISTING: string = "CreateJobListing"

const LISTING: string = "listing"

export interface createListing {
    url: string,
    website: string | null,
}

const connection = {
        host: '127.0.0.5',
        port: 6379
    }

const createJobListingQueueProducer = new Queue(QUEUE_CREATEJOBLISTING, {
    connection: connection
})

export const addJobListingToQueue = (data: createListing): Promise<any> => {
    return createJobListingQueueProducer.add(LISTING, data);
}

const myWorker = new Worker(QUEUE_CREATEJOBLISTING, async job =>{
    //console.log(job)
    createJobFromlistingAddress(job.data)
    // TODO: Add error handling
}, {
    connection: connection
})