function sendEvent(event, enhancedData) {
	if (!(typeof gtag === 'undefined')) {
		if (enhancedData) {
			const userData = {
				email: enhancedData.email,
				phone_number: enhancedData.phone,
				address: {
					first_name: enhancedData.name,
					last_name: enhancedData.surname,
					street: enhancedData.address,

					city: locationInfo.city,
					postal_code: locationInfo.postcode,
					// country: locationInfo.country,
					country: location.hostname.split('.').at(-1).toUpperCase(),
				},
			};
			gtag('set', 'user_data', userData);
			console.log('gtag conversion - enhancedData', userData);
		}

		gtag('event', event);
		if (event == 'Registration_Success' && window.location.host.includes('.co.uk')) {
			var param;

			if (checkDesktop.endOfTenancy) {
				param = 'AW-658252378/39RzCIn6vP0BENrE8LkC';
			} else if (checkDesktop.tariff == 'Weekly') {
				param = 'AW-658252378/CaWqCM33kssBENrE8LkC';
			} else if (checkDesktop.tariff == 'Fortnightly') {
				param = 'AW-658252378/uLHaCImbhMsBENrE8LkC';
			} else if (checkDesktop.tariff == 'Monthly') {
				param = 'AW-658252378/CjpcCJCYlssBENrE8LkC';
			} else if (checkDesktop.caption == 'Same day') {
				param = 'AW-658252378/l6QJCOeThMsBENrE8LkC';
			} else if (checkDesktop.caption == 'Next day') {
				param = 'AW-658252378/h07CCIG3icsBENrE8LkC';
			} else if (checkDesktop.caption == 'Night') {
				param = 'AW-658252378/R2_BCIT_kssBENrE8LkC';
			} else if (checkDesktop.caption == 'Peak') {
				param = 'AW-658252378/tuDfCPL_0NMBENrE8LkC';
			} else if (app.check.addressType == 5 || app.check.addressType == 6) {
				param = 'AW-658252378/p0dbCPTC1M8CENrE8LkC';
			} else if (app.check.addressType == 7) {
				param = 'AW-658252378/BKzMCPiasM8CENrE8LkC';
			} else if (app.check.addressType == 8 || app.check.addressType == 9) {
				param = 'AW-658252378/6HXoCI-msM8CENrE8LkC';
			}
			if (param) {
				gtag('event', 'conversion',
					{
						'send_to': param,
						'value': (globalPayment.amount / 100).toFixed(2),
						'currency': globalPayment.currency
					}
				);
			}
		}
		else if (event == 'Registration_Success' && window.location.host.includes('.ie')) {
			if (checkDesktop.endOfTenancy) {
				param = 'AW-658252378/Iyx2CIGCseEYENrE8LkC';
			} else if (checkDesktop.tariff == 'Weekly') {
				param = 'AW-658252378/8stKCIqCseEYENrE8LkC';
			} else if (checkDesktop.tariff == 'Fortnightly') {
				param = 'AW-658252378/BbC2CI2CseEYENrE8LkC';
			} else if (checkDesktop.tariff == 'Monthly') {
				param = 'AW-658252378/MwNUCJCCseEYENrE8LkC';
			} else if (checkDesktop.caption == 'Same day') {
				param = 'AW-658252378/1EZTCP6BseEYENrE8LkC';
			} else if (checkDesktop.caption == 'Next day') {
				param = 'AW-658252378/7y6qCPGdq-EYENrE8LkC';
			} else if (checkDesktop.caption == 'Night') {
				param = 'AW-658252378/llkNCIeCseEYENrE8LkC';
			} else if (checkDesktop.caption == 'Peak') {
				param = 'AW-658252378/rDhDCISCseEYENrE8LkC';
			} else if (app.check.addressType == 5 || app.check.addressType == 6) {
				param = 'AW-658252378/p0dbCPTC1M8CENrE8LkC';
			} else if (app.check.addressType == 7) {
				param = 'AW-658252378/BKzMCPiasM8CENrE8LkC';
			} else if (app.check.addressType == 8 || app.check.addressType == 9) {
				param = 'AW-658252378/6HXoCI-msM8CENrE8LkC';
			} else if (checkDesktop == {}) {
				param = 'AW-658252378/dUMRCJOCseEYENrE8LkC';
			}
			if (param) {
				gtag('event', 'conversion',
					{
						'send_to': param,
						'value': (globalPayment.amount / 100).toFixed(2),
						'currency': globalPayment.currency
					}
				);
			}
		}
	}
	if (!(typeof fbq === 'undefined')) {
		fbq('trackCustom', event + '_fb');
	}
	if (event == 'Registration_Success') {
	}

	console.log('event: ', event);
}

function sendPageView(page) {
	if (!(typeof gtag === 'undefined')) {
		gtag('config', 'UA-100426384-1', { page_path: page });
		gtag('event', 'page_view', { send_to: 'UA-100426384-1' });
	}
	if (!(typeof hj === 'undefined')) {
		hj('stateChange', window.location.origin + page);
		hj('vpv', page);
	}
	console.log('page: ', page);
}
