import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function optimizeResume(data: {
  resume: string;
  jobDescription: string;
}) {
  try {
    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an enterprise ATS resume optimization AI."
          },
          {
            role: "user",
            content: `
Resume:
${data.resume}

Job Description:
${data.jobDescription}

Return:
1. ATS Score
2. Missing Skills
3. Improved Resume Points
4. Suggestions
`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return {
      error: true,
      message: "Resume optimization failed"
    };
  }
}
