window.onload = function (e) {
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
        if (!checkEmptyField(dayElement, monthElement, yearElement)) return;
        if (isDateValid(dayElement, monthElement, yearElement)) {
            changeInputState(dayElement);
            changeInputState(monthElement);
            changeInputState(yearElement);
        }
        if (dayElement.classList.contains("invalid") || monthElement.classList.contains("invalid") || yearElement.classList.contains("invalid")) return;
        setAge({ year: yearElement.value, month: monthElement.value, day: dayElement.value });
    })
}
// error messages to be displayed to user
var errorMessage = {
    invalidDay: "Must be valid day",
    invalidMonth: "Must be valid month",
    invalidYear: "Must be in the past",
    emptyField: "This field is required"
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
            if (value < 1 || value > 12) message = errorMessage.invalidMonth;
            break;
        case "year":
            if (!value || value > new Date().getFullYear() || value == 0) message = errorMessage.invalidYear;
            break;
    }
    changeInputState(input, message);
}
function isDateValid(dayElement, monthElement, yearElement) {
    // is day in month of the year ?
    let lastDay = new Date(yearElement.value, monthElement.value - 1, 0).getUTCDate();
    if (dayElement.value > lastDay) {
        changeInputState(dayElement, errorMessage.invalidDay)
        return false;
    };
    // make sure date is in the past
    if (new Date() - new Date(yearElement.value, monthElement.value - 1, dayElement.value) < 0) {
        changeInputState(dayElement, errorMessage.invalidDay);
        changeInputState(monthElement, errorMessage.invalidMonth);
        changeInputState(yearElement, errorMessage.invalidYear);
        return false;
    }
    return true;
}
function checkEmptyField(dayElement, monthElement, yearElement) {
    if (!dayElement.value) changeInputState(dayElement, errorMessage.emptyField);
    if (!monthElement.value) changeInputState(monthElement, errorMessage.emptyField);
    if (!yearElement.value) changeInputState(yearElement, errorMessage.emptyField);
    return (dayElement.value && monthElement.value) && yearElement.value;
}

// change form input state
function changeInputState(input, error = false) {
    let parent = input.parentElement;
    let lastChild = parent.lastElementChild;
    if (error) {
        // add error message
        if (!lastChild.classList.contains("error-message")) {
            let span = document.createElement("span");
            span.textContent = error;
            span.classList.add("error-message");
            parent.appendChild(span);
            toggleInvalidClass();
        }
    } else {
        // remove error message if present
        if (lastChild.classList.contains("error-message")) {
            parent.removeChild(lastChild);
            toggleInvalidClass();
        }
    }
    function toggleInvalidClass() {
        input.classList.toggle("invalid");
        parent.classList.toggle("invalid");
    }
}
// calculate age
function calculateAge(birthDay) {
    let years, months, days;
    let today = new Date();
    years = today.getUTCFullYear() - birthDay.year;
    if (today.getUTCMonth() + 1 < birthDay.month) {
        years--;
        months = 12 - birthDay.month + today.getUTCMonth() + 1;
    } else {
        months = today.getUTCMonth() + 1 - birthDay.month;
    }
    if (today.getUTCDate() < birthDay.day) {
        months--;
        let lastDay = new Date(birthDay.year, birthDay.month - 1, 0).getUTCDate();
        days = (lastDay - birthDay.day) + today.getUTCDate();
    } else {
        days = today.getUTCDate() - birthDay.day;
    }
    return { years, months, days }
}
// set age
function setAge(birthDay) {
    // get elements
    let yearsElement = document.querySelector(".result-group .years")
    let monthsElement = document.querySelector(".result-group .months")
    let daysElement = document.querySelector(".result-group .days")
    let { years, months, days } = calculateAge(birthDay);
    yearsElement.innerHTML = years;
    monthsElement.innerHTML = months;
    daysElement.innerHTML = days;
}