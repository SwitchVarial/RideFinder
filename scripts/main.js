function getLocation() {
    fetch('https://freegeoip.app/json/', { mode: 'cors' }) // Muunnetaan vastaus JSON muotoon
        .then(function (response) {
            return response.json();
        })
        // Käsitellään muunnettu (eli JSON muotoinen) vastaus
        .then(function (responseJson) {
            // Kutsutaan funktiota ja välitetään sille json-vastaus
            let userLongitude = responseJson.longitude;
            let userLatitude = responseJson.latitude;
            getNearestResorts(userLongitude, userLatitude);
        })
        // Jos tuli jokin virhe
        .catch(function (error) {
            document.getElementById("content").innerHTML = "<p>Tapahtui virhe: " + error + "</p>";
        });
}

function getNearestResorts(longitude, latitude) {
    loading();
    // let query = location;
    let userLongitude = longitude;
    let userLatitude = latitude;
    fetch('http://lipas.cc.jyu.fi/api/sports-places?closeToLon=' + userLongitude + '&closeToLat=' + userLatitude + '&lang=fi&closeToDistanceKm=50&typeCodes=4110', { mode: 'cors' }) // Muunnetaan vastaus JSON muotoon
        .then(function (response) {
            return response.json();
        })
        // Käsitellään muunnettu (eli JSON muotoinen) vastaus
        .then(function (responseJson) {
            // Kutsutaan funktiota ja välitetään sille json-vastaus
            kerro(responseJson);
        })
        // Jos tuli jokin virhe
        .catch(function (error) {
            document.getElementById("content").innerHTML = "<p>Tapahtui virhe" + error + "</p>";
        });

    async function kerro(data) {
        let teksti = "<section id='resorts'><h2 class='text-center fw-bold'>Sinua lähimmät hiihtokeskukset</h2>"
            + "<p class='text-center lead mb-4'>Haimme kaikki 50 kilometrin säteellä olevat keskukset sinua varten</p>"
            + "<div class='container'><div class='row'>"; // määritellään muuttuja, johon tulostettava tieto kerätään
        // otsikkotiedon hakeminen ja sijoittaminen h1-elementtiin
        for (let i = 0; i < data.length; i++) {
            let resortDetails = await getShortResortDetails(data[i].sportsPlaceId);
            teksti = teksti + resortDetails;
        }
        // teksti-muuttujan sisällön tulostus
        document.getElementById("content").innerHTML = teksti + "</div></div>";
    }
}

function loading() {
    document.getElementById("content").innerHTML = "<div class='d-flex justify-content-center loading'>"
        + "<div class='spinner-border text-primary' role='status'>"
        + "<span class='visually-hidden'>Loading...</span></div></div></section>";
}

function getAllResorts() {
    loading();
    fetch('http://lipas.cc.jyu.fi/api/sports-places?typeCodes=4110', { mode: 'cors' }) // Muunnetaan vastaus JSON muotoon
        .then(function (response) {
            return response.json();
        })
        // Käsitellään muunnettu (eli JSON muotoinen) vastaus
        .then(function (responseJson) {
            // Kutsutaan funktiota ja välitetään sille json-vastaus
            resorts(responseJson);
        })
        // Jos tuli jokin virhe
        .catch(function (error) {
            document.getElementById("content").innerHTML = "<p>Tapahtui virhe" + error + "</p>";
        });

    async function resorts(data) {
        let teksti = "<section id='resorts'><h2 class='text-center fw-bold'>Kaikki Suomen hiihtokeskukset</h2>"
            + "<p class='text-center lead mb-4'>Löydä suosikkisi ja katso samalla päivän laskusää</p>" // määritellään muuttuja, johon tulostettava tieto kerätään
            + "<div class='container'><div class='row'>";
        // otsikkotiedon hakeminen ja sijoittaminen h1-elementtiin
        for (let i = 0; i < data.length; i++) {
            let resortDetails = await getShortResortDetails(data[i].sportsPlaceId);
            teksti = teksti + resortDetails;
        }
        // teksti-muuttujan sisällön tulostus
        document.getElementById("content").innerHTML = teksti + "</div></div></section>";
    }
}

