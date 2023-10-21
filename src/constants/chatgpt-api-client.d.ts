declare module 'chatgpt-api-client' {
  export class ChatGPTApi {
    constructor({
      apiKey,
      organization,
    }: {
      /**
       * OpenAI API key for authentification. Visit the page https://platform.openai.com/account/api-keys to retrieve the API Key you'll use in your requests,
       */
      apiKey: string,
      /**
       * optional field. For users who belong to multiple organizations, you can pass a this property to specify which organization is used for an API request.
       */
      organization?: string
    })

    async sendMessage(options: {
      prompt: string,
      model?: string,
      max_tokens?: number,
      temperature?: number,
      nCompeletions?: number,
    }): Promise<{
      warning: string,
      id: string,
      object: string,
      created: number,
      model: string,
      choices: {
        text: string,
        index: number,
        logprobs?: {
          tokens: string[],
          token_logprobs: number[],
          top_logprobs: {
            [key: string]: number,
          }
        },
        finish_reason: string,
      }[],
      usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number,
      }
    }>;

    async getModels(): Promise<string[]>;
  }
}