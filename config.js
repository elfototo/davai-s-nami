require('dotenv').config();

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_1;

export const API_URL = `${API_BASE_URL}api/events/valid/`;

export const API_URL_BY_ID = `${API_BASE_URL}api/events/valid/`;

export const API_URL_PL = `${API_BASE_URL}api/places/`;

export const API_URL_PL_BY_ID = `${API_BASE_URL}api/places/`;


export const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;
export const API_EVENTS_SIMILAR_URL = `${API_BASE_URL}api/events/`;
export const API_TASKS_STATUS_URL = `${API_BASE_URL}api/tasks/status/`;
export const API_SELECTION_URL = `${API_BASE_URL}api/content-generator/selection/`;

export const API_HEADERS = {
    'Authorization': `${process.env.NEXT_PUBLIC_API_AUTHORIZATION_KEY}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

export const NEXT_PUBLIC_Register = process.env.NEXT_PUBLIC_Register;
export const NEXT_PUBLIC_Login = process.env.NEXT_PUBLIC_Login;


export const API_URL1 = API_BASE_URL;
