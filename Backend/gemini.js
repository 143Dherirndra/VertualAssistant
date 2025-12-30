import axios from "axios";

const geminiRespose = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing");
    }

    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.

Respond ONLY with VALID JSON.
No markdown. No explanation.

{
  "type": "general | google_search | youtube_search | youtube_play | calculator_open | instagram_open | facebook_open | weather_show | get_time | get_date | get_day | get_month",
  "userInput": "clean user input",
  "response": "short spoken response"
}

User input: ${command}
`;

    const res = await axios.post(
      apiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey // ✅ VERY IMPORTANT
        }
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(
      "🔥 GEMINI ERROR FULL:",
      error.response?.data || error.message
    );

    return JSON.stringify({
      type: "general",
      response: "AI is currently unavailable"
    });
  }
};

export default geminiRespose;
