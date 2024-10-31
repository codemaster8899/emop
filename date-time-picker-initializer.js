var timeLoaded = false;
var timepickiInitialized = false;
function loadTime(placeId, callback) {
	if (timeLoaded) return;
	timeLoaded = true;
	$.ajax({
		url: '/api/data/gettime',
		method: 'POST',
		data: {
			placeId: placeId,
			isCarpet: typeof checkoutType !== 'undefined',
		},
	}).done(function (response) {
		timeInfo = response;
		setPickers();
		$('.booking-step--one .booking-step-buttons').css('display', '');
		if (callback) callback();
	});
}

var minDateTime;
function setPickers() {
	let dateString = '',
		weekDay = '';

	$.fn.datepicker.language['en'] = {
		days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yyyy',
		timeFormat: 'hh:ii aa',
		firstDay: 1,
	};
	if (!step1 || step1.subscription == 'Once') {
		var minHour = timeInfo.minTime.hour;
		var minMinute = timeInfo.minTime.minute;
		var minDay = timeInfo.days[0];
		var minDate = new Date(minDay.year, minDay.month - 1, minDay.day);
		minDateTime = new Date(minDay.year, minDay.month - 1, minDay.day, minHour, minMinute, 0, 0);
	} else {
		var subscriptionMinTime = new Date(timeInfo.subscriptionMinTime);
		var minHour = subscriptionMinTime.getHours();
		var minMinute = subscriptionMinTime.getMinutes().toString().padStart(2, '0');;
		var minDay = {
			year: subscriptionMinTime.getFullYear(),
			month: subscriptionMinTime.getMonth(),
			day: subscriptionMinTime.getDate(),
		};
		var minDate = new Date(minDay.year, minDay.month, minDay.day);
		minDateTime = new Date(Date.UTC(minDay.year, minDay.month, minDay.day, minHour, minMinute, 0, 0));
	}

	var currentMonth = new Date().getMonth();
	$('.booking-step__datepicker').datepicker({
		inline: true,
		language: 'en',
		defaultDate: minDate,
		nextHtml: `<svg width="10px" height="18px" viewBox="0 0 10 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="1-choose-cleaning" transform="translate(-510.000000, -1139.000000)" fill="#50606B" fill-rule="nonzero">
                  <polygon id="Path-56-Copy-3" points="510 1140.46179 511.397262 1139 520 1148 511.397262 1157 510 1155.53821 517.204699 1148"></polygon>
                </g>
              </g>
            </svg>`,
		prevHtml: `<svg width="10px" height="18px" viewBox="0 0 10 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="1-choose-cleaning" transform="translate(-494.000000, -1139.000000)" fill="#50606B" fill-rule="nonzero">
                        <polygon id="Path-56-Copy" transform="translate(499.000000, 1148.000000) scale(-1, 1) translate(-499.000000, -1148.000000) " points="494 1140.46179 495.397262 1139 504 1148 495.397262 1157 494 1155.53821 501.204699 1148"></polygon>
                    </g>
                </g>
            </svg>`,
		onSelect(formattedDate, date) {
			let block = $('.booking-step__block--date'),
				span = block.find('span:first');
			span.text('✔');
			let month = date.toLocaleString('en-EU', {
				month: 'long',
			}),
				day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			dateString = `${day} ${month} ${date.getFullYear()}`;
			weekDay = date.toLocaleString('en-EU', {
				weekday: 'long',
			});
			$('.booking-step__datepicker-value').val(formattedDate);
			$('.booking-step__datepicker').removeClass('has-error');
			validateTimePicker();
		},
		onRenderCell(date, cellType) {
			if (cellType == 'day') {
				var differenceInTime = date.getTime() - minDate.getTime();
				var daysGap = differenceInTime / (1000 * 3600 * 24);
				if (daysGap < 0 || daysGap > timeInfo.daysLimit) {
					return {
						classes: 'datepicker--cell--disabled',
						disabled: true,
					};
				}
			}
		},
		onChangeMonth() {
			$('.datepicker--cell--lock').removeClass('datepicker--cell--lock');
			$('.-disabled-').removeClass('-disabled-');
			var otherMonth = $('.-other-month-:not(.datepicker--cell--disabled)');
			otherMonth.addClass('datepicker--cell--lock -disabled-');
		},
	});

	if (!timepickiInitialized) {
		$('.booking-step__timepicker').timepicki({
			show_meridian: false,
			min_hour_value: 0,
			max_hour_value: 23,
			increase_direction: 'up',
			step_size_minutes: 30,
			start_time: [minHour, minMinute],
		});
		timepickiInitialized = true;
	}

	function resetTimepicker() {
		$('.timepicki-input').each((idx, item) => {
			idx === 0 ? (item.value = minHour) : (item.value = minMinute);
		});
	}

	resetTimepicker();

	function validateTimePicker() {
		var cleanDate = getCleanDate();
		if (cleanDate instanceof Date && !isNaN(cleanDate)) {
			var differenceInTime = cleanDate.getTime() - minDateTime.getTime();
			if (differenceInTime < 0 && isSameDay(cleanDate, minDateTime)) {
				resetTimepicker();
			}
		} else {
			resetTimepicker();
			$('.booking-step__datepicker').addClass('has-error');
		}

		if (step1 && step1.subscription != 'Once') {
			var hour = parseInt($('.time .timepicki-input').val());
			var mins = parseInt($('.mins .timepicki-input').val());
			if (hour < timeInfo.subscriptionMinHour) {
				$('.time .timepicki-input').val(timeInfo.subscriptionMinHour);
			}
			if (hour > timeInfo.subscriptionMaxHour) {
				$('.time .timepicki-input').val(timeInfo.subscriptionMaxHour);
			}
			if (hour == timeInfo.subscriptionMaxHour && mins > 0) {
				$('.mins .timepicki-input').val('00');
			}
		}
	}

	function isSameDay(date1, date2) {
		return date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate();
	}

	$('.time_pick .action-next, .time_pick .action-prev').on('click', function (e) {
		validateTimePicker();
	});
}

function getCleanDate() {
	var date = $('.booking-step__datepicker-value').val();
	var time = $('.booking-step__timepicker').val();
	if (date && time) {
		var dateTime = new Date(date + ' ' + time);
		if (!isNaN(dateTime.getTime())) {
			return dateTime;
		}
	}
	return null;
}
