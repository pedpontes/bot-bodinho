import { env } from '@/main/configs/config';
import axios from 'axios';

export class FlowiseHelper {
  #BASE_URL: string;
  constructor() {
    if (!env.flowise.baseUrl) {
      throw new Error(
        'FLOWISE_BASE_URL is not defined in the environment variables.',
      );
    }

    this.#BASE_URL = env.flowise.baseUrl;
  }

  async loadAllFlows(filters: { category?: string }) {
    const response = await axios.get(
      `${this.#BASE_URL}/api/v1/chatflows?type=AGENTFLOW`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.flowise.apiKey}`,
        },
      },
    );

    return await response.data;
  }
}
