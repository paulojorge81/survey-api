import type { AccountModel } from '@/domain/models/account';
import type { AddAccountParams } from '@/domain/usecases/account/add-account';
import type { AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...mockAddAccountParams(),
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAddAccountWithTokenParams = (): AddAccountParams & { accessToken: string } => ({
  ...mockAddAccountParams(),
  accessToken: 'any_token',
});
