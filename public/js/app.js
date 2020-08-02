const wForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')

message1.textContent = ''

wForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const location = search.value
    
    message1.textContent = 'Loading....'
    
    fetch('/weather?location=' + location).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                console.log(data.error)
                message1.textContent = 'Error:    ' + data.error
            }else{
                console.log(data.forecast)
                message1.innerHTML = data.forecast.replace(/(\r\n)/g, "<br />")
            }
        })
    })
    


})