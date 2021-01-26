import axios from 'axios';

export default {
	// Get all Pets
	export_gcode: (filename, gcode) => {
		return axios.post('/api/gcode', { filename, gcode });
	}
};
