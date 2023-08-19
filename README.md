# MesaCard Backend
> A paysafecard inspired backend

![Static Badge](https://img.shields.io/badge/Made_for-Node.js%20v20.5.1-blue?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/Made_for-NPM_9.8.0-purple?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/Production%20Ready-green?style=for-the-badge)

# Installation
> 1. Download the repository localy
```
$ git https://github.com/xkks-dot-peach/mesa-card-backend.git
```
> 2. Change directory to the `mesa-card-backend` folder
```
$ cd mesa-card-backend
```
> 3. Install the dependencies needed
```
$ npm i
```
> 4. Run the initialization script
```
$ node init.js
```
> 5. After the initialization script is done, run the webserver
```
$ node .
```

# Endpoints
`/create-card/:suffix/:delimiter/:pinDelimiter/:currency/:cardValue/:cardHolder/:cardIssuer/:alias`
> This endpoint exists to create a new card, for example, to create a new card you can use: `/create-card/MESA/setThisAsDot/!/USD/10/xkks/ImaginaryIssuer/ii01`
> MESA -> Suffix of the card
> setThisAsDot -> Returns ., In case of any other delimiter that is needed, we can use ! or MESAISVERYCOOL
> ! -> Used later to split the string so it can be parsed to the database easier, I recommend always using this.
> USD -> The currency
> 10 -> Amount of said currency
> xkks -> Card holder
> ImaginaryIssuer -> Card Issuer
> ii01 -> Alias, usualy initials of issuer and for example, because this was the first card issued by the issuer, I used 01 after it.
> Returns: Card Info
`/get-value/:cardAlias`
> This endpoint gets how much currency an card has, using the alias.
> Usage example: `/get-value/ii01`
> ii01 -> The alias of the card
> Returns -> Card Currency Amount, Card Alias
`/update-value/:cardAlias/:newValue`
> Updates the amount of currency a card has
> Example usage: `/update-value/ii01/USD20`
> ii01 -> Card Alias
> USD20 -> New amount of currency
