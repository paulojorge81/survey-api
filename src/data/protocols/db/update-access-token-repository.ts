export interface UpdateAccessTokenRepository {
  update: (value: string, hash: string) => Promise<void>;
}