function searchResorts() {
    loading();
    let searchWord = document.getElementById("search-input").value;
    fetch('http://lipas.cc.jyu.fi/api/sports-places?lang=fi&typeCodes=4110&searchString=' + searchWord, { mode: 'cors' }) // Muunnetaan vastaus JSON muotoon
        .then(function (response) {
            return response.json();
        })
        // Käsitellään muunnettu (eli JSON muotoinen) vastaus
        .then(function (responseJson) {
            // Kutsutaan funktiota ja välitetään sille json-vastaus
            resorts(responseJson);
        })
        // Jos tuli jokin virhe
        .catch(function (error) {
            document.getElementById("content").innerHTML = "<p>Haku epäonnistui: " + error + "</p>";
        });

    async function resorts(data) {
        let teksti = "<section id='resorts'><h2 class='text-center fw-bold'>Hakutulokset</h2>"
            + "<p class='text-center lead mb-4'>Hakusanalla " + searchWord + " löytyneet tulokset</p>"
            + "<div class='container'><div class='row'>"; // määritellään muuttuja, johon tulostettava tieto kerätään
        // otsikkotiedon hakeminen ja sijoittaminen h1-elementtiin
        for (let i = 0; i < data.length; i++) {
            let resortDetails = await getShortResortDetails(data[i].sportsPlaceId);
            teksti = teksti + resortDetails;
        }
        // teksti-muuttujan sisällön tulostus
        document.getElementById("content").innerHTML = teksti + "</div></div></section>";
    }
}

async function getShortResortDetails(id) {
    loading();
    let resortId = id;
    try {
        const response = await fetch('http://lipas.cc.jyu.fi/api/sports-places/' + resortId + '?lang=fi', { mode: 'cors' });
        const json = await response.json();
        let resortDetails = "";
        if (json.owner == "Yritys") {
            resortDetails = "<div class='col-lg-4 col-sm-6 my-3'>"
                + "<div class='card text-dark bg-light h-100'>"
                + "<div class='card-header'><i class='bi bi-geo-alt-fill text-primary'></i> " + json.location.postalOffice.charAt(0).toUpperCase() + json.location.postalOffice.slice(1).toLowerCase() + "</div>"
                + "<img src='images/resort_small.jpg' class='card-img-top' alt='&copy; Edgars Bērziņš - Dummy resort photo'>"
                + "<div class='card-body d-flex flex-column pb-0'>"
                + "<h4>" + json.name + "</h4>"
                + "<p class='card-text'><small>" + json.location.address + "<br>"
                + json.location.postalCode + " " + json.location.postalOffice.charAt(0).toUpperCase() + json.location.postalOffice.slice(1).toLowerCase() + "<br>"
                + json.phoneNumber + "<br>"
                + "<a href='" + json.www + "' target='_blank'>" + json.www.substring(0, 35) + "</a><br>"
                + "</small></p>"
                + "<a href='#' class='btn btn-primary mt-auto' onclick='getResortDetailsNoCard(" + json.sportsPlaceId + ")'>Katso tarkemmat tiedot</a><br>"
                + "</div></div></div>";
        }
        return resortDetails;
    } catch (error) {
        document.getElementById("content").innerHTML = "<p>Hiihtokeskuksen tietojen hakeminen epäonnistui: " + error + "</p>";
    }
}

