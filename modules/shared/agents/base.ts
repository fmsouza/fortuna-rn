import OpenAI from "openai";

const CLIENT: OpenAI = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export class BaseAgent {
  private client: OpenAI = CLIENT;

  protected constructor(
    private initialPrompt: OpenAI.ChatCompletionMessageParam[],
  ) {}

  protected async ask(
    questions: OpenAI.ChatCompletionMessageParam[],
  ): Promise<string[]> {
    const response = await this.client.chat.completions.create({
      messages: [...this.initialPrompt, ...questions],
      model: "gpt-3.5-turbo",
      max_tokens: 1,
    });

    return response.choices.map((choice) => choice.message.content ?? "");
  }
}
