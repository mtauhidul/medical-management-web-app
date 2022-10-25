const startTime = '2022-10-25T13:19:41.181Z';
const endTime = new Date().toISOString();
let current = new Date(endTime).valueOf();
let previous = new Date(startTime).valueOf();
let diff = current - previous;
let mins = Math.round((diff % 3600000) / 60000);
let hours = Math.floor(diff / 3600000);
const duration = `${hours}:${mins}`;

console.log(duration);
