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
 * @interface UserTO
 */
export interface UserTO {
    /**
     * 
     * @type {string}
     * @memberof UserTO
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserTO
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserTO
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof UserTO
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof UserTO
     */
    lastName: string;
}

export function UserTOFromJSON(json: any): UserTO {
    return UserTOFromJSONTyped(json, false);
}

export function UserTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'id': json['id'],
        'username': json['username'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
    };
}

export function UserTOToJSON(value?: UserTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'id': value.id,
        'username': value.username,
        'firstName': value.firstName,
        'lastName': value.lastName,
    };
}


