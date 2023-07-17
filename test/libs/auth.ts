import axios from 'axios'

export const getToken = async () => {
  return axios({
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.AUTH_TOKEN_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
      username: process.env.AUTH_USERNAME,
      password: process.env.AUTH_PASSWORD,
      scope: 'openid',
    },
  })
    .then(response => {
      return response?.data?.access_token
    })
    .catch(error => {
      return undefined
    })
}
