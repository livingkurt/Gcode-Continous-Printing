const fs = require('fs');

module.exports = function(app) {
	// Post One Pet
	app.post('/api/gcode', async (req, res) => {
		try {
			const filename = req.body.filename;
			const data = req.body.gcode;
			fs.writeFile(
				`/Volumes/macOS\ Data/Users/kurtlavacque/Documents/3D\ Printing/Projects/Printed/Glow\ LEDs/${filename}`,
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
