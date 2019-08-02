document.getElementById("fav").style.display = "none"

// function onTimeChange() {
//     var ind = document.getElementById("timeSelect").selectedIndex; 
//     var timeChoice = document.getElementsByTagName("option")[ind].value;
// }

function onSelectChange(){
    let categorySelect = document.getElementById("categorySelect")
    let val = categorySelect.value
    axios.get(`/subcategories/${val}`)
    .then((response)=>{
        var container = document.getElementById("container");
        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
        
        //clear events from previous search
        var eventsContainer = document.getElementById("events-container");
        while (eventsContainer.hasChildNodes()) {
            eventsContainer.removeChild(eventsContainer.firstChild);
        }
        
        //clear event details from previous search
        var eventContainer = document.getElementById("event-container");
        while (eventContainer.hasChildNodes()) {
            eventContainer.removeChild(eventContainer.firstChild);
        }

        let subCategories = response.data.subcategories
        for (let i=0; i<subCategories.length; i++){
            let subCategory = document.createElement("div")
            subCategory.setAttribute("id",subCategories[i].id)
            subCategory.onclick = showEvents
            subCategory.innerHTML = `<p>${subCategories[i].name}</p>`
            let container = document.getElementById("container")
            container.appendChild(subCategory)
        }
  })
}

function showEvents(){
    let subCategId = this.id
    let cityVal = document.getElementById("hidden").value
    axios.get(`/events/${subCategId}/${cityVal}`)
    .then((response) => {
        //clear previous events
        var eventsContainer = document.getElementById("events-container");
            while (eventsContainer.hasChildNodes()) {
                eventsContainer.removeChild(eventsContainer.firstChild);
            }
        
        //clear event details from previous search
        var eventContainer = document.getElementById("event-container");
        while (eventContainer.hasChildNodes()) {
            eventContainer.removeChild(eventContainer.firstChild);
        }

        let eventsArray = response.data
        let container = document.getElementById("events-container")
        for (let i=0; i<eventsArray.length; i++){
            container.innerHTML += `<div class='event' id="${eventsArray[i].id}"><h2>${eventsArray[i].name.text}</h2><img class="img-events" src="${eventsArray[i].logo.original.url}"></img></div>`
        }
        
        let listOfEvents = document.getElementsByClassName('event')
        for (let i=0; i<listOfEvents.length; i++){
            listOfEvents[i].addEventListener("click", function(){
                //anonymous function create its own context, arrow function doesn't
                //we need it that way so this equals the div that we clicked on
                let that = this
                showFullDetails(eventsArray, that)
            })
        }
    })
    .catch(err => {
        console.log(err)
    })
}

function showFullDetails(arr, clickedElem){
    document.getElementById("fav").style.display = "block"
    
    let container = document.getElementById("events-container")
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }

    let result = arr.filter(currentItem => clickedElem.id === currentItem.id)
    // filter() looping over events array. the result of filter() is always an array of objects. 
    // in this case the result is an array of only 1 object
    console.log(result)
    let eventContainer = document.getElementById("event-container")
    
    let eventName = document.createElement("div")
    eventName.setAttribute("id","event-name")
    eventName.innerHTML = result[0].name.html
    eventContainer.appendChild(eventName)

    let eventDescription = document.createElement("div")
    eventDescription.innerHTML = result[0].description.text
    eventContainer.appendChild(eventDescription)

    eventContainer.innerHTML += `<a id="buy-ticket" href="${result[0].url}">Take my money</a>`

    //create cookie
    document.cookie = `name=${result[0].name.text}`
    document.cookie = `event_id=${result[0].id}`
}

function clearCookie() {
    window.setTimeout(function(){
        document.cookie = "name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "event_id= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"    
    }, 5000)
}