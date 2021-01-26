const Pets = require('../models/pet');
const fs = require('fs');

module.exports = function(app) {
	// Post One Pet
	app.post('/api/gcode', async (req, res) => {
		try {
			const filename = req.body.filename;
			const data = req.body.gcode;
			// console.log({ filename, data });
			fs.writeFile(
				`/Volumes/macOS\ Data/Users/kurtlavacque/Documents/3D\ Printing/Projects/Printed/Glow\ LEDs/Glowskins/${filename}`,
				data,
				(err) => {
					if (err) throw err;
					console.log('Results Received');
					res.send('Results Received');
				}
			);
		} catch (err) {
			console.log(err);
		}
	});
};