async function getResortDetails(id) {
    loading();
    let resortId = id;
    try {
        const response = await fetch('http://lipas.cc.jyu.fi/api/sports-places/' + resortId + '?lang=fi', { mode: 'cors' });
        const json = await response.json();
        let resortDetails = "";
        if (json.owner == "Yritys") {
            resortDetails = "<div class='col-lg-4 col-sm-6 my-3'>"
                + "<div class='card text-dark bg-light h-100'>"
                + "<div class='card-header'><i class='bi bi-geo-alt-fill text-primary'></i> " + json.location.postalOffice.charAt(0).toUpperCase() + json.location.postalOffice.slice(1).toLowerCase() + "</div>"
                + "<div class='card-body d-flex flex-column pb-0'>"
                + "<h4>" + json.name + "</h4>"
                + "<p class='card-text'><small>" + json.location.address + "<br>"
                + json.location.postalCode + " " + json.location.postalOffice.charAt(0).toUpperCase() + json.location.postalOffice.slice(1).toLowerCase() + "<br>"
                + json.phoneNumber + "<br>"
                + json.email + "<br>"
                + "<a href='" + json.www + "' target='_blank'>" + json.www.substring(0, 50) + "</a><br>"
                + "</small></p>"
                + "<h5>Rinnetiedot</h5>"
                + "<p class='card-text'>"
                + "Rinteitä: " + json.properties.slopesCount + "<br>"
                + "Korkeusero: " + json.properties.maxVerticalDifference + "<br>"
                + "Hissejä: " + json.properties.liftsCount + "<br>"
                + "Pisin rinne: " + json.properties.longestSlopeM + "<br>"
                + "Parkki: " + json.properties.snowparkOrStreet + "<br>"
                + "</p>"
                + "<h5>Palvelut</h5>"
                + "<p class='card-text'>"
                + "Vuokraamo: " + json.properties.equipmentRental + "<br>"
                + "Huolto: " + json.properties.skiService + "<br>"
                + "Ravintola: " + json.properties.kiosk + "<br>"
                + "Wc: " + json.properties.toilet + "<br>"
                + "<button class='btn btn-primary mt-3' onclick='getWeatherByLocation(" + json.location.coordinates.wgs84.lon + ", " + json.location.coordinates.wgs84.lat + ", " + json.sportsPlaceId + ")'>Hae säätiedot</button><br>"
                + "</p>"
                + "<div class='pb-0' id='" + json.sportsPlaceId + "'></div>"
                + "</div></div></div>";

            document.getElementById("content").innerHTML = "<p>" + resortDetails + "</p>";
        }
        return resortDetails;
    } catch (error) {
        document.getElementById("content").innerHTML = "<p>Hiihtokeskuksen tietojen hakeminen epäonnistui: " + error + "</p>";
    }
}


