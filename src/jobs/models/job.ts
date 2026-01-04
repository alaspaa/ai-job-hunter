
@Table
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
