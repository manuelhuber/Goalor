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
 * @interface PasswordUpdate
 */
export interface PasswordUpdate {
    /**
     * 
     * @type {string}
     * @memberof PasswordUpdate
     */
    old?: string;
    /**
     * 
     * @type {string}
     * @memberof PasswordUpdate
     */
    token?: string;
    /**
     * 
     * @type {string}
     * @memberof PasswordUpdate
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof PasswordUpdate
     */
    pw: string;
}

export function PasswordUpdateFromJSON(json: any): PasswordUpdate {
    return PasswordUpdateFromJSONTyped(json, false);
}

export function PasswordUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): PasswordUpdate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'old': !exists(json, 'old') ? undefined : json['old'],
        'token': !exists(json, 'token') ? undefined : json['token'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'pw': json['pw'],
    };
}

export function PasswordUpdateToJSON(value?: PasswordUpdate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'old': value.old,
        'token': value.token,
        'username': value.username,
        'pw': value.pw,
    };
}


