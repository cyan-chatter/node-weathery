// accuweather-- q7roCtG6DLmplMgSYcuWdJHR0XXhnAGW -- radagast017  
// accuweather-- OokaOJz5igY2UYFHS2jg5S7zNQbSLmER -- infurio2000

//202396 -- Delhi
// mapbox-- pk.eyJ1IjoicmFkYWdhc3QwMTciLCJhIjoiY2tkM2ZibHBwMTF5dTJ5cDFlbHUwcjU4NiJ9.VYsuv8Tf48oxFRLTkCryvg
//mapbox address search format--- {house number} {street} {postcode} {city} {state}.
//895001 -- Azadpur




const request  = require('request')


const locate = (address,callback)=>{
    const extraURL = 'http://dataservice.accuweather.com/locations/v1/search?apikey=q7roCtG6DLmplMgSYcuWdJHR0XXhnAGW&q=' + encodeURIComponent(address) + '&offset=1'
    const url = 'http://dataservice.accuweather.com/locations/v1/search?apikey=OokaOJz5igY2UYFHS2jg5S7zNQbSLmER&q=' + encodeURIComponent(address) + '&offset=1'
    
    request({url : url, json: true},(error,response)=>{
        console.log(response.body)
        
        if(error){
            callback('Unable to connect to location key services!',undefined)
        }
        
        else if(response.body.length === 0){
            callback('Unable to find Location. Try another Search',undefined)
        }
        else {
            
            const locationKey =  response.body[0].Key
            const locationName =   response.body[0].LocalizedName
            const locationCountry =  response.body[0].Country.LocalizedName

            callback(undefined, {locationKey,locationName,locationCountry})        
        }
    })    
    
}

const geocode = (address,callback)=>{
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoicmFkYWdhc3QwMTciLCJhIjoiY2tkM2ZibHBwMTF5dTJ5cDFlbHUwcjU4NiJ9.VYsuv8Tf48oxFRLTkCryvg'

    request({url: url, json: true},(error, response) =>{
        if(error){
            callback('Unable to connect to location services!',undefined)
        }
        else if(response.body.features.length === 0){
            callback('Unable to find weather in that location. Try another Search',undefined)
        }
        else {
        let place = ''

        if(response.body.features[0].context.length <= 3){
            place = response.body.features[0].place_name}
        else{
            place = response.body.features[0].text + ', ' + response.body.features[0].context[response.body.features[0].context.length - 2].text + ', ' + response.body.features[0].context[response.body.features[0].context.length - 1].text 
        }
        console.log('Place is:    ',place)

            const geoData ={
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: place
            } 
            callback(undefined, geoData.location)
        }
    }) 

}


const forecast = (key,callback)=>{
    const extraURL = 'http://dataservice.accuweather.com/forecasts/v1/daily/1day/'+ key.locationKey + '?apikey=q7roCtG6DLmplMgSYcuWdJHR0XXhnAGW&metric=true'
    const forecastURL = 'http://dataservice.accuweather.com/forecasts/v1/daily/1day/'+ key.locationKey + '?apikey=OokaOJz5igY2UYFHS2jg5S7zNQbSLmER&metric=true'
    
    request({url: forecastURL, json: true},(error, response) => {
        
      
      if(error){
          callback('Unable to connect to server',undefined)
      }
      else if(response.body.error){
          callback('Input error',undefined)
      }
      else{    

        

        forecastData = {
            minTemp : response.body.DailyForecasts[0].Temperature.Minimum.Value,
            maxTemp : response.body.DailyForecasts[0].Temperature.Maximum.Value,
            dayIcon : response.body.DailyForecasts[0].Day.IconPhrase,
            nightIcon : response.body.DailyForecasts[0].Night.IconPhrase,
            pptDay : response.body.DailyForecasts[0].Day.HasPrecipitation, 
            pptNight : response.body.DailyForecasts[0].Night.HasPrecipitation
        }

        callback(undefined, forecastData)
      }  
       
    })
    
    }
    

//exports

module.exports = {
    geocodeFn: geocode,
    locateFn: locate,
    forecastFn: forecast 
}

