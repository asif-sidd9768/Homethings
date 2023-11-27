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
  try {
    const events = await model.find({
      $expr: {
        $or: [
          { $eq: [{ $month: "$warrantyData.insurance.endDate" }, currentMonth] },
          { $eq: [{ $month: "$warrantyData.Puc.endDate" }, currentMonth] },
          { $eq: [{ $month: "$warrantyData.services.lastServiceDate" }, currentMonth] },
        ],
      },
    }).lean();
    const fEvents = events.map(event => {
      let changedValues = {};
      if (new Date(event.warrantyData.insurance.endDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
        changedValues[`reason`] = 'Insurance will expire soon';
        changedValues['date'] = event.warrantyData.insurance.endDate
      } else if (new Date(event.warrantyData.Puc.endDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
        changedValues[`reason`] = 'Puc will expire soon';
        changedValues['date'] = event.warrantyData.Puc.endDate
      } else if (new Date(event.warrantyData.services.lastServiceDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
        changedValues[`reason`] = 'Service will expire soon';
        changedValues['date'] = event.warrantyData.services.lastServiceDate
      }
      return { ...event, ...changedValues  };
    })
    
    const formattedEvents = fEvents.map(event => {
      return ({id: event._id, title: event.title || event.name, date: event.date, reason: event.reason})
    })
    return formattedEvents;
  } catch (error) {
    console.error(`Error retrieving events for ${model.modelName}:`, error);
    return [];
  }
};

const getAllEvents =  async () => {
  const usersWithinWeek = await getEventsWithinMonth(User, 'birthDay');
  const vehiclesWithinWeek = await getVehicleEventsWithinMonth(Vehicle, 'endData');
  const eventsWithinWeek = await getEventsWithinMonth(Event, 'birthDay');
  const allEvents = [...usersWithinWeek, ...vehiclesWithinWeek, ...eventsWithinWeek]
  return allEvents
}

module.exports = {getAllEvents}