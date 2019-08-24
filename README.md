# SPGroup-Tariff-Rate-API

Pre-requisite:
  - NodeJS
  - cheerio package
  - axios package
  - express package
  
Web-scrape SPgroup Tariff Rate and create an organized and structured data for RESTful API.

### Installation

This program requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server.

```sh
$ cd SPGroup-Tariff-Rate-API
$ npm install
$ node index.js
```

The server will be run at port 8000 by default.
http://localhost:8000

#### Example of the API

```json
{
   "date":"2019-08-24T10:31:06.149Z",
   "tariff_rate":[
      {
         "description":"electricity tariff",
         "cost_kwh":24.22,
         "cost_kwh_gst":25.92,
         "wef":"1 Jul - 30 Sep19"
      },
      {
         "description":"gas tariff",
         "cost_kwh":19.1,
         "cost_kwh_gst":20.44,
         "wef":"1 Jul - 30 Sep19"
      },
      {
         "description":"water tariff",
         "cost":1.21,
         "cost_gst":1.29,
         "cost_cubic_metre":1.52,
         "cost_cubic_metre_gst":1.63,
         "wef":"<40m³ or > 40m³"
      }
   ]
}
```

In index.html is the front-end of the application that does a simple calculation of the electricity bill base on the amount of power consumption being used.

![alt text](https://i.imgur.com/zfS0fsm.png "Front-End")
