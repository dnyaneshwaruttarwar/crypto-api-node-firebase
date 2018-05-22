var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var unirest = require('unirest');
var Promise = require('promise');
var escape = require('escape-html');
var firebase = require('firebase-admin');
var moment = require('moment');


// Below Credentials are of test account

// var serviceAccount = {
//     "type": "service_account",
//     "project_id": "crypto-app-ee3dc",
//     "private_key_id": "cd44ddb29b75383b0f85666e5698654275cc7998",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqzi7FxDf7Pz90\nS3Yqk2aRmMjo3nVw9+sHAsnqtktQPSjmW6JciEWeABt66oRdcHCKg0RHgZ75IDG5\nWQpneQ5dE1a7haHeYbz7SnAb+0LjofjC1QTBAcG3QM2+KyixHahxHedMgvN/3sNZ\nYL+YMZgt7fwwDgzqSzofAkcVOXAl4Jdc76B2fXRyAgCjlwvmjan8SR900WiYvnv2\ncjbl6BiWfpD0M4/VJXQplbIFLHT6Aos6JBW505jgX9A4wYzsNGgx2c9KOpllLaaU\nqWdfe2mom5/tM2PYNZ6NJcLqfSpvhNdQbC1jRsTZx6ZNGyveLJPFQT0ZYSGvEsLf\n/EAOtThHAgMBAAECggEABdCFCRh362aoy1WyTRq9eCFiXYMNLm5SIuf2ZbYU9ENQ\nvB7MdSfybsGELfgDz4Z/Xke/sEt6VPLCnpOoZgNZ+NMqtbGD5CUhoNBU5q70BPnD\nlSZZRhTAOnPLTTj85qKi1E73S8R9c5HqxoUjoJO3oYCjgCNKT0OGU/3o25Eb/z4K\nvvdKLbdh2yoJWuR7htwjrDykiKlIMLYlNEvANuQ1kGeop3t51prhob7gwgCsdeHW\nw8dGs0+Lqj/y3m8DnquOWgEtGtYmMOuzSJezNzv4uD1qPjCjiLx5ptY5t6i/ncCC\nw+lok+WgnXtLRpgbi8jFSbeVJorgfUj87cyGTQnN4QKBgQDj1L6/fk68ZXXo2RLt\n/EPDYcG340mORywxHZJqZJF9kuspNEm21mu3jidPLzTdtxU6j43mJPJU9eW2h5Z/\ncpKe2W/AvuaZ0o817v51qCC13XzKx8HX8/DqgvCQxWFWN/6qdXv/WrZULiERTcpf\nGb1mxCLwYkCXRNJVaMd98K+edwKBgQC/7Hm59HI9NRCuO3INslSgOH++Ktp8zQAd\nW1iu8Q2TBqX8yhxqBo97lqsHgtdLPDzCp156jv/nzDpm/My5hEiC05d75X1rMnk9\nF5z3k2rFq29UVLuW+qSWSN+lXSqZhhxvIV9tkW79c8eKzDWWu+gcT2P3VFO2za6s\nty7HrN6YsQKBgQCJLXt8iWyW+vA3txwytwWGCsI9GlkblbcCC7Aw50TCu0dkk9se\nf5Rz/N+mSeIm7SmXDQB/ZheTGEurz4/KRQ4LHxiukUL/s0wPSUtlREoNtsKAxi3s\n/TA9w4Fdabrl0uk/cWWrps7JeMzoQlJrWHA2BDqVSlNhwUpzqpcTOWxEmQKBgAK8\n9fOgOC0FX8qMkJD/dVOf2rq0088qAZFppzc/uyjY1G9p1sPwegWSXbhKtpWdM2S3\njJKFDcOZ10921djjuUEckbGz0XlBDBfCCXxCvyg4zOrQFqkNxGFcgsxSKvRrxGYV\nfM4MYB//kd46EZ2n6qTUwSFbM6KNBqvyJRm2LqrRAoGAHxj0HpITnRcWFZgDutV3\n73j4JKPVf98/RdLcAR5YQwF8j3PkFIA8cVqwRVlcX9FNTDipeZ8E3YoIS3Buecwe\nuXn5/Dq1DxYouoFKd4GaAXD2Vedqsc1FJJLQ38vV58K3+vF8ZqGo1zc6bw8kiQwK\n/O3Ddt1JPfIjqJlSSm16Qew=\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-mqkf5@crypto-app-ee3dc.iam.gserviceaccount.com",
//     "client_id": "109793800077962320622",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://accounts.google.com/o/oauth2/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mqkf5%40crypto-app-ee3dc.iam.gserviceaccount.com"
// };

// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: "https://crypto-app-ee3dc.firebaseio.com"
// });


var serviceAccount = {
    "type": "service_account",
    "project_id": "crypto-api-9630b",
    "private_key_id": "8f5fe826307279e96077b7fd8078c4641b8a411a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDdXqid5/Q+m5Cr\ngCoXYa/0aRFpvLnAMSVANJF5RAVJd8BVTYvPu2N6GB5Kj9gM/gFEa5C6sFrMcYsO\nVYOjuVKu4K4GHMeMWjgBN91tDx6v4JufxSiXF+1g7Wti03y56SvPt6ss0fq5mqdy\nFeRrheWI8DuNnx29cwU5X3xV8IfiGVrfz9LEhllD4EH0lKbFApUvzj1IfpF/p9Pe\nfivZPaw7oi1AsVeaBl9LvvWVEi5Vsl6PUI5T+HNFyRY9U/fNrepqrE2iwDhzONzI\nkukpyulJSNkiIWrZDrKQ6/zPpLAT7pAkD83pmlkR3VziXP2wI0zmv7gPvIj3kDeT\n06fNkOyJAgMBAAECggEABO9oGMyM9qSkyWO8J+wBHCcHyf54w6pZZQnUswELbNgX\nr2YFrmzWj0PFGa7gR2goRzfcHoMWJEWuU0/XLEDAFe7+z+1b5c9+hkj/6Rq81Qur\nN/Rsyk6wnCzMkN9ASz4vdzeK0p8NOY6BB9/gW24q1KU4JqtXYnc364aYzD1mePv5\niA784dZZcDOe2wOH4nX2RI69blSlBRyjz5pD7GdeqbJ1yE3n2vqcitPIVlTARfn2\nchJWavOboiZwDkdp0GkbyM7HJWuKIEy1z/62oCqU9ggn0Fo6Ybt8L8aP7hoEzlJn\neABPwjgQw4k7jXTWPgYzxU7EL3/LWKZp5g1hAXnFYwKBgQD23lx9xiYkxMaPljXN\niNFDTsjVU7Elc+RoOnVOyKNmYm+J1kdkuDrM75r2valWFNlext/5ejVMI4fULeHm\nBrdj4/isXm1Ol/wWQjr+3C9H/EPDxiD4zJA2/Quk6WLnVpu24fc1Z2YJb4/KVwzM\ndEOKH+NIFdkSi2kfw+dC1uZzCwKBgQDljthAyX7oJPR9x+tTSRw6pa9Qw/37g4Gt\nwQgbqWNIE7KcUsCGyGHp/XfbRzSgDrHz3/tAqOXuMbLl8o2f0aO6UQmrBObF/aIN\n83jb/oZrXXgzcdiX5uV/ZjCEiapXJ13GDSHi+Bqh+q/AdGRh16+89JkRoIIIf35K\neuIvLF7bOwKBgHBU3CdLC749X9CkXBULRZVn+xC/BWNyaaNXvls8BsYm0nQY8eGN\nxwvLl2rhAHWwBP0QZ4gAqNHddQgCXMErmzUz3cqpKPnTRJzoRCoGDOmnizpBJG2x\nv4mV+T9wB1YW3cII7lD5nL98aSR8GdHKsZTfT69UabL7hrkyjj+mw7PjAoGAdoy3\nh3XHsTFshgyZrhBCoNLx3/7nil1WuhnHCyoGGLH7epmNzc1sK3/3xulV9xa/tddF\nFRZkcAeAgRorI48LQ+wX1xcX6sXaS+Qh1VLzrjy+F6tClOfsO0fV5IyHyKyO0/ny\nNxmz/1TMMNKrCJBvtGCJMD45CRR2bxZY+s2qSwMCgYB+jtSEWv3MzRAJ/mRe5JbW\nFcVdG0l1fEhDs0NYQSuo6Al1C6meHRupAin44msKUKNDLnHk/VWe7nvxm1x3IwIN\n25Pf1GwaD9uJPw010iwxgZS/iK58KK0IZoj5Jk9SbOU7d0ReEH6GMkTReux4/D5E\nrr4cyGh6VrhBy75dMh0HfA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xhynt@crypto-api-9630b.iam.gserviceaccount.com",
    "client_id": "106428014089430943714",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xhynt%40crypto-api-9630b.iam.gserviceaccount.com"
};

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://crypto-api-9630b.firebaseio.com"
});

