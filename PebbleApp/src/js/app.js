var UI = require('ui');
var vibe = require('ui/vibe');
// var Wakeup = require('wakeup');
var Feature = require('platform/feature');
var Vector2 = require('vector2');
// var no_card = new UI.Card();
// var ajax = require('ajax');
// var Timeline = require('timeline');
// var menu = null;

var counter = 1;

watchWind();

function simulate(){
  if(counter > 0)
  {
    counter--;
    
    setTimeout(function (){
      alertWind(5);
    }, 2000);

    setTimeout(function (){
      alertWind(4);
    }, 5000);

    setTimeout(function (){
      alertWind(3);
    }, 6000);

    setTimeout(function (){
      alertWind(2);
    }, 7500);

    setTimeout(function (){
      alertWind(1);
    }, 10000);

    setTimeout(function (){
      alertWind(0);
    }, 15000);
      
  }
}


function watchWind()
{
  var watch_wind = new UI.Window({ 
    backgroundColor: Feature.color('light-gray', 'white')
  });
  
  
  var time_txt_t = new UI.TimeText({
    position: new Vector2(0,15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '%H:%M:%S'
  });
  
  var time_txt_a = new UI.TimeText({
    position: new Vector2(0,50+15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '%A'
  });
  
  var time_txt_d = new UI.TimeText({
    position: new Vector2(0,100+15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '%d-%m-%Y'
  });
  
  watch_wind.add(new UI.Image({
          position: new Vector2(58, 70),
          size: new Vector2(144, 168),
          image: 'images/down.png'
        }));
  
    
  watch_wind.add(time_txt_t);
  watch_wind.add(time_txt_a);
  watch_wind.add(time_txt_d);
  watch_wind.show();
  
  watch_wind.on('click', 'down', function(){
    infoWind();
  });
  
  watch_wind.on('click', 'back', function(){
    simulate();
    watchWind();
  });

}

function infoWind()
{
  var info_wind = new UI.Window({ 
    backgroundColor: Feature.color('light-gray', 'white')
  });
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,15),
    size: new Vector2(144,168),
    font: "gothic-14-bold",
    color: "black",
    textAlign:"center",
    text: 'Aktualny numer'
  }));
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,16+15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '001'
  }));
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,16+30+15+2),
    size: new Vector2(144,168),
    font: "gothic-14-bold",
    color: "black",
    textAlign:"center",
    text: 'Twój numer'
  }));
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,2*16+30+15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '999'
  }));
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,2*16+2*30+15+4),
    size: new Vector2(144,168),
    font: "gothic-14-bold",
    color: "black",
    textAlign:"center",
    text: 'Czas oczekiwania'
  }));
  
  info_wind.add(new UI.Text({
    position: new Vector2(0,3*16+2*30+15),
    size: new Vector2(144,168),
    font: "gothic-28-bold",
    color: "black",
    textAlign:"center",
    text: '2h 50min'
  }));
  
  info_wind.add(new UI.Image({
    position: new Vector2(58, -70),
    size: new Vector2(144, 168),
    image: 'images/up.png'
  }));
    
  info_wind.on('click', 'up', function(){
    watchWind();
  });
  
  info_wind.on('click', 'back', function(){
    simulate();
    infoWind();
  });
  
  info_wind.show();
}

function alertWind(np)
{
  vibe.vibrate('long');
  
  var alert_wind = new UI.Window({ 
    backgroundColor: Feature.color('light-gray', 'white')
  });
  
  if(np != 0)
  {
    alert_wind.add(new UI.Text({
      position: new Vector2(0,15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: 'Pozostało'
    }));
    
    alert_wind.add(new UI.Text({
      position: new Vector2(0,50+15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: np+' osób'
    }));
    
    alert_wind.add(new UI.Text({
      position: new Vector2(0,2*50+15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: 'przed tobą'
    }));
  }
  else
  {
      alert_wind.add(new UI.Text({
      position: new Vector2(0,15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: 'Twoja'
    }));
    
    alert_wind.add(new UI.Text({
      position: new Vector2(0,50+15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: 'kolej'
    }));
    
    alert_wind.add(new UI.Text({
      position: new Vector2(0,2*50+15),
      size: new Vector2(144,168),
      font: "gothic-28-bold",
      color: "black",
      textAlign:"center",
      text: ':)'
    }));
  }
  alert_wind.add(new UI.Image({
    position: new Vector2(58, 0),
    size: new Vector2(144, 168),
    image: 'images/done.png'
  }));
  
  alert_wind.on('click', 'select', function(){
    watchWind();
  });
  
  alert_wind.on('click', 'back', function(){
    watchWind();
  });
  
  alert_wind.show();
  
}

