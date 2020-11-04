

// Initialize and add the map
var map;
var markers = [];
var infoWindow;
var locationSelect;

function initMap() {
    // The location of Uluru
    const la = { lat: 34.052, lng: -118.243 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        mapTypeId: 'roadmap',
        center: la,
    });

    infoWindow = new google.maps.InfoWindow();
    // The marker, positioned at Uluru
    // resetValue();
    //showStoreMarker(stores);
    getStores();
}

const showStoreMarker = (stores) => {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index) {
        var latLng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        var name = store.name;
        var address = store.addressLines[0];
        createMarker(latLng, name, address, index)
        bounds.extend(latLng)
    })
    map.fitBounds(bounds)
}

const getStores = () => {
    const API_URL = `http://localhost:3000/api/stores`;
    fetch(API_URL)
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw new Error(response.status)
            }
        }).then((data) => {
            searchLocationsNear(data);
            displayStores(data);
            setOnClickListener();
        })
}

const createMarker = (latLng, name, address, openStatusText, phone, index) => {

    var html = `
        <div class="store-info">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-open-status">
                ${openStatusText}
            </div>
            <div class="store-info-address flex-row">
                <div class="icon flex">
                    <i class="fas fa-location-arrow"></i> 
                </div>
                <span>${address}</span>
            </div>
            <div class="store-info-phone flex-row">
                <div class="icon flex">
                    <i class="fas fa-phone-alt"></i> 
                </div>
                <span><a href="tel:${phone}" >${phone}</a></span>
            </div>


        </div>

    `
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        label: `${index + 1}`,
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    })
    markers.push(marker)
}

const searchStore = () => {
    var foundStore = [];
    var zipCode = document.getElementById('search-location').value;
    console.log(zipCode)
    if (zipCode) {
        stores.forEach(function (store, index) {
            var postalCode = store.address.postalCode.substring(0, 5);
            if (postalCode == zipCode) {
                foundStore.push(store)
            }
        })
    } else {
        foundStore = stores;
    }
    clearLocations();
    displayStores(foundStore);
    showStoreMarker(foundStore);
    setOnClickListener();
}

const setOnClickListener = () => {
    var storeElement = document.querySelectorAll('.store-container');
    storeElement.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            new google.maps.event.trigger(markers[index], 'click')
        })
    })
}


const displayStores = (stores) => {
    var storesHtml = '';
    stores.forEach(function (store, index) {
        storesHtml += `
            <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${store.addressLine[0]}</span>
                        <span>${store.addressLine[1]}</span>
                    </div>
                    <div class="store-phone-number">${store.phoneNumber}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">${index + 1}</div>
                </div>
            </div>
        </div>
        `
    })
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

const clearLocations = () => {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null)
    }
    markers.length = 0;
}

const resetValue = () => {
    document.getElementById('search-location').value = '';
}

const searchLocationsNear = (stores) => {
    let bounds = new google.maps.LatLngBounds();

    stores.forEach((store, index) => {
        let latLng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0]
        );
        let name = store.storeName;
        let address = store.addressLine[0];
        let openStatusText = store.openStatusText;
        let phone = store.phoneNumber
        createMarker(latLng, name, address, openStatusText, phone, index);
        bounds.extend(latLng)
    })
    map.fitBounds(bounds)

}