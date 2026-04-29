export interface UpdateAccessTokenRepository {
  updateAccessToken: (id: string, hash: string) => Promise<void>;
}
