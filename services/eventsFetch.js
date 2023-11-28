const Event = require("../models/event");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");

const getEventsWithinMonth = async (model, dayAttribute) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  try {
    const events = await model.find({
      $expr: {
        $eq: [{ $month: `$${dayAttribute}` }, currentMonth],
      },
    });
    const formattedEvents = events.map(event => ({id: event.id, title: event.title || event.name, date: event[dayAttribute]}))
    return formattedEvents;
  } catch (error) {
    console.error(`Error retrieving events for ${model.modelName}:`, error);
    return [];
  }
};

const getVehicleEventsWithinMonth = async (model, dayAttribute) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear()
  try {
    const insuranceEvents = await model.find({
      $expr: {
        $and: [
          { $gte: ["$warrantyData.insurance.endDate", new Date()] },
          { $eq: [{ $month: "$warrantyData.insurance.endDate" }, currentMonth] },
          { $eq: [{ $year: "$warrantyData.insurance.endDate" }, currentYear] }
        ]
      }
    }).lean();
    const pucEvents = await model.find({
      $expr: {
        $and: [
          { $gte: ["$warrantyData.Puc.endDate", new Date()] },
          { $eq: [{ $month: "$warrantyData.Puc.endDate" }, currentMonth] },
          { $eq: [{ $year: "$warrantyData.Puc.endDate" }, currentYear] }
        ]
      }
    }).lean();
    const lastServiceEvents = await model.find({
      $expr: {
        $and: [
          { $gte: ["$warrantyData.services.lastServiceDate", new Date()] },
          { $eq: [{ $month: "$warrantyData.services.lastServiceDate" }, currentMonth] },
          { $eq: [{ $year: "$warrantyData.services.lastServiceDate" }, currentYear] }
        ]
      }
    }).lean();

    const formattedInsuranceEvents = formatEventsData(insuranceEvents, "Insurance")
    const formattedPucEvents = formatEventsData(pucEvents, "Puc")
    const formattedServiceEvents = formatEventsData(lastServiceEvents, "Service")
    const allVehicleEvents = formattedInsuranceEvents.concat(formattedPucEvents, formattedServiceEvents)
    
    return allVehicleEvents;
  } catch (error) {
    console.error(`Error retrieving events for ${model.modelName}:`, error);
    return [];
  }
};

const formatEventsData = (events, type) => {
  const formattedEvents = events.map(event => {
    if (type === "Insurance") {
      return  extractEventData(event, `${type} will expire soon`, event.warrantyData.insurance.endDate)
    } else if (type === "Puc") {
      return  extractEventData(event, `${type} will expire soon`, event.warrantyData.Puc.endDate)
    } else {
      return  extractEventData(event, `${type} will expire soon`, event.warrantyData.services.lastServiceDate)
    }
  })
  return formattedEvents
}

const extractEventData = (event, reason, date) => {
  return ({id: event._id, title: event.title||event.name, reason, date })
}

const getAllEvents =  async () => {
  const usersWithinWeek = await getEventsWithinMonth(User, 'birthDay');
  const vehiclesWithinWeek = await getVehicleEventsWithinMonth(Vehicle, 'endData');
  const eventsWithinWeek = await getEventsWithinMonth(Event, 'birthDay');
  const allEvents = [...usersWithinWeek, ...vehiclesWithinWeek, ...eventsWithinWeek]
  return allEvents
}

module.exports = {getAllEvents}