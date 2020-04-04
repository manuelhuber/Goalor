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
import {
    Habit,
    HabitFromJSON,
    HabitFromJSONTyped,
    HabitToJSON,
} from './';

/**
 * 
 * @export
 * @interface HabitResponse
 */
export interface HabitResponse {
    /**
     * 
     * @type {Array<Habit>}
     * @memberof HabitResponse
     */
    habits: Array<Habit>;
    /**
     * 
     * @type {{ [key: string]: { [key: string]: number; }; }}
     * @memberof HabitResponse
     */
    dateValue: { [key: string]: { [key: string]: number; }; };
}

export function HabitResponseFromJSON(json: any): HabitResponse {
    return HabitResponseFromJSONTyped(json, false);
}

export function HabitResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): HabitResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'habits': ((json['habits'] as Array<any>).map(HabitFromJSON)),
        'dateValue': json['dateValue'],
    };
}

export function HabitResponseToJSON(value?: HabitResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'habits': ((value.habits as Array<any>).map(HabitToJSON)),
        'dateValue': value.dateValue,
    };
}


