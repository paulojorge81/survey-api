import { HttpStatusCode } from "../http/http-status-code";
import type { HttpResponse } from "../protocols/http";
import { SignUpController } from "./signup";


// sut = system under test

describe('SignUp Controller', () => {
  test('Should return for 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        // name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new Error("Missing param: name"));
  });

  test('Should return for 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        // email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new Error("Missing param: email"));
  });
});
