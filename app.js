const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { time } = require("console");
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
function getCurrentDateTime() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const now = new Date();
  const month = months[now.getMonth()];
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const dateTimeString = `${month} ${day}, ${formattedHours}:${formattedMinutes}${period}`;

  return dateTimeString;
}

const currentDateTime = getCurrentDateTime();


app.post("/", function(req, res) {
  console.log("Post Received");




  const query = req.body.cityNm;
  const apiKey = "defeca1a5e37fe234308d74517577d23";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

  https.get(url, function(response) {
    console.log(response);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const feels_like = weatherData.main.feels_like;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
      const country = weatherData.sys.country;
      const sunrise = weatherData.sys.sunrise;
      const sunset = weatherData.sys.sunset;
      
      const windSpeed = weatherData.wind.speed;
      const Visibility = ( weatherData.visibility ) / 1000;
      const pressure = weatherData.main.pressure;
      const cloud = weatherData.cloud;
      console.log(cloud);
      
      
      
      
      

     
   



      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title></title>
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: white;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; 
            background-image: url("new-background.gif");
            background-size: cover;
          }
          
          .weather-container {
            width: 400px; 
            text-align: center;
            background-color: rgba(255, 255, 255, 0.15); 
            backdrop-filter: blur(10px);
            border-radius: 10px; 
            padding: 20px; 
          }
          

            h1 {
              font-size: 32px;
              
            }

            p {
              font-size: 20px;
              margin-bottom: 5px;
              text-align: center;
            }

            img {
              
             padding: 0%;
            }
            .location {
              display: flex;
              align-items: center;
            }
            
            .location h1 {
              display: inline-block;
              margin-right: 10px; 
            }
            
            .location img {
              display: inline-block;
            }
            weather-info {
              display: inline-block;
            }
            p1 {
              display:inline;
               vertical-align:middle;
            }
            
          </style>
        </head>
        <body>
        <div class="weather-container">
        <div class="location">
        
        </div>
        <p> ${currentDateTime} </p>   
        <h1>${query}, ${country}</h1>
        <h1><img src="${iconUrl}" alt="Weather Icon"> ${temp}°C </h1>
        <p> Feels like ${feels_like}°C, ${weatherDescription} </p>
        <div class="weather-info">
          
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed}m/s</p>
          <p>Visibility: ${Visibility} km</p>
          <p>Pressure: ${pressure} hPa</p>
          
          

        </div>
      </div>
        </body>
        </html>
      `;

      res.send(html);
    });
  });
});

app.listen(3000, () => {
  console.log("Server is Running!!");
});


