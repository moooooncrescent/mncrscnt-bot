const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram's token
const token = '1090010566:AAFAFj2nTHan9FzEAisIghmZOyN1PX344wE';

//OpenWeatherMap API key
const appID = '7534816bc12c0c1d48f589302e7335ac';

// OpenWeatherMap endpoint for getting weather by city name
const weatherEndpoint = (city) => (
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`
);

// URL that provides icon according to the weather
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`
);

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true
});

// Function that gets the weather by the city name
const getWeather = (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  axios.get(endpoint).then((resp) => {
    const {
      name,
      main,
      weather,
      wind,
      clouds
    } = resp.data;

    bot.sendPhoto(chatId, weatherIcon(weather[0].icon))
    bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
        parse_mode: "HTML"
      }
    );
  }, error => {
    console.log("error", error);
    bot.sendMessage(
      chatId,
      `К сожалению, город <b>${city}</b> я не могу найти в базе.`, {
        parse_mode: "HTML"
      }
    );
  });
}

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(
      chatId,
      `Пожалуйста, напиши название города`
    );
    return;
  }
  getWeather(chatId, city);
});

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Привет, ознакомься с доступными командами:

/weather <b>название города на английском языке</b> - покажет погоду для выбранного города.
  `, {
      parse_mode: "HTML"
    }
  );
});