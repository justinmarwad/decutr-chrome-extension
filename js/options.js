var userName;

function saveName() {
	localStorage.setItem('initials', userName);

	userName=localStorage.getItem('initials');

	if( userName == null){
		userName = "";
	}
}

function getName() {
    if(userName=localStorage.getItem('initials')) {
        return userName;
    } else if (userName = document.getElementById("name-input").value == ""){
		userName = "";
	} else {
		userName = document.getElementById("name-input").value;
    }

    return userName 
}

function changeName() {
    userName = getName()

	saveName();
	getGreeting();
}

function getGreeting() {
    userName = getName();
    
    document.getElementById('greeting').innerHTML = `Your registered initials are: ${userName}`;
}

function clearName() {
	document.getElementById("name-input").value = "";
}


document.getElementById("name-form").addEventListener('submit', function(e) {
	e.preventDefault();

	changeName();
	clearName();
});

getGreeting();