var db = firebase.database();

//start body-parser configuration
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
//end body-parser configuration

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var key = "AAAAOm8japk:APA91bFNamcvNtupkfORJ1IrmigCGiffdhzL0r06XOS-eNhHAe1EZb9h4nbfsNF_nRgoJbIVyZuCHk4w-o1DqTKnIYI54Kqtvz7ZqjeYHXaiuB9PaU8WWNsG4ObfTtAyiPFvD610rEjF";

var server = app.listen(server_port, server_ip_address, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server started at host: ' + host);
    console.log('Server started at port: ' + port);
    var j = schedule.scheduleJob('*/2 * * * *', function() {
        console.log('Job Started at: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
        updateStepSizeForBinance();
        // getLowestRateCoin();
        getLowestRateCoinBinance();
        getExchangeList()
            .then(function(data) {
                getAllCoinsFromAPI()
                    .then(function(data) {
                        matchCoins();
                    }).catch(function(error) {
                        throw err;
                    });
            }).catch(function(error) {
                throw err;
            });
    });

    // var k = schedule.scheduleJob('*/1 * * * *', function() {
    //     console.log('Lowest Price Job Started at: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
    // });

    var dayJob = schedule.scheduleJob('00 00 12 * * 1-7', function() {
        var mailOptionsForJobStatus = {
            from: 'danny.uttarwar.crypto@gmail.com',
            to: 'danny.uttarwar.crypto@gmail.com ,sakteparpushkar704@gmail.com',
            subject: 'Job is running',
            text: ''
        };
        transporter.sendMail(mailOptionsForJobStatus, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });

});

var exchangeList = {};
var exchangeArray = [];
var previousLowPriceCoins = [];
var previousLowPriceCoinsBinance = [];

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danny.uttarwar.crypto@gmail.com',
        pass: 'Danny@132'
    }
});

function sendNotification(title, text, destination) {
    var message = {
        "to": destination,
        "notification": {
            "title": title,
            "text": text,
            "sound": "default"
        }
    };

    var postData = JSON.stringify(message);
    var options = {
        hostname: 'fcm.googleapis.com',
        path: '/fcm/send',
        method: 'POST',
        headers: {
            'Content-Length': postData.length,
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'key=' + key
        }
    };

    var requestHttp = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(chunk);
        });
        res.on('error', function(e) {
            console.log('error:' + e.message);
        });
    });
    requestHttp.write(postData);
    requestHttp.end();

    requestHttp.on('error', function(e) {
        console.log(e);
    });

}

var mailOptions = {
    from: 'danny.uttarwar.crypto@gmail.com',
    to: 'dnyaneshwar.uttarwar@zconsolutions.com, danny.uttarwar.crypto@gmail.com ,sakteparpushkar704@gmail.com',
    subject: 'Alert: New Coin Added',
    text: 'That was easy!'
};

