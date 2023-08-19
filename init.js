import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

(async () => {
    db = await open({
        filename: './mesa.db',
        driver: sqlite3.Database
    })

    await db.exec('CREATE TABLE cards (cardnumber, pin, value, alias)')
})()