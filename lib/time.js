export const millisecondsToSecondsFromNow = (milliseconds) => {
  const compareTime = new Date(milliseconds);
  const now = new Date();
  const diff = now.getTime() - compareTime.getTime();
  const seconds = Math.floor((diff % 60000) / 1000);

  return seconds;
};
