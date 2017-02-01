const map = {
	getUrl(lat, long) {
		return {
			locationFallback: `http://maps.google.com/?saddr=Current%20Location&daddr=${lat},${long}&directionsmode=driving`,
			location: `comgooglemaps://?saddr=&daddr=${lat},${long}&directionsmode=driving`
		}
	}
}

module.exports = map;

// setTimeout(function() { 
// 	window.location = `http://maps.google.com/?saddr=Current%20Location&daddr=${lat},${long}&directionsmode=driving`; 
// }, 25);
// window.location = `comgooglemaps://?saddr=&daddr=${lat},${long}&directionsmode=driving`;
