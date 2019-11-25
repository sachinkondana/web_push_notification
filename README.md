# web_push_notification

### 1. Client

Demo: https://pwa-frontend-sample-app.herokuapp.com/

1. Load the client in the browser
2. Subscribe for the push notification
3. Once done, make curl request for the bellow request(you can use postman)

```
curl -X GET \
  https://pwa-backend-sample-app.herokuapp.com/api/send-notification \
  -H 'Postman-Token: 48c92a1c-859f-4ef0-afbe-e1990f187c7f' \
  -H 'cache-control: no-cache'
```

4. You will receive a push at your client.



### 2. Sever - To run server
You need node installed in your machine and install all depedency packages. Run the bellow commands from `server/`

1. npm istall
2. node ./index.js

This will run the node server, and show you the URL.

The current implementation wont use any database implementation, it uses the subscription object sent from the client and store it in a cache variable and sends the push to that subscription user. (Last come will get the push :))