function getLowestRateCoin() {
    Request = unirest.get('https://bittrex.com/api/v1.1/public/getmarketsummaries');
    Request.header('Content-Type', 'application/json').end(function(data) {
        var coinList = data.body.result;
        var newCoinList = [];
        for (var i = 0; i < coinList.length; i++) {
            var element = coinList[i];
            var splitCoin = element.MarketName.split('-');
            if (splitCoin[0] == 'BTC') {
                element.VolumeInBtc = element.Volume * element.Last;
                if (element.VolumeInBtc > 150) {
                    element.CoinName = splitCoin[1];
                    var maxPercentPriceDiff = (element.Low + ((element.Low * 9) / 100)).toFixed(8);
                    maxPercentPriceDiff = Number.parseFloat(maxPercentPriceDiff);
                    if (element.High >= maxPercentPriceDiff) {
                        element.NearAboutLowPrice = (element.Low + ((element.Low * 1) / 100)).toFixed(8);
                        element.NearAboutLowPrice = Number.parseFloat(element.NearAboutLowPrice);
                        if (element.Last <= element.NearAboutLowPrice) {
                            newCoinList.push(element);
                        }
                    }
                }
            }
        }
        var mailOptions1 = {
            from: 'danny.uttarwar.crypto@gmail.com',
            to: 'danny.uttarwar.crypto@gmail.com',
            subject: 'Alert: New Coin Added Bittrex',
            text: 'That was easy!'
        };

        function findByMatchingCoins(coin) {
            for (var k = 0; k < previousLowPriceCoins.length; k++) {
                if (previousLowPriceCoins[k].CoinName == coin.CoinName) {
                    return true;
                }
            }
            return false;
        }
        var flag = false;
        if (newCoinList.length > 0) {
            if (previousLowPriceCoins.length == 0) {
                previousLowPriceCoins = newCoinList;
                flag = true;
            } else {
                for (var j = 0; j < newCoinList.length; j++) {
                    if (!findByMatchingCoins(newCoinList[j])) {
                        previousLowPriceCoins = newCoinList;
                        flag = true;
                        break;
                    }
                }
            }
        }
        if (flag) {
            var mailBody = '';
            mailOptions1.subject = 'Low Rate Coin: Bittrex';
            mailBody = '';
            for (var j = 0; j < newCoinList.length; j++) {
                mailOptions1.subject += newCoinList[j].CoinName + ", ";
                mailBody += "Name: " + newCoinList[j].CoinName + " High: " + newCoinList[j].High.toString() + " Low: " + newCoinList[j].Low.toString() + " Last: " + newCoinList[j].Last.toString() + " Volume: " + newCoinList[j].VolumeInBtc.toString() + "\n \n";
                console.log("Name: " + newCoinList[j].CoinName + " High: " + newCoinList[j].High.toString() + " Low: " + newCoinList[j].Low.toString() + " Last: " + newCoinList[j].Last.toString() + " Volume: " + newCoinList[j].VolumeInBtc.toString() + "\n \n");
            }
            mailOptions1.text = mailBody;
            transporter.sendMail(mailOptions1, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            var analysis = {};
            analysis.exchange = "Bittrex";
            analysis.type = "lowRateCoin";
            analysis.title = mailOptions1.subject;
            analysis.body = mailBody;
            analysis.lowRateCoins = [];
            for (var j = 0; j < newCoinList.length; j++) {
                var coin = {};
                coin.coinName = newCoinList[j].CoinName;
                coin.lowPrice = newCoinList[j].Low;
                coin.highPrice = newCoinList[j].High;
                coin.lastPrice = newCoinList[j].Last;
                coin.volume = newCoinList[j].VolumeInBtc;
                analysis.lowRateCoins.push(coin);
            }
            var refCoin = db.ref('/notifications');
            refCoin.push(analysis);
            // var fcmToken = ["cRK1Fj7-t6U:APA91bHsfitXHO_KuvLkl1R3FVA0-4AO38Ai2Tm2JcJhO5U5elgV4b-bnLq32BJnFbpZ9aEjiId_ayjEyiIr2SX7zFdVBBR5bW9HSqhW9tmFhl-zzE_TBJJOCQnZrUjH7RE3QOh9oFVc"];

            // for (var index = 0; index < fcmToken.length; index++) {
            //     sendNotification(mailOptions1.subject, mailBody, fcmToken[i]);
            // }
        } else {
            console.log('No: Low Rate coins');
        }
    });
}

function getLowestRateCoinBinance() {
    Request = unirest.get('https://www.binance.com/api/v1/ticker/24hr');
    Request.header('Content-Type', 'application/json').end(function(data) {
        var coinList = data.body;
        var newCoinList = [];
        for (var i = 0; i < coinList.length; i++) {
            var element = coinList[i];
            var splitCoin = element.symbol.substr(element.symbol.length - 3);
            if (splitCoin == 'BTC') {
                if (element.quoteVolume > 200) {
                    element.CoinName = element.symbol.replace(splitCoin, '');
                    element.lowPrice = Number.parseFloat(element.lowPrice);
                    element.highPrice = Number.parseFloat(element.highPrice);
                    element.lastPrice = Number.parseFloat(element.lastPrice);
                    element.quoteVolume = Number.parseFloat(element.quoteVolume);
                    var maxPercentPriceDiff = (element.lowPrice + ((element.lowPrice * 9) / 100)).toFixed(8);
                    maxPercentPriceDiff = Number.parseFloat(maxPercentPriceDiff);
                    if (element.highPrice >= maxPercentPriceDiff) {
                        element.NearAboutLowPrice = (element.lowPrice + ((element.lowPrice * 1) / 100)).toFixed(8);
                        element.NearAboutLowPrice = Number.parseFloat(element.NearAboutLowPrice);
                        if (element.lastPrice <= element.NearAboutLowPrice) {
                            newCoinList.push(element);
                        }
                    }
                }
            }
        }
        var mailOptions1 = {
            from: 'danny.uttarwar.crypto@gmail.com',
            to: 'danny.uttarwar.crypto@gmail.com',
            subject: 'Alert: New Coin Added Binance',
            text: 'That was easy!'
        };

        function findByMatchingCoinsBinance(coin) {
            for (var k = 0; k < previousLowPriceCoinsBinance.length; k++) {
                if (previousLowPriceCoinsBinance[k].CoinName == coin.CoinName) {
                    return true;
                }
            }
            return false;
        }
        var flag = false;
        if (newCoinList.length > 0) {
            if (previousLowPriceCoinsBinance.length == 0) {
                previousLowPriceCoinsBinance = newCoinList;
                flag = true;
            } else {
                for (var j = 0; j < newCoinList.length; j++) {
                    if (!findByMatchingCoinsBinance(newCoinList[j])) {
                        previousLowPriceCoinsBinance = newCoinList;
                        flag = true;
                        break;
                    }
                }
            }
        }
        if (flag) {
            var mailBody = '';
            mailOptions1.subject = 'Low Rate Coin: Binance: ';
            mailBody = '';
            var notificationTitle = "Binance: ";
            var notificationBody = "";
            for (var j = 0; j < newCoinList.length; j++) {
                mailOptions1.subject += newCoinList[j].CoinName;
                notificationTitle += newCoinList[j].CoinName;
                mailBody += "Name: " + newCoinList[j].CoinName + " High: " + newCoinList[j].highPrice.toString() + " Low: " + newCoinList[j].lowPrice.toString() + " Last: " + newCoinList[j].lastPrice.toString() + " Volume: " + newCoinList[j].quoteVolume.toString();
                notificationBody += "<b>" + newCoinList[j].CoinName + "</b>: H: " + newCoinList[j].highPrice.toString() + " Lo: " + newCoinList[j].lowPrice.toString() + " La: " + newCoinList[j].lastPrice.toString() + " V: " + Number.parseInt(newCoinList[j].quoteVolume);
                console.log("Name: " + newCoinList[j].CoinName + " High: " + newCoinList[j].highPrice.toString() + " Low: " + newCoinList[j].lowPrice.toString() + " Last: " + newCoinList[j].lastPrice.toString() + " Volume: " + newCoinList[j].quoteVolume.toString() + "\n \n");
                if (j !== newCoinList.length - 1) {
                    mailOptions1.subject += ", ";
                    notificationTitle += ", ";
                    mailBody += "\n \n";
                    notificationBody += "<br/> <br/>";
                }
                if (j == newCoinList.length - 1) {
                    notificationTitle += "  (" + moment().utcOffset("+05:30").format('hh:mm A D MMMM') + ")";
                }
            }
            mailOptions1.text = mailBody;
            // transporter.sendMail(mailOptions1, function(error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
            var analysis = {};
            analysis.exchange = "Binance";
            analysis.type = "lowRateCoin";
            analysis.title = notificationTitle;
            analysis.body = notificationBody;
            analysis.lowRateCoins = [];
            for (var j = 0; j < newCoinList.length; j++) {
                var coin = {};
                coin.coinName = newCoinList[j].CoinName;
                coin.lowPrice = newCoinList[j].lowPrice;
                coin.highPrice = newCoinList[j].highPrice;
                coin.lastPrice = newCoinList[j].lastPrice;
                coin.volume = newCoinList[j].volume;
                analysis.lowRateCoins.push(coin);
            }
            var refCoin = db.ref('/notifications');
            refCoin.push(analysis);
            var fcmToken = ["cRK1Fj7-t6U:APA91bHsfitXHO_KuvLkl1R3FVA0-4AO38Ai2Tm2JcJhO5U5elgV4b-bnLq32BJnFbpZ9aEjiId_ayjEyiIr2SX7zFdVBBR5bW9HSqhW9tmFhl-zzE_TBJJOCQnZrUjH7RE3QOh9oFVc"];

            for (var index = 0; index < fcmToken.length; index++) {
                sendNotification(notificationTitle, mailBody, fcmToken[index]);
            }
        } else {
            console.log('No: Low Rate coins');
        }
    });
}

function updateStepSizeForBinance() {
    console.log('update binance step size: start');
    getExchangeList()
        .then(function(data) {
            var list = data;
            var Request = unirest.get('https://www.binance.com/api/v1/exchangeInfo');
            Request.header('Content-Type', 'application/json').end(function(exchangeInfo) {
                if (exchangeInfo && exchangeInfo.body && exchangeInfo.body.symbols && list) {
                    var symbols = exchangeInfo.body.symbols;
                    console.log('update binance step size: end');
                    for (var coinKey in list['binance'].coins) {
                        var market = coinKey + 'BTC';
                        for (var obj of symbols) {
                            if (obj.symbol === market) {
                                for (var filter of obj.filters) {
                                    if (filter.filterType == "LOT_SIZE") {
                                        list['binance'].coins[coinKey].stepSize = filter.stepSize;
                                    }
                                }
                            }
                        }
                    }
                    var refCoin = db.ref('/exchange/binance/coins');
                    refCoin.update(list['binance'].coins);
                }
            });
        }).catch(function(error) {
            throw err;
        });
}

function getExchangeList() {
    return new Promise(function(resolve, reject) {
        var allExchangeRef = db.ref('/exchange');
        allExchangeRef.on("value", function(snapshot) {
            exchangeList = snapshot.val();
            resolve(exchangeList);
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
            reject(errorObject);
        });
    });
}

function getCoinsFromAPI(exchange, key) {
    return new Promise(function(resolve, reject) {
        var Request = unirest.get(exchange.exchangeUrl);
        Request.header('Content-Type', 'application/json').end(function(response) {
            exchangeList[key].coinsFromAPI = {};
            var i = 0;
            var list = [];
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (exchange.name === 'bittrex' && exchange.isActive) {
                list = response.body.result;
                for (i = 0, iLen = list.length; i < iLen; i++) {
                    if (!format.test(list[i].Currency)) {
                        exchangeList[key].coinsFromAPI[list[i].Currency] = {};
                        exchangeList[key].coinsFromAPI[list[i].Currency].exchangeName = exchange.name;
                        exchangeList[key].coinsFromAPI[list[i].Currency].name = list[i].CurrencyLong;
                        exchangeList[key].coinsFromAPI[list[i].Currency].code = list[i].Currency;
                        exchangeList[key].coinsFromAPI[list[i].Currency].pair = '';
                        exchangeList[key].coinsFromAPI[list[i].Currency].baseName = list[i].CoinType;
                        exchangeList[key].coinsFromAPI[list[i].Currency].baseCode = '';
                    }
                }
            } else if (exchange.name === 'kucoin' && exchange.isActive) {
                list = response.body.data;
                for (i = 0, iLen = list.length; i < iLen; i++) {
                    if (!format.test(list[i].coinType)) {
                        exchangeList[key].coinsFromAPI[list[i].coinType] = {};
                        exchangeList[key].coinsFromAPI[list[i].coinType].exchangeName = exchange.name;
                        exchangeList[key].coinsFromAPI[list[i].coinType].name = '';
                        exchangeList[key].coinsFromAPI[list[i].coinType].code = list[i].coinType;
                        exchangeList[key].coinsFromAPI[list[i].coinType].pair = list[i].symbol;
                        exchangeList[key].coinsFromAPI[list[i].coinType].baseName = '';
                        exchangeList[key].coinsFromAPI[list[i].coinType].baseCode = list[i].coinTypePair;
                    }
                }
            } else if (exchange.name === 'binance' && exchange.isActive) {
                if (response && response.body && response.body.data) {
                    list = response.body.data;
                    for (i = 0, iLen = list.length; i < iLen; i++) {
                        if (!format.test(list[i].baseAsset)) {
                            exchangeList[key].coinsFromAPI[list[i].baseAsset] = {};
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].exchangeName = exchange.name;
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].name = list[i].baseAssetName;
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].code = list[i].baseAsset;
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].pair = list[i].symbol;
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].baseName = list[i].quoteAssetName;
                            exchangeList[key].coinsFromAPI[list[i].baseAsset].baseCode = list[i].quoteAsset;
                        }
                    }
                }
            } else if (exchange.name === 'cryptopia' && exchange.isActive) {
                if (response && response.body && response.body.Data) {
                    list = response.body.Data;
                    for (i = 0, iLen = list.length; i < iLen; i++) {
                        if (list[i].BaseSymbol == 'BTC' && !format.test(list[i].Symbol)) {
                            exchangeList[key].coinsFromAPI[list[i].Symbol] = {};
                            exchangeList[key].coinsFromAPI[list[i].Symbol].exchangeName = exchange.name;
                            exchangeList[key].coinsFromAPI[list[i].Symbol].name = list[i].Currency;
                            exchangeList[key].coinsFromAPI[list[i].Symbol].code = list[i].Symbol;
                            exchangeList[key].coinsFromAPI[list[i].Symbol].pair = list[i].Label;
                            exchangeList[key].coinsFromAPI[list[i].Symbol].baseName = list[i].BaseCurrency;
                            exchangeList[key].coinsFromAPI[list[i].Symbol].baseCode = list[i].BaseSymbol;
                        }
                    }
                }
            } else if (exchange.name === 'yobit' && exchange.isActive) {
                if (response && response.body) {
                    var body = JSON.parse(response.body);
                    if (body) {
                        var list = body.pairs;
                        for (var pairKey in list) {
                            var splitList = pairKey.split('_');
                            if (splitList[1] == 'btc') {
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()] = {};
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].exchangeName = exchange.name;
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].name = splitList[0].toUpperCase();
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].code = splitList[0].toUpperCase();
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].pair = pairKey;
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].baseName = 'bitcoin';
                                exchangeList[key].coinsFromAPI[splitList[0].toUpperCase()].baseCode = splitList[1].toUpperCase();
                            }
                        }
                    }
                }
            }
            resolve(response);
        });
    });
}

