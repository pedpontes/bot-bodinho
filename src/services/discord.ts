import {
  TokenResponseModel,
  UserInfoDiscordModel,
} from '@/domain/interfaces/discord';
import { env } from '@/main/configs/config';
import axios from 'axios';
import qs from 'qs';

export interface DiscordHelperProtocols {
  loadUserInfo(params: {
    token: string;
    tokenType: string;
  }): Promise<UserInfoDiscordModel>;
  generateToken(code: string): Promise<TokenResponseModel>;
}

export class DiscordHelper implements DiscordHelperProtocols {
  constructor() {}

  async loadUserInfo({
    token,
    tokenType,
  }: {
    token: string;
    tokenType: string;
  }): Promise<UserInfoDiscordModel> {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('(DiscordHelper.loadUserInfo) ', error);
      throw new Error(
        '(DiscordHelper.loadUserInfo) Error loading Discord user info',
      );
    }
  }

  async generateToken(code: string): Promise<TokenResponseModel> {
    try {
      const data = {
        client_id: env.oauth.discord.clientId,
        client_secret: env.oauth.discord.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: env.oauth.discord.redirectUri,
      };

      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        qs.stringify(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        '(DiscordHelper.generateToken) ',
        error.response?.data || error,
      );
      throw new Error(
        '(DiscordHelper.generateToken) Error generating Discord token',
      );
    }
  }
}
