<h1 align="center"> Habitly </h1>
<p align="center">
	<a href="#using-docker-recommended">Quick Install (docker)</a> |
	<a href="#about">About</a> |
	<a href="#features">Features</a> |
	<a href="#authors">Authors</a>
</p>

<p align="center">A fully featured, full-stack web app that helps users build atomic habits.</p>

## About

Habitly is a full-stack web app that helps users keep track of their daily habits, build healthy atomic habits and get rid of unhealthy ones. This project was inspired by the famous book [Atomic Habits](https://jamesclear.com/atomic-habits) by James Clear.
The primary ideas that are behind this app are the followings;
- **Habits**: Keeping a track of your healthy and unhealthy habits daily helps you maintain healthy atomic habits and get rid of bad ones.
- **Implementation Intentions**: Intending to do a task (or repeat a habit) at a specific time/location and writing the intention down increases your chances of completing it.
- **Habit Stacking**: Stacking a new habit with an existing habit helps you turn the new habit into an atomic habit easily.
- **Habit Repetitions**: Keeping a track of your habit repetitions gives you evidence in the past which helps in maintaining healthy habits and getting rid of unhealthy ones.
- **Habit Streaks**: Seeing that streak number increment is quite motivating and gives you chills.

This repository consists of a SPA frontend powered by [VueJS 3](https://v3.vuejs.org/) and a RESTful backend powered by [Django 3.2](https://docs.djangoproject.com/en/3.2/) and [Django Rest Framework](https://www.django-rest-framework.org).

## Features
Everything that you need to maintain healthy habits and get rid of bad ones is what habitly is all about. It has a beautiful frontend user interface built using [Bootstrap 5.0](https://getbootstrap.com/docs/5.0) and [SCSS](https://sass-lang.com/). The RESTful API that the frontend SPA consumes is built using Django Rest Serializers.

Authentication and authorization is done using [jwt](https://jwt.io/) tokens and handled using [Auth0](https://auth0.com/). [Auth0 SPA JS](https://github.com/auth0/auth0-spa-js) was used in the frontend authentication service.

The jwt tokens aren't stored in local storage or cookies but rather auth0 server sessions are used to persist user logins. Tokens are silently refreshed by Auth0-SPA-JS (a redirect is required when running in localhost).
The frontend Single Page APP consists of the following main views and components;
- **Home**
	- Today's intentions.
	- Check intention (Set it to done)
	- Top five streaked habits.
	- Top five repeated habits.
- **Habits**
	- Create habit
	- Good habits
	- Bad habits
	- Checkbox (Add today's habit repetition)
- **HabitDetail**
	- Edit habit
	- Delete habit
	- Habit model details
	- Repetition
- **Stacks**
	- Create stack
	- Delete stack
	- Paragraph view
	- Table view
- **Intentions**
	- Create/edit intention
	- Delete intention
	- Check intention (Set it to done)
	- Paragraph view
	- Table view
	- Completed intentions view

Also, there are tooltips to help the user understand the concept.

And that's about it. Hope this convinces you to give it a try (have added docker-compose for you!) 😉. 



## Installation

These instructions will get you a copy of this project running on your local machine in dev mode.

Note: For demo purpose I have places `frontend/auth_config.json` and `backend/auth_config.py` which uses my auth0 tenant that I created for demo purposes. Consider changing these files if you ever end up deploying this web app.

### Using Docker (recommended)

**Prerequisites:**

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker-Compose](https://docs.docker.com/compose/install/)
- A command line interface (use git-bash in windows please)

**Cloning repository:**

Start by cloning the repository on your local machine using git:

```
git clone https://github.com/0xaliraza/habitly
```

Change directory to the project folder:

```
cd habitly
```

Build and run using docker-compose in detached mode

```
docker-compose up -d
```

Running the above commands will give you the following instances;
- *Backend Django app* running at http://localhost:8000/
- *Frontend Vue 3 app* served (hot-reload enabled 😌) at http://localhost:8080/
- *PHPMyAdmin*(just for your convenience 😉) running at http://localhost:8081/

The database is persisted using a docker volume so you won't ever lose your databases.
Also, by now, a database user with the username  `habitly` and password `password` is already created in django. Visit http://localhost:8000/admin and interact with all the models.

Note: Ports used by above instances might already be busy in your machine so make sure you stop already running services or change `docker-compose.yml` according to your needs.

### Manually Serving Django and Vue JS

**Prerequisites:**

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Python3](https://www.python.org/downloads/)
- [Pip3](https://pypi.org/project/pip/)
- [Node.js](https://nodejs.org/en/)
- [Venv](https://docs.python.org/3/library/venv.html)
- A database management system such as SQLite or MySQL
- A command line interface (use git-bash in windows please)

**Cloning repository**

Start by cloning the repository on your local machine using git

```
git clone https://github.com/0xaliraza/habitly
```

Change directory to the project folder

```
cd habitly
```

**Serving django backend**

Change directory to backend

```
cd backend
```
Now create a virtual environment
```
python3 -m venv venv
```

Activate the virtual environment
```
source venv/bin/activate
```
Install requirements 
```
pip3 -r requirements.txt
```
Run the django migrations

Now, open `settings.py` file in your favorite text editor and customize the following defaults according to your needs
```
DATABASES  = {
'default': {
'ENGINE': 'django.db.backends.mysql',
'NAME': 'habitly',
'USER': 'root',
'PASSWORD': 'password', # Default password in `docker-compose.yml` is 'password'
'HOST': 'db', # Docker container's name is 'db'
'PORT': '3306',
}
}
```

Run the migrations
```
./manage.py migrate
```
Finally, serve the django backend
```
./manage.py runserver
```
Congo, the backend is live at http://localhost:8000, but wait, let's serve the frontend now...

**Serving Vue JS frontend**

Now change directory to frontend
```
cd ../frontend
```
Install dependencies and serve

**Using yarn**

```
yarn install && yarn serve
```

**Using npm**
```
npm install && npm run serve
```

Cheers, your frontend is live at http://localhost:8080, go visit and login using `demo-user` as both username and password.



## Authors

[Ali Raza](https://0xali.com) (me) **🙃**

## Find Me Online

Feel free to contact me for any kind of help or information. Let's get connected! :)

- [Website](https://0xali.com)

- [Github](https://github.com/0xaliraza)

- [Twitter](https://twitter.com/0xaliraza)

- [Medium](https://0xali.medium.com)

- [Linkedin](https://www.linkedin.com/in/ali-raza-061130202/)

## License
See the [LICENSE](https://github.com/0xAliRaza/habitly/blob/master/LICENSE) file for license rights and limitations (MIT).