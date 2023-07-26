Feed assessment instruction:-

Basic description:-
   In the nodeJs application i had done with typescript based. so here we should need to generate the build first.
   Once build will generate after that exists all the typescript file should be converted to javascript file. then
   only we can able to run the code. In the package.json file i included the file path of the build file in the 
   over the script command in the start i mentioned. So in the this based application will be run.

   Log file should be generate from the dist folder inside logs folder.

   Build Command:-
                 npm run build
   Run command:-
                 npm start
                 
File structures:-
   server.js:-
       server.js is the bootstrap file.which is linked with all over application files.
   Controllers:-
       In the controller folder itself all the controllers files included.
    Models:- 
       In the Model folder itself all the Models files included.
    Router:-
       In the Router folder itself all the Routers files included.
    Util:-
       In the utils folder itself there are three files contained. DB configuration file, Globalfunction file
       and Loghandler file as well.
    .env:-
       In the .env file i wrapped with the important confidential details.
    ER diagram:-
       This is for the clear catch of the database relations.
    Functionality_videos:-
       In this folder i included the all recorded video. Which is the api calls and the functionality.
    dist:-
       In this folder build of the typescript. which is done the all typescript code should be converted to javascript.
    feed_management.sql
       In included the database dump file as well.

Implementation instructions:-
    Majorly i focused on the authentication part based i handle the all for the requirement.
    Actually JWT (jsonwebtoken) i am using for authentication.

    according to the requirement based i created three type of the users. Asper the requirement based i done the
    privileages and access things. i wrapped that.

    Log requirement done as the requirement.

    


    