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
        if(!checkEmptyField(dayElement, monthElement, yearElement)) return;
        if(isDateValid(dayElement, monthElement, yearElement)) {
            setAge(new Date(yearElement.value, monthElement.value, dayElement.value));
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
            if(!value || value > new Date().getFullYear()) message = errorMessage.invalidYear;
            break;
    }
    changeInputState(input, message);
}
function isDateValid(dayElement, monthElement, yearElement) {
    // is day in month of the year ?
    let lastDay = new Date(yearElement.value, monthElement.value, 0).getUTCDate();
    if(dayElement.value > lastDay) {
        changeInputState(dayElement, errorMessage.invalidDay)
        return false;
    };
    // make sure date is in the past
    if(new Date() - new Date(yearElement.value, monthElement.value, dayElement.value) < 0) {
        changeInputState(dayElement, errorMessage.invalidDay);
        changeInputState(monthElement, errorMessage.invalidMonth);
        changeInputState(yearElement, errorMessage.invalidYear);
        return false;
    }
    return true;
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
function calculateAge(birthDay) {
    let years, months, days, seconds;
    let today = new Date();
    seconds = today - birthDay;
    years = today.getUTCFullYear() - birthDay.getUTCFullYear();
    if(today.getUTCMonth() < birthDay.getUTCMonth()) { 
        years--;
        months = 12 - birthDay.getUTCMonth() + today.getUTCMonth();
    }else {
        months = today.getUTCMonth() - birthDay.getUTCMonth();
    }
    if(today.getUTCDate() < birthDay.getUTCDate()){
        months--;
        let lastDay = new Date(birthDay.getUTCFullYear(), birthDay.getUTCMonth(), 0).getUTCDate();
        days = (lastDay - birthDay.getUTCDate()) + today.getUTCDate();
    }else {
        days = today.getUTCDate() - birthDay.getUTCDate();
    }
    return {years, months, days}
}
// set age
function setAge(birthDay) {
    // get elements
    let yearsElement = document.querySelector(".result-group .years")
    let monthsElement = document.querySelector(".result-group .months")
    let daysElement = document.querySelector(".result-group .days")
    let {years, months, days} = calculateAge(birthDay);
    yearsElement.innerHTML = years;
    monthsElement.innerHTML = months;
    daysElement.innerHTML = days;
}