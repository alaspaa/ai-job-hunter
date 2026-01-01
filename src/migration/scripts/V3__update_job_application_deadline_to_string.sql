ALTER TABLE jobs 
DROP COLUMN application_deadline;

ALTER TABLE jobs
ADD COLUMN application_deadline TEXT;