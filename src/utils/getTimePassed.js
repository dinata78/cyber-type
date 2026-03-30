
export const getTimePassed = (date) => {
  let timeDifference = 0;
  
  if (date) {
    const currentDate = new Date();
    timeDifference = currentDate - (date.seconds * 1000);
  }

  const seconds = Math.floor(timeDifference / 1000);

  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"}`;
  }  
  else if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  else if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
  } 
  else {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  }
};
