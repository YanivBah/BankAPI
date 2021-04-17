# Bank API

Bank API is a API using [Express](https://expressjs.com/) for Node.js.
This API allow to create new users, update them and more.

## Docs

#### Get user / all users
>Method: GET

**URL:** `/bank/users`
This URL will give you all the users.
You can also add `id` query for a specific user. For example: `/bank/users&id=000000000`
---
#### Filter users
>Method: GET

**URL:** `/bank/users/filter`
This URL will give option to filter the users.
Must contain `type` query. For example: `/bank/users/filter&type=minus`
type options | Details | Required
---------|----------|---------
 minus | Will give you all users that in overdraft. | 
 credit | Will give you users with credit higher than... | Must include amount query
 cash | Will give you users with cash higher than... | Must include amount query
---
#### Create new user
>Method: POST

**URL:** `/bank/newuser/:passportID`
This URL will allow you to create new user with a given passport ID.
---
#### Deposit
>Method: PUT

**URL:** `/bank/:passportID/query`
This URL will allow you to deposit money to user with a given passport ID.
Must contain `type` query of `deposit`.
Must contain `cash` query with only numbers.
For example: `/bank/000000000/query?type=deposit&cash=20`
---
#### Update Credit
>Method: PUT

**URL:** `/bank/:passportID/query`
This URL will allow you to update the credit limit of user with a given passport ID.
Must contain `type` query of `credit`.
Must contain `credit` query with only numbers.
For example: `/bank/000000000/query?type=credit&credit=250`
---
#### Transfer money between two users
>Method: PUT

**URL:** `/bank/:passportID/query`
This URL will allow you to transfer money between two users with a given passport ID. 
Must contain `type` query of `transfer`.
Must contain `cash` query with only numbers.
Must contain `to` query with the user ID you want to transfer to.
For example: `/bank/000000000/query?type=transfer&cash=25&to=999999999`
---
#### Withdraw
>Method: PUT

**URL:** `/bank/:passportID/query`
This URL will allow you to withdraw money from a user with a given passport ID. 
Must contain `type` query of `withdraw`.
Must contain `cash` query with only numbers.
For example: `/bank/000000000/query?type=withdraw&cash=100`