window.onload = function(e) {
    
    // get input elements
    let dayElement = document.querySelector("input[name='day']");
    let monthElement = document.querySelector("input[name='month']");
    let yearElement = document.querySelector("input[name='year']");
    
    // get button
    let actionBtn = document.querySelector(".separator input[type='submit']");

    // data validation
    dayElement.addEventListener("focusout", e => {
        validateSingleInput(dayElement);
    })
    monthElement.addEventListener("focusout", e => {
        validateSingleInput(monthElement);
    })
    yearElement.addEventListener("focusout", e => {
        validateSingleInput(yearElement);
    })
    actionBtn.addEventListener("click", e => {
        checkEmptyField(dayElement, monthElement, yearElement);
        if(isDateValid(dayElement, monthElement, yearElement)) {
            // calculateAge();
            // setAge();
        }
    })
}
// error messages to be displayed to user
var errorMessage = {
    invalidDay: "Must be valid day",
    invalidMonth: "Must be valid month",
    invalidYear: "Must be in the past"
}
// input validation
function validateSingleInput(input) {
    let name = input.attributes.name.value;
    let value = input.value;
    let message;
    switch (name) {
        case "day":
            if (value < 1 || value > 31) message = errorMessage.invalidDay;
            break;
        case "month":
            if(value < 1 || value > 12)  message = errorMessage.invalidMonth;
            break;
        case "year":
            if(!value || value >= new Date().getFullYear()) message = errorMessage.invalidYear;
            break;
    }
    changeInputState(input, message);
}
function isDateValid(dayElement, monthElement, yearElement) {
    // is day in month of the year ?
    let lastDay = new Date(yearElement.value, monthElement.value, 0).getUTCDate();
    if(dayElement.value > lastDay) changeInputState(dayElement, errorMessage.invalidDay);
}
function checkEmptyField(dayElement, monthElement, yearElement) {
    if(!dayElement.value) changeInputState(dayElement, errorMessage.invalidDay);
    if(!monthElement.value) changeInputState(monthElement, errorMessage.invalidMonth);
    if(!yearElement.value) changeInputState(yearElement, errorMessage.invalidYear);
    return (dayElement.value && monthElement.value) && yearElement.value;
}

// change form input state
function changeInputState(input, error = false) {
    let parent = input.parentElement;
    let lastChild = parent.lastElementChild;
    if(error){
        // add error message
        if(!lastChild.classList.contains("error-message")) {
            let span = document.createElement("span");
            span.textContent = error;
            span.classList.add("error-message");
            parent.appendChild(span);
            toggleInvalidClass();
        }
    }else {
        // remove error message if present
        if(lastChild.classList.contains("error-message")){
            parent.removeChild(lastChild);
            toggleInvalidClass();
        }
    }
    function toggleInvalidClass(){
        input.classList.toggle("invalid");
        parent.classList.toggle("invalid");
    }
}
// calculate age
// set age