const path = require('path')

const express = require('express')

const hbs = require('hbs')

const app = express()

const port = process.env.PORT || 3000


const util = require('./utils')

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views' )
const partialsPath = path.join(__dirname, '../templates/partials' )
hbs.registerPartials(partialsPath)

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)


// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req, res) => {
    res.render('index', {
        title: 'WEATHER',
        name: 'Radagast'

    })
})
app.get('/about',(req, res) => {
    res.render('about', {
        title : 'ABOUT',
        heading : 'Weather',
        name: 'Radagast'

    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        title: 'HELP',
        purpose: 'To get the weather, All you have to do is to hover on the Search button, Type in the desired location',
        name: 'Radagast'
    })
})



app.get('/weather',(req, res) => {
    
    const lSearcher = req.query.location 
    if(!lSearcher){
        return res.send({
             error: 'You must provide a location'
         })
     }


util.geocodeFn(lSearcher,(error, location)=>{
    if(error){
        return res.send({error})
    }
    console.log('Geocode :  '+location)
    util.locateFn(location,(error,key={})=>{
        console.log('Locate :  '+location)
        if(error){
            return res.send({error})
        }
        
        util.forecastFn(key,(error,forecastData)=>{
             if(error){
                return res.send({error})
            }
            //console.log(key)
            var isRain = e => {
                if(e === false){
                   return  'There would not be any Precipitation'
                }else {
                   return  'There will be Precipitation'
                }   
            }
                
            
            const forecastString = "Minimum Temperature:   "  + forecastData.minTemp + " degree C\r\nMaximum Temperature:   " + forecastData.maxTemp + " degree C\r\nDay: \r\n     " + forecastData.dayIcon + "\r\n     " + isRain(forecastData.pptDay) + "\r\nNight: \r\n     " + forecastData.nightIcon + "\r\n     " + isRain(forecastData.pptNight) + "\r\n \r\nLocation:  " + key.locationName + ", " + key.locationCountry 
            res.send({
                forecast: forecastString
            }) 
            console.log(forecastString)
        })
    })
})


         

})


app.get('/help/*',(req,res)=>{
    res.render('error404',{
        title: '404',
        message: 'Help Article Not Found',
        name: 'Radagast'
        
    })
})

app.get('*',(req,res)=>{
    res.render('error404',{
        title: '404',
        message: 'Page Not Found',
        name: 'Radagast' 
    })
})


app.listen(port, () => {
    console.log('Server is Up on port' + port)
})