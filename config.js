require('dotenv').config();

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_URL_BY_ID = process.env.NEXT_PUBLIC_API_URL_BY_ID;

export const API_URL_PL = process.env.NEXT_PUBLIC_API_URL_PL;

export const API_URL_PL_BY_ID = process.env.NEXT_PUBLIC_API_URL_PL_BY_ID;


export const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

export const API_HEADERS = {
    'Authorization': `${process.env.NEXT_PUBLIC_API_AUTHORIZATION_KEY}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

export const NEXT_PUBLIC_Register = process.env.NEXT_PUBLIC_Register;
export const NEXT_PUBLIC_Login = process.env.NEXT_PUBLIC_Login;

