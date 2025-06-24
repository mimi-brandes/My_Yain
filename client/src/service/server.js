import { baseURL } from '../config.js';
export async function fetchServer(LinkToServer, dataToServer = {}, method = "GET") {
  try {
    const request = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (method !== 'GET') {
      request.body = JSON.stringify(dataToServer);
    }

    const response = await fetch(baseURL + LinkToServer, request);

    if (!response.ok) {
      const responseData = await response.json().catch(() => null);
      return { error: responseData?.error || 'שגיאה לא מזוהה מהשרת' };
    }

    return await response.json();
  } catch (error) {
    alert('somthing failed');
    return { error: 'שגיאת תקשורת עם השרת' };
  }
}
