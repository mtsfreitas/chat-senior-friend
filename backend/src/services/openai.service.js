const OpenAI = require('openai');
const config = require('../config/environment');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async analyzeCode(code) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: `Analyze this code:\n${code}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  }

  getSystemPrompt() {
    return `You are an expert code analyst. For any code provided, generate a comprehensive analysis. 
    Provide clear, detailed responses for:
    1. Natural Language Explanation: A comprehensive description of what the code does
    2. Refactored Code: An improved version of the code with comments explaining the improvements
    3. Step-by-Step Reasoning: Detailed explanation of how you analyzed the code

    Format your response as a JSON object with these three keys:
    - naturalLanguageExplanation: string
    - refactoredCode: string
    - stepByStepReasoning: string

    Please ensure the following:
    - The "Step-by-Step Reasoning" should be formatted as a numbered list with line breaks after each step, like this:
      1. First, you analyzed the variable declarations...
      2. Then, you examined the flow of the program...

    IMPORTANT: Ensure each section is populated with meaningful content. Do not use Markdown formatting in your responses. Provide plain text only.`;
  }
}

module.exports = new OpenAIService();