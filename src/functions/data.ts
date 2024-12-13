function groupSchedule(schedule: any[]){
  const groupedByDate = schedule.reduce((acc, obj) => {
    const date = new Date(obj.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(obj);
    return acc;
  }, {});
  return groupedByDate;
};

export {
  groupSchedule
}