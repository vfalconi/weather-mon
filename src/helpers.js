module.exports.reformatDate = (badDate) => {
	const month2Number = (month) => {
		const dictionary = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];

		return (dictionary.indexOf(month) + 1)
	};

	const to24Hr = (hour, meridiem) => {
		if (meridiem === 'PM' && hour < 12) {
			return hour + 12;
		}
		return hour;
	};

	const extractedDates = badDate.match(/^([A-Z]{1}[a-z]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{1,2}) (AM|PM)/);
	const extractedHour = parseInt(extractedDates[4], 10);
	const meridiem = extractedDates[5];

	const month = `${month2Number(extractedDates[1])}`.padStart(2, 0);
	const day = extractedDates[2].padStart(2, 0);
	const year = extractedDates[3].padStart(2, 0);
	const hour = `${to24Hr(extractedHour, meridiem)}`.padStart(2, 0);

	return `${year}-${month}-${day}T${hour}:00:00`;
};

module.exports.formatOffset = (offset) =>{
	const a = offset.slice(0, 3);
	const b = offset.replace(a, '');
	return `${a}:${b}`;
};
