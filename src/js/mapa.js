import { document } from "postcss";

(function() {
    const lat = document.querySelector('#lat').value || 20.2766;
    const lng = document.querySelector('#lng').value || -97.9619;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker

    // Utilizar provider y deocoder para mostrar la dirección en el marcador
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregar el marcador al mapa
    marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    // Detectar el movimiento del marcador
    marker.on('moveend', function(e) {
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng))

        // Obtener la dirección a partir de las coordenadas
        geocodeService.reverse().latlng(position, 16).run(function(error, result) {
            marker.bindPopup(result.address.LongLabel)

            // Llenar los campos ocultos con la información de la dirección
            document.querySelector('.calle').textContent = result.address.Address ?? '';
            document.querySelector('#calle').value = result.address.Address ?? '';
            document.querySelector('#lat').value = position.lat;
            document.querySelector('#lng').value = position.lng;
        });
    })

})()