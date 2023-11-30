const vehicleCategorize = (data) => {
  let vehicles = {
    cars: [],
    bikes: []
  }
  data.map(vehicle => vehicle.type == "car" ? vehicles.cars.push(vehicle) : vehicles.bikes.push(vehicle))
  return vehicles
}

module.exports = {vehicleCategorize}