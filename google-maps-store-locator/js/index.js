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
    resetValue();
    displayStores(stores);
    showStoreMarker(stores);
    setOnClickListener();
    // const marker = new google.maps.Marker({
    //     position: uluru,
    //     map: map,
    // });
}

function showStoreMarker(stores) {
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

function createMarker(latLng, name, address, index) {
    var html = `<b>${name}</b> <br/>${address}`
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

searchStore = () => {
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

function setOnClickListener() {
    var storeElement = document.querySelectorAll('.store-container');
    storeElement.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            new google.maps.event.trigger(markers[index], 'click')
        })
    })
}


function displayStores(stores) {
    var storesHtml = '';
    stores.forEach(function (store, index) {
        storesHtml += `
            <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${store.addressLines[0]}</span>
                        <span>${store.addressLines[1]}</span>
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

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null)
    }
    markers.length = 0;
}

resetValue = () => {
    document.getElementById('search-location').value = '';
}