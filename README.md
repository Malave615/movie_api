# My Movie API

This is a backend, or server-side component, of a movies web application. It is a REST API that was developed using Node.js and Express, written in JavaScript, and interacts with a database that stores the data about the movies.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Project Dependencies](#project-dependencies)
4. [Setup and Installation](#setup-and-installation)
5. [Endpoints](#endpoints)
6. [Testing](#testing)
7. [Author](#author)

## Project Overview

The app provides users with information about different movies, directors and movie genres. It allows users to register an account with a username and password, search for movies by title, genre or director and also allows users to create a list of favorite movies.

## Features

Feature #1: Return a list of all movies to the user
Feature #2: Return data (description, genre, director, image) about a single movie by title to the user
Feature #3: Return data about a genre (description) by the name/title
Feature #4: Return data about a director (bio, birth year) by name
Feature #5: Allow users to see which actors are in each movie
Feature #6: Allow new users to register
Feature #7: Allow users to update their user info
Feature #8: Allow users to add a movie to their list of favorites
Feature #9: Allow users to remove a movie from their list of favorites
Feature #10: Allow exisiting users to deregister

## Project Dependecies

_ Node.js
_ Express
_ body-parser
_ lodash
_ uuid
_ Morgan
_ MongoDB
_ Mongoose
\_ Postman

## Setup And Installation

1. **Make sure your OS is up to date**
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/Malave615/movie_api
   ```
3. **Navigate to the Project Folder**:
   ```bash
   cd movie_api
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Start Developement Server**:
   ```bash
   npm start
   ```

## Endpoints

POST User Login
_ URL: /login
_ Request body: A JSON object with a user name and password, structured as follows:
{ 'Username': '{username}', 'Password': '{Password}' } \* Response body: JWT Authentication token <br />
'token': '######'

    POST Register a New User
        * URL: /users
        * Request body: A JSON object holding user data to add structured as follows:
                            { 'Name': 'John Doe",<br />
                            'Username': '{username}',<br />
                            'Email': '{email@example.com}',<br />
                            'Birthday': 'MM-DD-YYYY' }
        * Response body: A JSON object containing data about the user that was added:
                            { '_id': '######',<br />
                            'Name': 'John Doe',<br />
                            'Username': '{username}',<br />
                            'Email': {email@exapmle.com},<br />
                            'Birthday': 'MM-DD-YYYY',<br />
                            'token': '######' }

    GET List of All Movies
        * URL: /movies
        * Request body: None
        * Response body: An array of JSON objects with data about all movies in the database.

    GET Movie by Title
        * URL: /movies/{Title}
        * Request body: {Title}
        * Response body: A JSON object with data about the requested movie including release year, director and genre.

    GET Movies by Genre
        * URL: /movies/genres/{genreName}
        * Request body: {genreName}
        * Response body: An array of JSON objects with data about all the movies that match the requested genre.

    GET Data about a Director
        * URL: /movies/directors/{Name}
        * Request body: {Name}
        * Response body: A JSON object with data about the requested director including bio and birth and death years.

    PUT A Movie in User Favorites
        * URL: /users/{Username}/movies/{movieID}
        * Request body: None
        * Respons body: A text message indicating whether the movie was successfully added to the user's favorites list.

    DELETE A Movie from User Favorites
        * URL: /users/{Username}/movies/{movieID}
        * Request body: None
        * Response body: A text message indicating whether the movie was successfully removed from the user's favorites list.

    PUT Update User Information
        * URL: /users/{Username}
        * Request body: A JSON object with data about the user to update.
        * Response body: A JSON object with data about the user that was updated.

    DELETE User
        * URL: /users/{Username}
        * Request body: None
        * Response body:  A confirmation stating the user has been deleted.

API Reference
Login
Login with user information and return token
URL: /login
Method: POST
Headers: None
Body:
{
"username": "{username}",
"password": "{password}"
}

    Success Response
    Code: 200 ok

## Testing

All endpoints tested using Postman.

## Author

Tracy Malavé
[Github Profile](https://github.com/Malave615)
