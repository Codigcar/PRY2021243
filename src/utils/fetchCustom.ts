import {APP_API} from '@env';
const baseUrl = `${APP_API}`;

export const ENV = {
  // APP_API: "http://20.25.92.149",
  // APP_API_SOCKET: "http://20.25.92.149",
  APP_API: "http://10.0.2.2:3000",
  APP_API_SOCKET: "http://10.0.2.2:3001"
} 

const fetchWithToken = (
  endpoint: string,
  data: any = {},
  method: string = 'GET',
) => {
  const url = `${ENV.APP_API}/${endpoint}`;
  console.log({url});
  

  // const token = localStorage.getItem('token') || '';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZjBjZGQ5ZTEtYTA2Ny00NmVkLThmZDYtMDZkMGMxNjM0MDFlIiwicm9sZSI6IjQxMTRlZTFlLTk4NjMtNGYwMi05ODAzLTZiYWIzYWI0OTU2NiIsImV4cGlyZXNfYXQiOjE2NDgxMzY1NDU5NzQsImlhdCI6MTY0ODA1MDE0NX0.DSf4-XV7aEc2qK1ZoAdamZ3NcXi8HDRkN2KSHLsvjcU';

  try {
    if (method === 'GET') {
      return fetch(url, {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      });
    } else {
      return fetch(url, {
        method,
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
        body: JSON.stringify(data),
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default fetchWithToken;
