

# JOB HUNTER

An AI assisted job hunter that helps me apply for new positions.
There are three major things that this application does

1. Helps me keep a log of where I have applied to. In case the application is slow or the volume is high, listings are saved and statuses can be updated as processes move forward or end.

2. Assists me in generating cover letters with the help of AI in case one is required for a specific listing

3. Keeps me sharp. I've noticed that a node and typescript have become very popular and seem to have a lot of opportuinities open. This is mainly my attempt at getting more into the typescript of it all. 


### Next steps

- Implement job listing status updates
- Add authentication
- Add testing framework
- Fix linter and/or prettier
- Maybe refactor in order to use a different more automatic datasource that is capable of translating between db column names and javascript field names


AI:
In odrder to generate cover letters and sort data this project uses the gpt-5-nano model.
The requests to AI are very slow so patience is key.


## Environment variables
This is a list of environm,ent variable that are reqwuired to run the application

- PORT: number
- NODE_ENV: dev
- CONNECTION_STRING: postgres://username:password@localhost:5432/database
- AI_API_KEY: open ai platform key