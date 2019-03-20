# GeoQuiz

## A web-based geography game

### [Click here to play](https://geoquizgame.xyz)


This is my second personal project built with React. It's a web-based geography game inspired by [GeoGuessr](https://geoguessr.com). Users are given an image and must guess which country the image is from. Users can also request more clues, such as capitals, flags, or economic data, to help them with their guesses, but the more clues they ask for, the lower their score will be at the end. 

#### Features

* Fully pannable/zoomable interactive SVG world map

* 3 difficulty modes

* More than 15 categories of clues available, including images (sourced from Flickr), flag, capital, GDP per capita, average temperature, religion, region, total area, language, military spending, and more

* Leaderboards for each individual difficulty mode

* A unique game URL is provided to every user, so they can challenge their friends with the same game they played (e.g. the same group of 5 countries)

* Responsive design

* SSL secured

#### Technologies used

After having some experience with the MERN stack (MongoDB, Express, React, Node) in my first portfolio project [Lowisigh](https://lowishigh.com), I wanted to change things up a little for this project in terms of the tech I used. 

I decided to go with plain old CSS rather than Bootstrap/Material UI or any sort of preprocessor, because I'd heard good things about CSS flexbox and wanted to keep things light.

I stuck with React for the frontend because I wanted to work with the new Hooks API, but I switched over to TypeScript as I'd heard good things and I wanted to get a feel for a strongly typed language. This was a great decision and I'm completely on the TypeScript bandwagon now, it's a blessing to work with in VSCode.

I knew I wanted to switch to a traditional SQL database after messing about with MongoDB and Mongoose for so long, so I studied up on relational databases and the SQL language and settled on SQLite due to its seamless integration into Python.

Finally, for the backend, although I found ExpressJS to be fairly straightforward to work with in my last project, I wanted to get a feel for another backend framework/language. In future I'd like to learn PHP, but I ended up going with Python, which I already had a good amount of experience in, simply due to time constraints. I hadn't ever done any web development related stuff with Python in the past, so it was still something new and fresh for me. I tried Django at first, but found it to be a bit bloated for the task at hand, so I switched over to Flask, which was a much more reasonable choice. 

I wrote the backend REST API first this time around, and tried to write out quite a bit of documentation/pesudocode/charts in a notebook, just to plan things out a bit better and make the whole process of building the app a lot smoother. In my previous project, I found myself having to go back and change things quite a bit because I hadn't thought about certain implementation details or integration with the backend, so I wanted to avoid that kind of thing. I think that went pretty well and I learned a valuable lesson to plan out things in advance when writing code.

The site is hosted on a Linux VPS with gunicorn and nginx.

#### Areas where I think the project could improve

* Initially, the plan for this project was to build a Chinese edition of [GeoGuessr](https://geoguessr.com). I wanted to do this because I really love that website and I think the fact that it's (mostly) missing such a huge, diverse and interesting country as China is a shame. Also, I lived in China for a year, I currently live in Taiwan, and I've studied Chinese for about 3 years, so it seemed like a good chance to combine my skills in a fun and interesting way. Unfortunately, the two main Google Streetview-esque companies in China (Baidu Maps and Tencent/QQ Maps) have quite poor documentation (even for someone who reads Chinese) and are generally a bit lackluster with their APIs. QQ Maps, for example, still uses Flash in some of their maps, and when I tried to submit a request for an API key to Baidu I got a server error. So, in the interest of saving a lot of time and frustration, I decided to just gather a lot of data and photos on countries of the world and make the site that I ended up making. However, I would very much like to at some point add some more game modes.

* As mentioned above, it would be nice to add some more gamemodes, such as US States, Russian Federal Subjects, Chinese provinces, etc. This is something I may look at doing in future, but right now I have other priorities.

* The map is rendered from a Topojson file into SVG by an npm package called react-simple-maps. This is a great little package, but in an ideal world where I had more time I would probably have chosen something else because there were a few issues with the map. For one, it took quite a few tweaks to get the size of the map down to a point that the performance became reasonable when panning, and it's still a bit poor on mobile devices. Furthermore, pinch-to-zoom on mobile or touch screen devices, or even on laptops such as MacBooks, is not supported. There are buttons for zooming provided on the map, and a warning that tells mobile users to use the buttons to zoom, but the feedback I've had from users is that this is bad UX because they have been trained by constant popups on every website to not read warnings and just click 'OK', and in a similar vein they are accustomed to using a pinching motion to zoom in on a map. This is probably priority number 1 when it comes to improving this project, in my opinion.

#### Screenshots

![Screenshot 1](/Screenshot_1.png)

![Screenshot 2](/Screenshot_2.png)

![Screenshot 3](/Screenshot_3.png)

![Screenshot 4](/Screenshot_4.png)

![Screenshot 5](/Screenshot_5.png)
