| Action                        | Method | Link                                              |
| ----------------------------- | ------ | ------------------------------------------------- |
| Create new user               | POST   | /api/newuser/:passportID                          |
| Deposit cash in user          | PUT    | /api/deposit/:passportID/:cash                    |
| Update credit in user         | PUT    | /api/credit/:passportID/:credit                   |
| Transfer cash between 2 users | PUT    | /api/transfer/:fromPassportID/:cash/:toPassportID |
| Withdraw cash from user       | PUT    | /api/withdraw/:passportID/:cash                   |
| Get all users                 | GET    | /api/users                                        |
| Get user                      | GET    | /api/user/:passportID                             |
