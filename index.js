const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
var cors = require('cors')

const app = express();
app.use(cors())

app.get('/', async (req, res) => {
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
            const cost_kWh_gst = pArr[0].replace(" cents/kWh (w GST)", "");
            const cost_kWh = h2.replace(" cents/kWh", "");
            const wef = pArr[2].replace("(", "").replace("wef ", "").replace(")", "");

            jsonObject.push({
                description,
                cost_kWh,
                cost_kWh_gst,
                wef
            });
        });
        res.json({
            date: new Date(),
            tariff_rate: jsonObject
        });
    });
    
    
    
})

app.listen(8000, () =>
    console.log(`Backend service running on port 8000!`),
);