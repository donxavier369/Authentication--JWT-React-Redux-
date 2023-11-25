# Authentication--JWT-React-Redux-

##Overview
    The project provide a user authentication system that allows users to login, logout, manage their profile information, and upload their profile image. Its also include an admin page for managing users

##Features
> User Login and Logout
> User profile management
> User profile image uploading
> Admin page for managing users

## Technologies

> Fron-end framework : React-Redux
> Back-end framework : Djago-REST
> Database : PostgreSQL
> Authentication machanism : Json Web Token(JWT)

## Installation

1. Clone The repository
   Open the project folder in text editor
   Open new terminal
   then,
   git clone https://github.com/donxavier369/Authentication--JWT-React-Redux-.git
   

   
2. Install required dependencies, and start the development server and access the applicatioin in your web browser
   
   => Back-end
		   1.create Vertual Enviornment
		   2.activate vertual enviornment
		   3.Navigate to requirement.txt file then,
		   4.pip install -r requirement.txt
		   5.Add Django SECRET_KEY and Database( the name,user and password) in the settings.py file
   	   6.run the command python -> manage.py makemigrations
       7.run the command -> python manage.py migrate
   	   8.run the command -> python manage.py runserver

   => Front-end
   		1. open a new terminal
   		2. navigate to project directory(ie, auth_users)
   		3. run the command -> npm install
   		4. run the commmand -> npm start

	 ## Usage

   User Signup
			1. Go to the Signup Page
			http://localhost:3000/register
			2. Enter your name, email and password
			3. Click the Register button
 
   User Login
			1. Go to the Login page
			http://localhost:3000/login
			2. Enter your username and password
			3. Click the Login button

	User Profile Mangement
			1. Go to your profile page
			http://localhost:3000
			2. Edit your Profile information
			3. Click the save button

	User Profile image uploading
			1. click the Choose image button
			2. Select the image you want to upload
			3. Click the submitt image button

	Admin Page
			1.Create Admin
				 Create Superuser in backend django termainal
						for that,
								type "python manage.py createsuperuser" in the terminal
								Enter the credentials
								click enter
			2. Admin Login
				 Go to the admin login
						http://localhost:3000/admin
				 Enter the admin name and password
				 Click the Login
			3. Admin Dashboard
					Go to admin dashboard
					http://localhost:3000/admin/dashboard
					You can now manage users on the admin page
   					

        

 
  
   			
   		
   
   
