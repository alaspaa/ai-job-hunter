
import config from "../config/config";
import OpenAI from "openai";

const openai = new OpenAI({
      apiKey: config.aiApiKey,
});

let context = [
  { role: "role", content: "What is the capital of France?" }
];

//
export async function queryAIForJobDetails(listingText: string): Promise<string> {
  if(!listingText || listingText.length === 0) {
        throw new Error("Listing text is empty");
  }

  console.info("Sending raw data to AI for handling")
  
  const response = await openai.responses.create({
      instructions: `Using the input text please extract the job listing information and reply with the information partaining to the job listing according to the following json schema
      {
        \"company\": \"string\",
        \"jobTitle\": \"string\",
        \"location\": \"string\",
        \"applicationDeadline\": \"string\",
        \"jobListing\": \"string\",
      }
      `,
      input:  listingText,
      temperature: 0.5,
      model: "gpt-5-nano",
    },
  );

  console.log("AI Response:", response.output_text);
  return response.output_text
}

export async function queryAIForCoverLetter(
  jobListing: string,
  cv: string,
): Promise<string> {
  if(!jobListing || !cv) {
    throw new Error("job listing and resume must be provided in order to create cover letter")
  }
  // get try to get cv from disk
  // extract cv text
  // use cv text as part of the instruction set for AI
  // Ask for cover letter for the job listing provided as the input
  // ask to keep formatting in the reponse text

  
      const response = await openai.responses.create({
      instructions: `Using the job listing and the user's resume, generate a professional cover letter. The cover letter should be tailored to the job and highlight relevant experience from the resume. Keep the formatting simple and professional.`,
      input: `Job Listing: ${jobListing}\n\nUser Resume: ${cv}`,
      //temperature: 0.7,
      model: "gpt-5-nano",
    },
  );

  console.log("AI Cover Letter Response:", response.output_text);
  return response.output_text
  
}