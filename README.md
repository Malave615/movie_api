My Movie API
This is a backend, or server side, application for a movie api. It was developed using Node.js and Express. The app provides users with information about different movies, directors and movie genres. It allows users to register an account with a username and password, search for movies by title, genre or director and also allows users to create a list of favorite movies.

Dependecies
_ Node.js
_ Express
_ body-parser
_ lodash
_ uuid
_ Morgan

Endpoints
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
