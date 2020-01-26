/* tslint:disable */
/* eslint-disable */
/**
 * Purpose
 * My Application
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    ErrorResponse,
    ErrorResponseFromJSON,
    ErrorResponseToJSON,
    PasswordUpdate,
    PasswordUpdateFromJSON,
    PasswordUpdateToJSON,
    Registration,
    RegistrationFromJSON,
    RegistrationToJSON,
    RegistrationResponse,
    RegistrationResponseFromJSON,
    RegistrationResponseToJSON,
    User,
    UserFromJSON,
    UserToJSON,
    UserTO,
    UserTOFromJSON,
    UserTOToJSON,
} from '../models';

export interface PostUserPasswordRequest {
    passwordUpdate?: PasswordUpdate;
}

export interface PostUserRegisterRequest {
    registration?: Registration;
}

export interface PutUserRequest {
    userTO?: UserTO;
}

/**
 * no description
 */
export class UserApi extends runtime.BaseAPI {

    /**
     * Get user
     */
    async getUserRaw(): Promise<runtime.ApiResponse<UserTO>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserTOFromJSON(jsonValue));
    }

    /**
     * Get user
     */
    async getUser(): Promise<UserTO> {
        const response = await this.getUserRaw();
        return await response.value();
    }

    /**
     * Post user password
     */
    async postUserPasswordRaw(requestParameters: PostUserPasswordRequest): Promise<runtime.ApiResponse<string>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/password`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PasswordUpdateToJSON(requestParameters.passwordUpdate),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Post user password
     */
    async postUserPassword(requestParameters: PostUserPasswordRequest): Promise<string> {
        const response = await this.postUserPasswordRaw(requestParameters);
        return await response.value();
    }

    /**
     * Post user register
     */
    async postUserRegisterRaw(requestParameters: PostUserRegisterRequest): Promise<runtime.ApiResponse<RegistrationResponse>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/register`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegistrationToJSON(requestParameters.registration),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RegistrationResponseFromJSON(jsonValue));
    }

    /**
     * Post user register
     */
    async postUserRegister(requestParameters: PostUserRegisterRequest): Promise<RegistrationResponse> {
        const response = await this.postUserRegisterRaw(requestParameters);
        return await response.value();
    }

    /**
     * Put user
     */
    async putUserRaw(requestParameters: PutUserRequest): Promise<runtime.ApiResponse<User>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UserTOToJSON(requestParameters.userTO),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * Put user
     */
    async putUser(requestParameters: PutUserRequest): Promise<User> {
        const response = await this.putUserRaw(requestParameters);
        return await response.value();
    }

}
