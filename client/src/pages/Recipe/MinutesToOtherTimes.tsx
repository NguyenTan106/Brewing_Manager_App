export const minutesToOtherTimes = (minutes: number): string => {
  const days = Math.floor(minutes / 1440);
  const remainingAfterDays = minutes % 1440;

  const hours = Math.floor(remainingAfterDays / 60);
  const remainingMinutes = remainingAfterDays % 60;

  let result = "";

  if (days > 0) {
    result += `${days} ngày`;
    if (hours > 0) result += ` ${hours} giờ`;
    if (remainingMinutes > 0) result += ` ${remainingMinutes} phút`;
  } else if (hours > 0) {
    result += `${hours} giờ`;
    if (remainingMinutes > 0) result += ` ${remainingMinutes} phút`;
  } else {
    result = `${minutes} phút`;
  }

  return result.trim();
};
