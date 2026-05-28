import { faker } from '@faker-js/faker';

import type { Decrypter } from '@/data/protocols/criptography/decrypter';
import type { Encrypter } from '@/data/protocols/criptography/encrypter';
import type { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import type { Hasher } from '@/data/protocols/criptography/hasher';

export class HasherSpy implements Hasher {
  digest = faker.string.uuid();
  plaintext!: string;

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return await Promise.resolve(this.digest);
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext: string | null = faker.internet.password();
  ciphertext!: string;
  async decrypt(ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext;
    return await Promise.resolve(this.plaintext);
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.string.uuid();
  plaintext!: string;

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return await Promise.resolve(this.ciphertext);
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext!: string;
  digest!: string;
  isValid = true;
  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;
    return await Promise.resolve(this.isValid);
  }
}