function getAllCoinsFromAPI() {
    return new Promise(function(resolve, reject) {
        var allCoinsFromAPIPromises = [];
        for (var key in exchangeList) {
            allCoinsFromAPIPromises.push(getCoinsFromAPI(exchangeList[key], key));
        }

        Promise.all(allCoinsFromAPIPromises)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

function checkCoinExist(coin, existingCoinListKeys, exchangeObj) {
    if (existingCoinListKeys.indexOf(coin.code) == -1) {
        return true;
    }
}

function matchCoins() {
    var promises = [];
    for (var key in exchangeList) {
        var keys = Object.keys(exchangeList[key].coins);
        var exch = exchangeList[key];
        exchangeList[key].newCoins = {};
        for (var childKey in exchangeList[key].coinsFromAPI) {
            if (checkCoinExist(exchangeList[key].coinsFromAPI[childKey], keys, exch)) {
                exchangeList[key].newCoins[childKey] = exchangeList[key].coinsFromAPI[childKey];
            }
        }
    }

    var mailBody = '';
    mailOptions.subject = 'Alert: New Coin Added on: ';
    for (var exeKey in exchangeList) {
        if (Object.keys(exchangeList[exeKey].newCoins).length > 0) {
            mailBody = '';
            mailBody = 'New Coin Added On Exchange \n \t' + exeKey + '\n \t\t';
            mailBody = mailBody + Object.keys(exchangeList[exeKey].newCoins);
            mailOptions.text = mailBody;
            mailOptions.subject = mailOptions.subject + exeKey + ': ' + Object.keys(exchangeList[exeKey].newCoins);
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            var refCoin = db.ref('/exchange/' + exeKey + '/coins');
            refCoin.update(exchangeList[exeKey].newCoins);
        }
    }
    console.log('done schedule');
}