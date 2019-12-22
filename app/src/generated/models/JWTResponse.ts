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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface JWTResponse
 */
export interface JWTResponse {
    /**
     * 
     * @type {string}
     * @memberof JWTResponse
     */
    jwt?: string;
}

export function JWTResponseFromJSON(json: any): JWTResponse {
    return JWTResponseFromJSONTyped(json, false);
}

export function JWTResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): JWTResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'jwt': !exists(json, 'jwt') ? undefined : json['jwt'],
    };
}

export function JWTResponseToJSON(value?: JWTResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'jwt': value.jwt,
    };
}


