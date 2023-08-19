import express from 'express'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import fs from 'fs'

const app = express()
const port = 3000;

var db, cdb;

(async () => {
    db = await open({
        filename: './mesa.db',
        driver: sqlite3.Database
    })
})()

app.get('/create-card/:suffix/:delimiter/:pinDelimiter/:currency/:cardValue/:cardHolder/:cardIssuer/:alias', (req, res) => {
    var suffix = req.params.suffix, delimiter = req.params.delimiter, pinDelimiter = req.params.pinDelimiter, currency = req.params.currency, cardValue = parseInt(req.params.cardValue), cardHolder = req.params.cardHolder, cardIssuer = req.params.cardIssuer, alias = req.params.alias;

    var cardUUID = `${cardHolder}-${cardIssuer}`

    if (delimiter = 'setThisAsDot') {
        delimiter = '.'
    }

    var cardMap = [];
    for (let index = 1; index < cardValue+1; ++index) {
        const pin = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
        const part1 = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();
        const part2 = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();
        const part3 = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();
        const part4 = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();
        cardMap.push(`${suffix}${delimiter}${part1}${delimiter}${part2}${delimiter}${part3}${delimiter}${part4}${delimiter}${cardUUID}${pinDelimiter}${pin}${pinDelimiter}${currency}${index}${pinDelimiter}${alias}`)
    }

    const finalCard = cardMap[cardMap.length - 1].split('!');

    db.exec(`INSERT INTO cards VALUES ("${finalCard[0]}","${finalCard[1]}","${finalCard[2]}", "${finalCard[3]}")`)

    cardMap = cardMap.pop()

    // Get the IP of the client
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // replaced req.connection -> req.socket due to req.connection deprecation

    // Log the IP and the card alias
    fs.writeFileSync('mesa.db.log', `${ip} - Created ${finalCard}\n`, (err) => {
        if (err) throw err;
    });
    console.log(`${ip} - Created ${finalCard}\n`)

    res.send(finalCard)
})

app.get('/get-value/:cardAlias', async (req, res) => {
    try {
        // Get card alias
        var cardAlias = req.params.cardAlias;

        // Get card value
        const cardValueResult = await db.get('SELECT value FROM cards WHERE alias = ?', [cardAlias]);
        
        if (cardValueResult) {
            const cardValue = cardValueResult.value;
            res.send({ cValue: cardValue, cAlias: cardAlias });
        } else {
            res.status(404).send('Card not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/update-value/:cardAlias/:newValue', async (req, res) => {
    try {
        // Get card alias and new value from the request parameters
        const cardAlias = req.params.cardAlias;
        const newValue = req.params.newValue;

        // Update card value in the database
        await db.exec(`UPDATE cards SET value = "${newValue}" WHERE alias = "${cardAlias}"`);

        res.send(`Card value for alias "${cardAlias}" updated to ${newValue}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => console.log('listening'))
