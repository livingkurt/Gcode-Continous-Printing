const fs = require('fs');

module.exports = function(app) {
	app.post('/api/gcode', async (req, res) => {
		try {
			const filename = req.body.filename;
			const data = req.body.gcode;
			fs.writeFile(
				`/Volumes/macOS\ Data/Users/kurtlavacque/Documents/3D\ Printing/Projects/Printed/Glow\ LEDs/${filename}`,
				data,
				(err) => {
					if (err) throw err;
					console.log('Gcode Continous File Created');
					res.send('Gcode Continous File Created');
				}
			);
		} catch (err) {
			console.log(err);
		}
	});
};
