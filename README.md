# BookVibes

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

BookVibes is an application that allows users to explore and discover books based on different genres. Users can create an account, search for books by author, title, ISBN, or category, and read book descriptions. They can also favorite books to save them for future reading.

## Features

- User authentication: Users can create an account and log in to access the app's features.
- Browse genres: Users can explore books from different genres, such as fiction, non-fiction, mystery, romance, etc.
- Search functionality: Users can search for books by author, title, ISBN, or category.
- Book details: Users can view detailed information about each book, including the author, description, and other relevant details.
- Favorite books: Users can mark books as favorites to create a personalized reading list.

#### API
- pulls from the google books API

## Screenshots
Create an account!

![loginpreview](https://i.imgur.com/2Ucg3Hd.png)

Home Page:

![Homepage](https://i.imgur.com/3AHQEzC.png)

Explore Page: 
- When you get to the explore page with popular genres, you can click on a genre or go directly to the search page by clicking the page button. 

![Explore](https://i.imgur.com/1ydGbXa.png)

Search Page: Here you will search for books. Just input information in any search bar.
![Search](https://i.imgur.com/Y1ms0GA.png)


## How to Install
1. `Fork` and `Clone` this repository in your terminal
   git clone https://github.com/IsaacDatColt/bookVibes

2. Run `npm i` in terminal to install dependencies 
3. Run `sequelize db:migrate` in terminal to setup the database
4. Run `npm start` to connect to the server
5. Open `http://localhost:3000` in your web browser

#### Technologies used

- HTML
- CSS
- JS
- Node.js
- PSQL

#### CSS library
- Bootstrap

#### Node dependencies featured 

- axios
- bcryptjs
- connect-flash
- dotenv
- ejs
- env 
- express
- express-ejs-layouts
- express-session
- method-override
- sequelize 
- supertest


```

```


#### Blockers
- One of my main blockers was finding out that google books api had the book Id as a string and I had my model as an integer.
- Another blocker was pulling information from the api that was inside other objects.

#### Stretch Goals
- Be able to give more organized details about the books when a search is applied.

- Be able to give a "Read" and "Need to read" status and options for user to use.

- Be able to allow user to have and edit more features and details to their profiles.

- Sharability of Book favorites list and communication features with other users.

#### Contributing
Contributions are welcome! Please follow these steps:

-Fork the project.

-Create your feature branch: git checkout -b feature/your-feature.

-Commit your changes: git commit -am 'Add your feature'.

-Push to the branch: git push origin feature/your-feature.

-Submit a pull request.

#### License
This project is licensed under the MIT License. See the LICENSE file for more details.

#### Contact
For any inquiries or feedback, please contact

