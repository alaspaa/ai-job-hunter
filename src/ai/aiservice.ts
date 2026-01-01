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
  //Temp to 1
  if(!listingText || listingText.length === 0) {
        throw new Error("Listing text is empty");
  }
  
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
      model: "gpt-5-nano",
      //temperature: 0.8
    },
  );

  console.log("AI Response:", response.output_text);
  return response.output_text
}