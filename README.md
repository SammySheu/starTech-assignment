### Task:
- [x] Create an API to upload and share images by user.
- [x] Implement email and password authentication and authorization on the api.
- [x] A user can have multiple images.
- [x] Users can add or delete images.
- [x] Images can be set to public or private.
- [x] Use good development practices like documentation.

### How to use? 
1. Clone this project into local machine and make sure docker is running on you back. Type below command under root folder.
```Shell
docker-compose up --build
```
docker-compose would have 2 containers running on the back (mysql_container & express_container). The Server is on
```
http://127.0.0.1:3000/{endpoints_provided_below}
```

2. There are 6 API endpoints which could complete above tasks. 
<img width="650" alt="截圖 2023-01-08 下午12 45 19" src="https://user-images.githubusercontent.com/43340166/211180796-920a783b-475d-4a7d-97e5-ac7e29141b5d.png">

 - [POST]'/register'         --> With email and password provided, user could have their information in MySQL database
 - [POST]'/login'            --> With email and password provided, user could get the token if their datas are in database
 - [POST]'/uploadPicture'    --> Token is needed. User could upload their picture and default of isPrivate set to TRUE. 
 - [POST]'/setPrivate'       --> Token is needed. Frontend should also provide two parameters (picture_id and setPrivate) so backend could update picture information
 - [POST]'/deletePicture'    --> Token is needed. User could delete their photos with certain picture_id provided.
 - [POST]'/personalPage'     --> It is a public endpoint. Frontend could get certain user's public pictures if the user's ID is provided.

3. OpenAPI Spec was saved as yaml file in root folder.
