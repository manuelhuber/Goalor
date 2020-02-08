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


import {Gratitude, GratitudeData, GratitudeDataToJSON, GratitudeFromJSON,} from '../models';
import * as runtime from '../runtime';

export interface DeleteGratitudeWithIdRequest {
    id: string;
}

export interface PostGratitudeRequest {
    image?: Blob;
}

export interface PutGratitudeWithIdRequest {
    id: string;
    gratitudeData?: GratitudeData;
}

/**
 * no description
 */
export class GratitudeApi extends runtime.BaseAPI {

    /**
     * Delete gratitude with id
     */
    async deleteGratitudeWithIdRaw(requestParameters: DeleteGratitudeWithIdRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteGratitudeWithId.');
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
            path: `/gratitude/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete gratitude with id
     */
    async deleteGratitudeWithId(requestParameters: DeleteGratitudeWithIdRequest): Promise<void> {
        await this.deleteGratitudeWithIdRaw(requestParameters);
    }

    /**
     * Get gratitude
     */
    async getGratitudeRaw(): Promise<runtime.ApiResponse<Array<Gratitude>>> {
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
            path: `/gratitude`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GratitudeFromJSON));
    }

    /**
     * Get gratitude
     */
    async getGratitude(): Promise<Array<Gratitude>> {
        const response = await this.getGratitudeRaw();
        return await response.value();
    }

    /**
     * Post gratitude
     */
    async postGratitudeRaw(requestParameters: PostGratitudeRequest): Promise<runtime.ApiResponse<Gratitude>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.image !== undefined) {
            formParams.append('image', requestParameters.image as any);
        }

        const response = await this.request({
            path: `/gratitude`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GratitudeFromJSON(jsonValue));
    }

    /**
     * Post gratitude
     */
    async postGratitude(requestParameters: PostGratitudeRequest): Promise<Gratitude> {
        const response = await this.postGratitudeRaw(requestParameters);
        return await response.value();
    }

    /**
     * Put gratitude with id
     */
    async putGratitudeWithIdRaw(requestParameters: PutGratitudeWithIdRequest): Promise<runtime.ApiResponse<Gratitude>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling putGratitudeWithId.');
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
            path: `/gratitude/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: GratitudeDataToJSON(requestParameters.gratitudeData),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GratitudeFromJSON(jsonValue));
    }

    /**
     * Put gratitude with id
     */
    async putGratitudeWithId(requestParameters: PutGratitudeWithIdRequest): Promise<Gratitude> {
        const response = await this.putGratitudeWithIdRaw(requestParameters);
        return await response.value();
    }

}