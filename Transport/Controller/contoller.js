function getLocation() {
	// function getLocation() {
	//     if (navigator.geolocation) {
	//         navigator.geolocation.getCurrentPosition(showPosition, showError);
	//     } else {
	//         document.getElementById("travel-guide").innerHTML = "Geolocation is not supported by this browser.";
	//     }
	// }

	// Hardcoded coordinates for testing
	const lat = -1.4993; // Latitude for Musanze
	const lon = 29.6332; // Longitude for Musanze
	showPosition({ coords: { latitude: lat, longitude: lon } });
}

function showPosition(position) {
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	reverseGeocode(lat, lon);
}

function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occurred.");
			break;
	}
}

function reverseGeocode(lat, lon) {
	const apiKey = "1c8d524602e745e2a4a71e3185d031ef";
	const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			const city =
				data.results[0].components.city ||
				data.results[0].components.town ||
				data.results[0].components.village;
			fetchTravelGuide(city);
		})
		.catch((error) => console.error("Error:", error));
}

function fetchTravelGuide(city) {
	const url = `https://d1q04mdo12.execute-api.us-east-1.amazonaws.com/prod/travelGuide?city=${city.toLowerCase()}`;

	console.log("Fetching travel guide for:", city);
	console.log("Request URL:", url);

	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}
			return response.json();
		})
		.then((data) => {
			if (data.content) {
				document.getElementById("travel-guide").innerHTML = data.content;
			} else {
				document.getElementById("travel-guide").innerHTML =
					"<p>Travel guide not available for this location.</p>";
			}
		})
		.catch((error) => {
			console.error("Fetch error:", error);
			document.getElementById(
				"travel-guide"
			).innerHTML = `<p>Error fetching travel guide: ${error.message}</p>`;
		});
}

// For testing purposes, we call getLocation directly
getLocation();
