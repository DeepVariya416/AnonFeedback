import OpenAI from 'openai';
import { NextRequest,NextResponse } from 'next/server';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.aimlapi.com",
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        // { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 128,
    });

    const responseMessage = chatCompletion.choices[0].message.content;
    // console.log(responseMessage)
    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}
