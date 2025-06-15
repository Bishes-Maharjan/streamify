## About

A small project to use getstream.io for video calling and chatting. My first attempt towards it so the user qol isnt great. I could have implemented a mailer module to check the users email authenticity but decided not to because I wanted any one to come and try this without needing an authentic email

### How to run

To run this project in your own local device you would need to copy the both env files to .env of their respective folder

### Backend

Visit <a href='https://getstream.io/'> getstream.io </a> for

```bash

STREAM_API_KEY=
STREAM_API_SECRET=
```

Visit <a href='https://console.cloud.google.com/'>cloud console</a> for

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Make up your own JWT_SECRET

Use your own mongodb uri or <a href='https://www.mongodb.com/'>Mongo DB Atlas</a> for the uri
If ur using the mongo db atlas, be sure to allow acces from anywhere in your network access settings for atlas.
The remaining fields can be empty.

### Frontend

```bash
NEXT_PUBLIC_STREAM_API_KEY= STREAM_API_KEY #Same as your backend getstream.io api key
```

Thats it.
Signing off.
