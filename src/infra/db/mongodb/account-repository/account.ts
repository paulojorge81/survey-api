
import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import type { AccountModel } from "../../../../domain/models/account";
import type { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const accountToInsert = { ...accountData };
    const { insertedId } = await accountCollection.insertOne(accountToInsert)
    return {
      id: insertedId.toHexString(),
      ...accountData
    };
  }

}