async function getResortDetailsNoCard(id) {
    loading();
    let resortId = id;
    try {
        const response = await fetch('http://lipas.cc.jyu.fi/api/sports-places/' + resortId + '?lang=fi', { mode: 'cors' });
        const json = await response.json();
        let resortDetails = "<section id='resorts'><div class='container'><div class='row'>"
        + "<img src='images/resort_full.jpg' class='img-fluid' alt='&copy; Edgars Bērziņš - Dummy resort photo'>";
        if (json.owner == "Yritys") {
            resortDetails = resortDetails + "<div class='col-12 my-3'><h1 class='display-5 fw-bold text-center mt-3'>" + json.name + "</h1></div>"
                + "<div class='col-lg-3 col-sm-6 my-3 overflow-hidden'>"
                + "<h5 class='text-center text-sm-start'>Yhteystiedot</h5>"
                + "<p class='text-center text-sm-start'>" + json.location.address + "<br>"
                + json.location.postalCode + " " + json.location.postalOffice.charAt(0).toUpperCase() + json.location.postalOffice.slice(1).toLowerCase() + "<br>"
                + json.phoneNumber + "<br>"
                + "<a href='mailto:" + json.email + "' target='_blank'>" + json.email + "</a><br>"
                + "<a href='" + json.www + "' target='_blank'>" + json.www.substring(0, 50) + "</a><br>"
                + "</p>"
                + "</div>"
                + "<div class='col-lg-3 col-sm-6 my-3 overflow-hidden'>"
                + "<h5 class='text-center text-sm-start'>Rinnetiedot</h5>"
                + "<p class='text-center text-sm-start'>"
                + "Rinteitä: <strong class='text-primary'>" + json.properties.slopesCount + "</strong><br>"
                + "Korkeusero: <strong class='text-primary'>" + json.properties.maxVerticalDifference + "</strong><br>"
                + "Hissejä: <strong class='text-primary'>" + json.properties.liftsCount + "</strong><br>"
                + "Pisin rinne: <strong class='text-primary'>" + json.properties.longestSlopeM + "</strong><br>";
            let park = json.properties.snowparkOrStreet;
            if (park == true) {
                resortDetails = resortDetails + "Parkki: <i class='bi bi-hand-thumbs-up-fill text-primary'></i>";
            } else if (park == null) {
                resortDetails = resortDetails + "";
            }
            else {
                resortDetails = resortDetails + "Parkki: <i class='bi bi-hand-thumbs-down-fill text-primary'></i>";
            }
            resortDetails = resortDetails
                + "</p>"
                + "</div>"
                + "<div class='col-lg-3 col-sm-6 my-3 overflow-hidden'>"
                + "<h5 class='text-center text-sm-start'>Palvelut</h5>"
                + "<p class='text-center text-sm-start'>";
            let skirent = json.properties.equipmentRental;
            if (skirent == true) {
                resortDetails = resortDetails + "Vuokraamo<br>";
            } else if (skirent == null) {
                resortDetails = resortDetails + "";
            }
            let skiservice = json.properties.equipmentRental;
            if (skiservice == true) {
                resortDetails = resortDetails + "Välinehuolto<br>";
            } else if (skiservice == null) {
                resortDetails = resortDetails + "";
            }
            let restaurant = json.properties.equipmentRental;
            if (restaurant == true) {
                resortDetails = resortDetails + "Ravintola<br>";
            } else if (restaurant == null) {
                resortDetails = resortDetails + "";
            }
            let toilet = json.properties.equipmentRental;
            if (toilet == true) {
                resortDetails = resortDetails + "Wc<br>";
            } else if (toilet == null) {
                resortDetails = resortDetails + "";
            }
            if (skirent == null && skiservice == null && restaurant == null && toilet == null) {
                resortDetails = resortDetails + "Ei tietoja";
            }
            resortDetails = resortDetails + "</p></div>";
            getWeatherByLocation(json.location.coordinates.wgs84.lon, json.location.coordinates.wgs84.lat, json.sportsPlaceId);
            resortDetails = resortDetails
                + "<div class='col-lg-3 col-sm-6 my-3 overflow-hidden'>"
                + "<h5 class='text-center text-sm-start'>Päivän sää</h5>"
                + "<div class='pb-0' id='" + json.sportsPlaceId + "'></div>"
                + "</div></div></div>";

            document.getElementById("content").innerHTML = resortDetails + "</section>";
        }
        return resortDetails;
    } catch (error) {
        document.getElementById("content").innerHTML = "<p>Hiihtokeskuksen tietojen hakeminen epäonnistui: " + error + "</p>";
    }
}

async function getWeatherByLocation(longitude, latitude, id) {
    let resortLongitude = longitude;
    let resortLatitude = latitude;
    let resortId = id;
    let weatherReport = "";
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + resortLatitude + '&lon=' + resortLongitude + '&appid=d89a8fe388e0065a6a5dc91cdfa89a61&lang=fi&units=metric');
        const json = await response.json();
        weatherReport = weatherReport + "<p class='text-center text-sm-start'>Sää: <strong class='text-primary'>" + json.weather[0].description.charAt(0).toUpperCase() + json.weather[0].description.slice(1) + "</strong><br>"
            + "Lämpötila: <strong class='text-primary'>" + json.main.temp.toFixed(1) + "&#176;C</strong><br>"
            + "Tuntuu kuin: <strong class='text-primary'>" + json.main.feels_like.toFixed(1) + "&#176;C</strong><br>"
            + "Tuulen nopeus: <strong class='text-primary'>" + json.wind.speed.toFixed(1) + " m/s</strong><br>"
            + "Havaintoaseman sijainti: <strong class='text-primary'>" + json.name + "</strong><br>"
            + "<img src='http://api.openweathermap.org/img/w/" + json.weather[0].icon + ".png' alt='" + json.weather[0].description + "'><br>"
            + "</p>";
        document.getElementById(resortId).innerHTML = weatherReport;
    } catch (error) {
        document.getElementById("content").innerHTML = "<p>Säätietojen hakeminen epäonnistui: " + error + "</p>";
    }
}