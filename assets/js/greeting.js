// ┌─┐┬─┐┌─┐┌─┐┌┬┐┬┌┐┌┌─┐┌─┐
// │ ┬├┬┘├┤ ├┤  │ │││││ ┬└─┐
// └─┘┴└─└─┘└─┘ ┴ ┴┘└┘└─┘└─┘
// Function to set Greetings

// Check if a name is already stored
let userName = localStorage.getItem('userName');

if (!userName) {
    // Ask for the user's name if not already stored
    userName = prompt("What's your name?");
    if (userName) {
        localStorage.setItem('userName', userName);
    }
}

const today = new Date();
const hour = today.getHours();
const name = CONFIG.name;

const gree1 = `${CONFIG.greetingNight}\xa0`;
const gree2 = `${CONFIG.greetingMorning}\xa0`;
const gree3 = `${CONFIG.greetingAfternoon}\xa0`;
const gree4 = `${CONFIG.greetingEvening}\xa0`;

if (hour >= 23 || hour < 6 && userName) {
	document.getElementById('greetings').innerText = gree1 + ${userName};
} else if (hour >= 6 && hour < 12 && userName) {
	document.getElementById('greetings').innerText = gree2 + ${userName};
} else if (hour >= 12 && hour < 17 && userName) {
	document.getElementById('greetings').innerText = gree3 + ${userName};
} else {
	document.getElementById('greetings').innerText = gree4 + ${userName};
}
