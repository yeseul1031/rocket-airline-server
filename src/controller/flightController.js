const flights = require('../repository/flightList');

module.exports = {
  // [GET] /flight
 
  findAll: (req, res) => {
    let result = flights;
    const { departure_times, arrival_times, destination, departure } = req.query;

    if (departure_times) {
      result = result.filter(f => f.departure_times === departure_times);
    }
    if (arrival_times) {
      result = result.filter(f => f.arrival_times === arrival_times);
    }
    if (destination) {
      result = result.filter(f => f.destination === destination);
    }
    if (departure) {
      result = result.filter(f => f.departure === departure);
    }

    return res.status(200).json(result);
  },

  // [GET] /flight/:id
  
  findById: (req, res) => {
    const { id } = req.params;
    const flight = flights.find(f => f.uuid === id);
    if (!flight) return res.status(404).json({ error: "Not Found" });

   
    return res.status(200).json([flight]);
  },

  // [PUT] /flight/:id
  
  update: (req, res) => {
    const { id } = req.params;
    const patch = req.body;

    const flight = flights.find(f => f.uuid === id);
    if (!flight) return res.status(404).json({ error: "Not Found" });

    if ('uuid' in patch && patch.uuid !== id) {
      return res.status(400).json({ error: "uuid는 변경할 수 없습니다." });
    }

    const updatableFields = ['departure_times', 'arrival_times', 'destination', 'departure', 'airline'];
    updatableFields.forEach(field => {
      if (field in patch) {
        flight[field] = patch[field];
      }
    });

    return res.status(200).json(flight);
  },
};
