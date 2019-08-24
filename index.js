const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    let jsonObject = [];

    axios({
        url: 'https://www.spgroup.com.sg/what-we-do/billing',
        method: 'GET'
    }).then(({ data }) => {
        $ = cheerio.load(data);
        const html_class = $('.col-sm-4.match-height');

        html_class.each(function () {
            const t = $(this);
            const paragraph = t.find('p').text();
            const h2 = t.find('h2').text();
            const pArr = paragraph.split('\n');

            const description = pArr[1].toLowerCase().substring(0, pArr[1].length - 1);
            const cost_gst = pArr[0].replace(/\$/g, "").replace(" cents/kWh", "").replace(" (w GST)", "").replace("/m³", "");
            const cost = h2.replace(/\$/g, "").replace(" cents/kWh", "").replace("/m³", "");
            const wef = pArr[2].replace("(", "").replace("wef ", "").replace(")", "");

            if (description === "water tariff") {
                jsonObject.push({
                    description,
                    cost: parseFloat(cost.split(" or ")[0]),
                    cost_gst: parseFloat(cost_gst.split(" or ")[0]),
                    cost_cubic_metre: parseFloat(cost.split(" or ")[1]),
                    cost_cubic_metre_gst: parseFloat(cost_gst.split(" or ")[1]),
                    wef
                });
            } else {
                jsonObject.push({
                    description,
                    cost_kwh: parseFloat(cost),
                    cost_kwh_gst: parseFloat(cost_gst),
                    wef
                });
            }
            
        });
        res.json({
            date: new Date(),
            tariff_rate: jsonObject
        });
    });
});

app.post('/power', function (req, res) {
    let { power, powerOption, hours } = req.body;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(422).json({
            error: 'Invalid request.'
        });
        return;
    }

    if (powerOption < 0 || powerOption > 1) {
        res.status(422).json({
            error: 'Invalid request.'
        });
        return;
    }

    if (hours < 0 || hours > 24) {
        res.status(422).json({
            error: 'Hours should be in range of 0 to 24.'
        });
        return;
    }

    axios({
        url: 'https://www.spgroup.com.sg/what-we-do/billing',
        method: 'GET'
    }).then(({ data }) => {
        $ = cheerio.load(data);
        const html_class = $('.col-sm-4.match-height');
        const t = html_class.first()
        const paragraph = t.find('p').text();
        const h2 = t.find('h2').text();
        const pArr = paragraph.split('\n');
        const description = pArr[1].toLowerCase().substring(0, pArr[1].length - 1);
        const cost_kWh_gst = pArr[0].replace(" cents/kWh (w GST)", "");
        const cost_kWh = h2.replace(" cents/kWh", "");
        const wef = pArr[2].replace("(", "").replace("wef ", "").replace(")", "");

        if (powerOption == 0) {
            power = power / 1000;
        }

        const dailyUsage = parseFloat((power * hours) * (cost_kWh / 100)).toFixed(2);
        const monthlyUsage = parseFloat(dailyUsage * 30).toFixed(2);
        const yearlyUsage = parseFloat(monthlyUsage * 12).toFixed(2);

        res.json({
            date: new Date(),
            description,
            cost_kwh: parseFloat(cost_kWh),
            cost_kwh_gst: parseFloat(cost_kWh_gst),
            wef,
            result: {
                daily_usage: parseFloat(dailyUsage),
                monthly_usage: parseFloat(monthlyUsage),
                yearly_usage: parseFloat(yearlyUsage)
            }
        });
    });
});

app.listen(8000, () =>
    console.log(`Backend service running on port 8000!`),
);