

export default interface Job {
    id: number | null;
    jobTitle?: string | null;
    url: string;
    description?: string;
    status: 'interested' | 'applied' | 'completed' | 'failed';
    applicationDeadline?: Date | null;
    company?: string | null;
    location?: string | null;
    jobListing?: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}
