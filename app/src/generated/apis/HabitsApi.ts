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


import {
    Habit,
    HabitFromJSON,
    HabitRequest,
    HabitRequestToJSON,
    HabitResponse,
    HabitResponseFromJSON,
    HabitValue,
    HabitValueFromJSON,
    HabitValueRequest,
    HabitValueRequestToJSON,
} from '../models';
import * as runtime from '../runtime';

export interface DeleteHabitsWithHabitRequest {
    habit: string;
}

export interface GetHabitsRequest {
    to?: Date;
    from?: Date;
}

export interface PostHabitsRequest {
    habitRequest?: HabitRequest;
}

export interface PostHabitsWithHabitRequest {
    habit: string;
    habitValueRequest?: HabitValueRequest;
}

export interface PutHabitsWithHabitRequest {
    habit: string;
    habitRequest?: HabitRequest;
}

/**
 * no description
 */
export class HabitsApi extends runtime.BaseAPI {

    /**
     * Delete habits with habit
     */
    async deleteHabitsWithHabitRaw(requestParameters: DeleteHabitsWithHabitRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.habit === null || requestParameters.habit === undefined) {
            throw new runtime.RequiredError('habit','Required parameter requestParameters.habit was null or undefined when calling deleteHabitsWithHabit.');
        }

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
            path: `/habits/{habit}`.replace(`{${"habit"}}`, encodeURIComponent(String(requestParameters.habit))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete habits with habit
     */
    async deleteHabitsWithHabit(requestParameters: DeleteHabitsWithHabitRequest): Promise<void> {
        await this.deleteHabitsWithHabitRaw(requestParameters);
    }

    /**
     * Get habits
     */
    async getHabitsRaw(requestParameters: GetHabitsRequest): Promise<runtime.ApiResponse<HabitResponse>> {
        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.to !== undefined) {
            queryParameters['to'] = (requestParameters.to as any).toISOString().substr(0,10);
        }

        if (requestParameters.from !== undefined) {
            queryParameters['from'] = (requestParameters.from as any).toISOString().substr(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/habits`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => HabitResponseFromJSON(jsonValue));
    }

    /**
     * Get habits
     */
    async getHabits(requestParameters: GetHabitsRequest): Promise<HabitResponse> {
        const response = await this.getHabitsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Post habits
     */
    async postHabitsRaw(requestParameters: PostHabitsRequest): Promise<runtime.ApiResponse<Habit>> {
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
            path: `/habits`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HabitRequestToJSON(requestParameters.habitRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => HabitFromJSON(jsonValue));
    }

    /**
     * Post habits
     */
    async postHabits(requestParameters: PostHabitsRequest): Promise<Habit> {
        const response = await this.postHabitsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Post habits with habit
     */
    async postHabitsWithHabitRaw(requestParameters: PostHabitsWithHabitRequest): Promise<runtime.ApiResponse<HabitValue>> {
        if (requestParameters.habit === null || requestParameters.habit === undefined) {
            throw new runtime.RequiredError('habit','Required parameter requestParameters.habit was null or undefined when calling postHabitsWithHabit.');
        }

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
            path: `/habits/{habit}`.replace(`{${"habit"}}`, encodeURIComponent(String(requestParameters.habit))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HabitValueRequestToJSON(requestParameters.habitValueRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => HabitValueFromJSON(jsonValue));
    }

    /**
     * Post habits with habit
     */
    async postHabitsWithHabit(requestParameters: PostHabitsWithHabitRequest): Promise<HabitValue> {
        const response = await this.postHabitsWithHabitRaw(requestParameters);
        return await response.value();
    }

    /**
     * Put habits with habit
     */
    async putHabitsWithHabitRaw(requestParameters: PutHabitsWithHabitRequest): Promise<runtime.ApiResponse<Habit>> {
        if (requestParameters.habit === null || requestParameters.habit === undefined) {
            throw new runtime.RequiredError('habit','Required parameter requestParameters.habit was null or undefined when calling putHabitsWithHabit.');
        }

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
            path: `/habits/{habit}`.replace(`{${"habit"}}`, encodeURIComponent(String(requestParameters.habit))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HabitRequestToJSON(requestParameters.habitRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => HabitFromJSON(jsonValue));
    }

    /**
     * Put habits with habit
     */
    async putHabitsWithHabit(requestParameters: PutHabitsWithHabitRequest): Promise<Habit> {
        const response = await this.putHabitsWithHabitRaw(requestParameters);
        return await response.value();
    }

}
