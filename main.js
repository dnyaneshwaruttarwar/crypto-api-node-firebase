var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var unirest = require('unirest');
var squel = require('squel');
var Promise = require('promise');
var escape = require('escape-html');
var firebase = require('firebase-admin');

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

var server = app.listen(server_port, server_ip_address, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server started at host: ' + host);
    console.log('Server started at port: ' + port);

    var j = schedule.scheduleJob('*/10 * * * *', function() {
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
});

var exchangeList = {};
var exchangeArray = [];


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danny.uttarwar.crypto@gmail.com',
        pass: 'Tech145$'
    }
});

var mailOptions = {
    from: 'danny.uttarwar.crypto@gmail.com',
    to: 'dnyaneshwar.uttarwar@zconsolutions.com, uttarwardnyaneshwar@gmail.com ,sakteparpushkar704@gmail.com',
    subject: 'Alert: New Coin Added',
    text: 'That was easy!'
};

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
        console.log(exchange.exchangeUrl);
        var Request = unirest.get(exchange.exchangeUrl);
        Request.header('Content-Type', 'application/json').end(function(response) {
            exchangeList[key].coinsFromAPI = {};
            var i = 0;
            var list = [];
            if (exchange.name === 'bittrex' && exchange.isActive) {
                list = response.body.result;
                for (i = 0, iLen = list.length; i < iLen; i++) {
                    exchangeList[key].coinsFromAPI[list[i].Currency] = {};
                    exchangeList[key].coinsFromAPI[list[i].Currency].exchangeName = exchange.name;
                    exchangeList[key].coinsFromAPI[list[i].Currency].name = list[i].CurrencyLong;
                    exchangeList[key].coinsFromAPI[list[i].Currency].code = list[i].Currency;
                    exchangeList[key].coinsFromAPI[list[i].Currency].pair = '';
                    exchangeList[key].coinsFromAPI[list[i].Currency].baseName = list[i].CoinType;
                    exchangeList[key].coinsFromAPI[list[i].Currency].baseCode = '';
                }
            } else if (exchange.name === 'kucoin' && exchange.isActive) {
                list = response.body.data;
                for (i = 0, iLen = list.length; i < iLen; i++) {
                    exchangeList[key].coinsFromAPI[list[i].coinType] = {};
                    exchangeList[key].coinsFromAPI[list[i].coinType].exchangeName = exchange.name;
                    exchangeList[key].coinsFromAPI[list[i].coinType].name = '';
                    exchangeList[key].coinsFromAPI[list[i].coinType].code = list[i].coinType;
                    exchangeList[key].coinsFromAPI[list[i].coinType].pair = list[i].symbol;
                    exchangeList[key].coinsFromAPI[list[i].coinType].baseName = '';
                    exchangeList[key].coinsFromAPI[list[i].coinType].baseCode = list[i].coinTypePair;
                }
            } else if (exchange.name === 'binance' && exchange.isActive) {
                if (response && response.body && response.body.data) {
                    list = response.body.data;
                    for (i = 0, iLen = list.length; i < iLen; i++) {
                        exchangeList[key].coinsFromAPI[list[i].baseAsset] = {};
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].exchangeName = exchange.name;
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].name = list[i].baseAssetName;
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].code = list[i].baseAsset;
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].pair = list[i].symbol;
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].baseName = list[i].quoteAssetName;
                        exchangeList[key].coinsFromAPI[list[i].baseAsset].baseCode = list[i].quoteAsset;
                    }
                }
            } else if (exchange.name === 'cryptopia' && exchange.isActive) {
                if (response && response.body && response.body.Data) {
                    list = response.body.Data;
                    for (i = 0, iLen = list.length; i < iLen; i++) {
                        if (list[i].BaseSymbol == 'BTC') {
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
    var isNewCoinAdded = false;
    var mailBody = '';
    for (var exeKey in exchangeList) {
        if (Object.keys(exchangeList[exeKey].newCoins).length > 0) {
            mailBody = '';
            mailBody = 'New Coin Added On Exchange \n \t' + exeKey + '\n \t\t';
            mailBody = mailBody + Object.keys(exchangeList[exeKey].newCoins);
            mailOptions.text = mailBody;
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            var refCoin = db.ref('/exchange/' + exeKey + '/coins');
            refCoin.update(exchangeList[exeKey].newCoins);
            isNewCoinAdded = true;
        }
    }
    console.log('done schedule');
    // if (isNewCoinAdded) {
    //     mailOptions.text = mailBody;
    //     transporter.sendMail(mailOptions, function(error, info) {
    //         if (error) {
    //             console.log(error);
    //         } else {
    //             console.log('Email sent: ' + info.response);
    //         }
    //     });
    // }
}