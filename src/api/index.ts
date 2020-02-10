// const baseUrl = 'http://192.168.1.122:8088'
const baseUrl = 'https://api.1qa.link'

export const getTextFromCode = (code: string) => fetch(baseUrl + `/sync/getText?code=${code}`).then(res => res.json())
export const addText = (text: string) => fetch(baseUrl + '/sync/addText',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  }
).then(res => res.json())
