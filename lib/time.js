export const convertMillisecondsToSeconds = (milliseconds, fromDate) => {
  if (!milliseconds && milliseconds !== 0) {
    return null;
  }

  const compareTime = new Date(milliseconds);
  const diff = fromDate.getTime() - compareTime.getTime();
  const seconds = Math.floor((diff % 60000) / 1000);

  if (isNaN(seconds)) {
    return null;
  }

  return seconds;
};

export const validateUpdateStatus = (
  lastUpdated,
  callback,
  secondsThreshold = 1.5
) => {
  if (!lastUpdated) {
    callback();
    return false;
  }

  const currentDate = new Date();
  const secondsSinceLastUpdate = convertMillisecondsToSeconds(
    lastUpdated,
    currentDate
  );

  if (secondsSinceLastUpdate < secondsThreshold) {
    return false;
  }

  callback();
  return true;
};
