/*
	check == checkout
*/
var trackOrderChanges;
var promoId = null;

var locationInfo = {
	postcode: urlParam('postcode'),
	addresses: [],
};

if (locationInfo.postcode) {
	locationInfo.placeId = getPlacePostcode(locationInfo.postcode);
	var cachedInfo = loadLocationInfo(locationInfo.postcode);
	if (cachedInfo) {
		locationInfo = cachedInfo;
	}
}

var subscriptionsLoaded;
var pricesLoaded;
var timeInfo;
var priceData;

function loadSubscriptions(placeId) {
	if (subscriptionsLoaded) return;
	subscriptionsLoaded = true;
	$.ajax({
		url: '/api/v4/checkout/subscriptions?placeId=' + placeId + '&postcode=' + locationInfo.postcode,
	}).done(function (response) {
		step1.subscriptions = response.content;
		checkout.subscriptions = response.content;
	});
}

function loadPrices(placeId) {
	if (pricesLoaded) return;
	pricesLoaded = true;
	$.ajax({
		url: '/api/v3/checkout/pricesandtimes?placeId=' + placeId,
	}).done(function (response) {
		var data = response.content;
		step1.studioTime = data.times.studio / 60;
		step1.endOfTenancyPrice = data.endOfTenancy;
		step2.endOfTenancyPrice = data.endOfTenancy;
		priceData = data;
		if (!step3.priorityPrice) {
			step3.priorityPrice = step2.isSubscription ? priceData.prioritySubscription : priceData.priority;
		}
	});
}

function loadZones() {
	$.ajax({
		url: '/api/v3/checkout/zones',
	}).done(function (response) {
		step1.zones = response.content;
	});
}

function loadInitialInfo() {
	if (locationInfo.placeId == null || !locationInfo.addresses.length) {
		$.ajax({
			url: '/home/GetLocationInfo',
			data: {
				postcode: locationInfo.postcode,
			},
		}).done(function (response) {
			const data = JSON.parse(response)
			if (data.success) {
				locationInfo = data.content;
				step3.phoneCode = locationInfo.phoneCode;
				loadTime(locationInfo.placeId);
				loadSubscriptions(locationInfo.placeId);
				loadPrices(locationInfo.placeId);
				saveLocationInfo(locationInfo);
				if (locationInfo.isInZone) {
					loadZones();
				}
				if (step3) {
					step3.addresses = locationInfo.addresses;
					if (step3.addresses.length) {
						step3.address = step3.addresses[0];
						$('.js-select-address').val(step3.address);
					}
				}
			}
		});
	}

	$.ajax({
		url: '/api/Checkout/GetCurrentUser',
	}).done(function (response) {
		if (response) {
			step3.userId = response.id;
			step3.email = response.email;
			step3.phone = response.localPhone;
			step3.name = response.name;
			step3.surname = response.surname;
		}
	});

	if (locationInfo.placeId) {
		loadTime(locationInfo.placeId);
		loadSubscriptions(locationInfo.placeId);
		loadPrices(locationInfo.placeId);
	}
}

loadInitialInfo();

sendPageView('/WhenToClean');

var _addsItemData = {
	amount: 0,
	display: false,
	maxValue: null,
	minValue: null,
	price: 0,
	pricePerAdd: 0,
	timePerAdd: 0,
};

var addsData = {
	checkTheJob: _addsItemData,
	pickUpKey: _addsItemData,
	pets: _addsItemData,
	dirtLevel: _addsItemData,
	studio: _addsItemData,
	endOfTenancy: _addsItemData,
	bedrooms: _addsItemData,
	livings: _addsItemData,
	bathrooms: _addsItemData,
	halls: _addsItemData,
	stairs: _addsItemData,
	toilets: _addsItemData,
	kitchens: _addsItemData,
	offices: _addsItemData,
	bookcase: _addsItemData,
	windows: _addsItemData,
	trays: _addsItemData,
	microwave: _addsItemData,
	fridge: _addsItemData,
	kitchenInside: _addsItemData,
	balcony: _addsItemData,
	bedMaking: _addsItemData,
	ironing: _addsItemData,
	cleaningProducts: _addsItemData,
	sanitise: _addsItemData,
	laundry: _addsItemData,
	oven: _addsItemData,
	ovenGrill: _addsItemData,
	conservatory: _addsItemData,
	priority: _addsItemData,
	garage: _addsItemData,
	outdoorCleaning: _addsItemData,
	chores: _addsItemData,
	hooverMop: _addsItemData,
};

var servicesData = {
	carpet: {
		bathroom: _addsItemData,
		diningRoom: _addsItemData,
		doubleBedroom: _addsItemData,
		hall: _addsItemData,
		largeRug: _addsItemData,
		livingRoom: _addsItemData,
		mediumRug: _addsItemData,
		office: _addsItemData,
		singleBedroom: _addsItemData,
		smallRug: _addsItemData,
		staircase: _addsItemData,
		throughLounge: _addsItemData,
		toilet: _addsItemData,
	},
	carpetDelicate: {
		bathroom: _addsItemData,
		diningRoom: _addsItemData,
		doubleBedroom: _addsItemData,
		hall: _addsItemData,
		largeRug: _addsItemData,
		livingRoom: _addsItemData,
		mediumRug: _addsItemData,
		office: _addsItemData,
		singleBedroom: _addsItemData,
		smallRug: _addsItemData,
		staircase: _addsItemData,
		throughLounge: _addsItemData,
		toilet: _addsItemData,
	},
	upholstery: {
		armchair: _addsItemData,
		armchairD: _addsItemData,
		armchairL: _addsItemData,
		doubleMattress: _addsItemData,
		doubleMattressD: _addsItemData,
		doubleMattressL: _addsItemData,
		fourSeaterSofa: _addsItemData,
		fourSeaterSofaD: _addsItemData,
		fourSeaterSofaL: _addsItemData,
		fullLengthCurtain: _addsItemData,
		fullLengthCurtainD: _addsItemData,
		fullLengthCurtainL: _addsItemData,
		halfLengthCurtain: _addsItemData,
		halfLengthCurtainD: _addsItemData,
		halfLengthCurtainL: _addsItemData,
		kingMattress: _addsItemData,
		kingMattressD: _addsItemData,
		kingMattressL: _addsItemData,
		singleMattress: _addsItemData,
		singleMattressD: _addsItemData,
		singleMattressL: _addsItemData,
		threeSeaterSofa: _addsItemData,
		threeSeaterSofaD: _addsItemData,
		threeSeaterSofaL: _addsItemData,
		twoSeaterSofa: _addsItemData,
		twoSeaterSofaD: _addsItemData,
		twoSeaterSofaL: _addsItemData,
	},
};

var step2RoomsItems = [
	{ id: 'bedrooms', icon: '/static/images/steps_booking/bedroom.svg', label: 'Bedroom' },
	{ id: 'livings', icon: '/static/images/steps_booking/living_dining.svg', label: 'Living/Dining room' },
	{ id: 'bathrooms', icon: '/static/images/steps_booking/bathroom.svg', label: 'Bathroom' },
	{ id: 'halls', icon: '/static/images/steps_booking/hall.svg', label: 'Hall' },
	{ id: 'stairs', icon: '/static/images/steps_booking/stairs.svg', label: 'Staircase' },
	{ id: 'toilets', icon: '/static/images/steps_booking/toilet.svg', label: 'Toilet' },
	{ id: 'kitchens', icon: '/static/images/steps_booking/kitchen.svg', label: 'Kitchen' },
	{ id: 'offices', icon: '/static/images/steps_booking/office.svg', label: 'Office room' },
	{ id: 'conservatory', icon: '/static/images/steps_booking/conservatory.svg', label: 'Conservatory' },
	{ id: 'garage', icon: '/static/images/bookAgain/Garage.svg', label: 'Garage' },
];

var step2ServicesItems = [
	{ id: 'fridge', icon: '/static/images/steps_booking/fridge_inside.svg', label: 'Fridge <em>(inside)</em>' },
	{ id: 'windows', icon: '/static/images/steps_booking/windows.svg', label: 'Windows <em>(inside)</em>' },
	{ id: 'ironing', icon: '/static/images/steps_booking/Ironing.svg', label: 'Ironing' },
	{ id: 'laundry', icon: '/static/images/steps_booking/Laundry.svg', label: 'Laundry' },
	{ id: 'microwave', icon: '/static/images/steps_booking/microwave.svg', label: 'Microwave <em>(inside)</em>' },
	{ id: 'kitchenInside', icon: '/static/images/steps_booking/kitchen_inside.svg', label: 'Kitchen <em>(inside)</em>' },
	{ id: 'bedMaking', icon: '/static/images/steps_booking/bed_making.svg', label: 'Bed making' },
	{ id: 'bookcase', icon: '/static/images/steps_booking/bookcase.svg', label: 'Bookcase' },
	{ id: 'oven', icon: '/static/images/steps_booking/Oven.svg', label: 'Oven' },
	{ id: 'ovenGrill', icon: '/static/images/steps_booking/Ovenandgrill.svg', label: 'Oven & Grill' },
	{
		id: 'outdoorCleaning',
		icon: '/static/images/bookAgain/Outdoor_cleaning.svg',
		label: 'Outdoor<br/>cleaning',
		info: `Outdoor cleaning includes anything from tidying to sweeping and washing down your patio/driveway & wiping of garden furniture as well as outside windows where reachable. (does not include any gardening services)`,
	},
];

//check models
var checkModel = {
	// todo remove unnecessary fields from checkModel (intersections)
	adds: addsData,
	services: servicesData,
	hasCarpetServiceItems: false,
	hasCarpetDelicateServiceItems: false,
	hasUpholsteryStandardServiceItems: false,
	hasUpholsteryDelicateServiceItems: false,
	hasUpholsteryLeatherServiceItems: false,

	subscription: null,
	tariff: null,
	intervalStart: null,
	intervalEnd: null,

	bedrooms: 0,
	livings: 0,
	bathrooms: 0,
	halls: 0,
	stairs: 0,
	toilets: 0,
	kitchens: 0,
	offices: 0,
	conservatory: 0,

	windows: 0,
	microwave: 0,
	bookcase: 0,
	kitchenInside: 0,
	bedMaking: 0,
	fridge: 0,
	ironing: 0,
	laundry: 0,
	oven: 0,
	ovenGrill: 0,
	garage: 0,
	outdoorCleaning: 0,
	chores: 0,

	dirtLevelLabel: 'Light',
	cleaningProducts: false,
	sanitise: false,
	endOfTenancy: false,
	hooverMop: false,
	studio: false,

	hasRooms: false,

	cleanDate: null,
	cleanDay: null,
	cleanTimeString: null,

	id: null,
	caption: null,
	cleanTime: null,
	cleanTime1: null,
	cleanTime2: null,
	pricePerHour1: null,
	pricePerHour2: null,
	cleanPrice: null,
	cleanPrice1: null,
	cleanPrice2: null,
	discount: null,
	cleanerCount: null,
	promo: null,
	promoWord: null,
	minPrice: null,
	servicePrice: null,

	endOfTenancyPrice: null,
	priorityPrice: null,
	studioPrice: null,

	showDirtLevel: true,
	dirtLevelClass: {
		'dirty-light': true,
		'dirty-medium': false,
		'dirty-heavy': false,
	},
};

var checkMethods = {
	changeAddsItem: function (prop, increment) {
		step2.changeAddsItem(prop, increment);
	},
	changeServicesItem: function (serviceName, itemName, increment, fiber) {
		step2.changeServicesItem(serviceName, itemName, increment, fiber);
	},
	reset: function (prop) {
		step2.changeAddsItem(prop, 0);
		setCleanAddTime(prop, step2);
	},
	resetServiceItem: function (serviceName, itemName, _increment, fiber) {
		step2.changeServicesItem(serviceName, itemName, 0, fiber);
	},
	applyPromo: function () {
		var data = {
			orderId: finalStep.id,
			promoWord: this.promoWord,
		};
		return $.ajax({
			url: '/api/checkout/applypromo',
			method: 'POST',
			data: data,
			success: function (response) {
				if (response.success) {
					checkFromObject(response.content);
					promoId = response.content.promoId;
					$('.booking-steps-check__promo').removeClass('booking-steps-check__promo--active');
					$('.booking-steps-check__discount').addClass('booking-steps-check__discount--active');
					step3.signInUrl =
						'/sign-in.html?postcode=' +
						locationInfo.postcode +
						'&orderId=' +
						finalStep.id +
						'&type=regular&promoId=' +
						checkDesktop.promoId;
				} else {
					var promoInput = $('.booking-steps-check__promo input');
					promoInput.addClass('input-error');
				}
			},
		});
	},
};

//check modules
var checkDesktop = new Vue({
	el: '.booking-steps-check--desktop',
	data: checkModel,
	methods: checkMethods,
});

var checkMobile = new Vue({
	el: '.booking-steps-check--mobile',
	data: checkModel,
	methods: checkMethods,
});

var checkout = new Vue({
	el: '.meta_title',
	data: {
		subscription: 'Once',
		subscriptions: [
			{
				subscriptions: [{}, {}, {}],
			},
			{
				subscriptions: [{}],
			},
			{
				subscriptions: [{}],
			},
			{
				subscriptions: [{}],
				rates: [{}, {}, {}, {}],
			},
		],
	}
})

var step1 = new Vue({
	el: '.booking-step--one',
	data: {
		subscription: 'Once',
		subscriptions: [
			{
				subscriptions: [{}, {}, {}],
			},
			{
				subscriptions: [{}],
			},
			{
				subscriptions: [{}],
			},
			{
				subscriptions: [{}],
				rates: [{}, {}, {}, {}],
			},
		],
		showCards: !urlParam('eot'),
		cashback: [null, null, null],
		handlingStep1: false,
		cleanDate: null,
		zones: null,
		month: 6,
		isSubscription: false,
		endOfTenancy: urlParam('eot') == 'true' ? 'yes' : 'no',
		endOfTenancyPrice: null,
		studio: 'no',
		studioTime: null,
	},
	watch: {
		subscription: {
			handler: function () {
				this.isSubscription = this.subscription != 'Once';
				if (this.isSubscription) {
					var subscriptions = step1.subscriptions.filter(item => {
						return item.name == step1.subscription;
					})[0].subscriptions;
					this.cashback = subscriptions.map(s => s.cashback);
				}
				setPickers();
			},
		},
	},
	methods: {
		toStep2: function () {
			if (this.handlingStep1) {
				return;
			}
			this.handlingStep1 = true;
			this.cleanDate = getCleanDate();

			if (!isNaN(this.cleanDate)) {
				step2.studio = parseBool(step1.studio);
				setCheckProp('studio', step2.studio);
				if (finalStep.id) {
					const subscription = getSubscription();
					updateOrderDetails(step2.$data, function (response) {
						transferToStep2(subscription, response);
					});
				} else {
					this.createOrder();
				}
			} else {
				$('.booking-step__datepicker').addClass('has-error');
				this.handlingStep1 = false;
			}
		},
		createOrder: function () {
			const adSource = getCookie('.Emop.AdSourceCookie');
			const subscription = getSubscription();
			const adds = [
				{ key: 'EndOfTenancy', value: parseBool(this.endOfTenancy) ? 1 : 0 },
				{ key: 'Studio', value: parseBool(this.studio) ? 1 : 0 },
			];

			const data = {
				placeId: locationInfo.placeId,
				postcode: locationInfo.postcode,
				latitude: locationInfo.latitude,
				longitude: locationInfo.longitude,
				subType: subscription,
				cleanDate: this.cleanDate.toEmop(),
				adSource: adSource,
				browser: getBrowserWithMob(),
				adds,
			};
			$.post({
				url: '/api/v5/Checkout/CreateOrder',
				data,
				success: function (response) {
					errorBlock.resetError();
					setOrderFields(response.content);

					transferToStep2(subscription, response);
					if (adSource != 'Google') {
						deleteCookie('.Emop.AdSourceCookie', null);
					}
				},
				error: function (request) {
					console.log('Error CreateOrder', request);
					errorBlock.show(request.responseJSON?.errorCode, request.responseJSON?.errorMessage);
				},
			});
		},
	},
});

function transferToStep2(subscription, response) {
	step2.endOfTenancy = step1.endOfTenancy;
	setCheckProp('endOfTenancy', parseBool(step1.endOfTenancy));
	setCheckProp('endOfTenancyPrice', response.content.endOfTenancyPrice);
	step3.priorityPrice = step1.isSubscription ? priceData.prioritySubscription : priceData.priority;
	if (step1.endOfTenancy == 'yes') {
		// $('#heavy').trigger('click');
		$('#heavy').parents('.booking-step__level-item').addClass('booking-step__level-item_with-lock');
		$('.booking-step__level-info--heavy').addClass('active');
		$('#light').siblings('label').addClass('disabled');
		$('#light').parents('.booking-step__level-item').addClass('disabled');
		$('#medium').siblings('label').addClass('disabled');
		$('#medium').parents('.booking-step__level-item').addClass('disabled');
	}
	if (step1.endOfTenancy == 'no' && !$('#heavy').parents('.booking-step__level-item').hasClass('booking-step__level-item_with-lock')) {
		$('.booking-step__level-info--light').addClass('active');
		$('#heavy').parents('.booking-step__level-item').removeClass('booking-step__level-item_with-lock');
		$('#light').siblings('label').removeClass('disabled');
		$('#light').parents('.booking-step__level-item').removeClass('disabled');
		$('#medium').siblings('label').removeClass('disabled');
		$('#medium').parents('.booking-step__level-item').removeClass('disabled');
	}
	step2.isSubscription = subscription > 0;
	step3.phoneCode = locationInfo.phoneCode;
	finalStep.id = response.content.id;
	setCheckProp('subscription', subscription);
	setCheckProp('cleanDay', days[step1.cleanDate.getDay()]);
	checkFromObject(response.content);
	if (response.content.cleanTime2 > 0) {
		setCheckProp('intervalStart', ' & £');
		setCheckProp('intervalEnd', ' h');
	}

	setCheckProp('cleanDate', dateToStr(response.content.cleanDate.fromEmopDate()));
	setCheckProp('cleanTimeString', getHMText(response.content.cleanTime1 + response.content.cleanTime2));

	setCheckProp('showDirtLevel', !step2.isSubscription);
	step3.signInUrl = '/sign-in.html?postcode=' + locationInfo.postcode + '&orderId=' + finalStep.id + '&type=regular';
	goToStep2();
	sendEvent('WhenToClean_Next');
	window.pagesense = window.pagesense || [];
	window.pagesense.push(['trackEvent', 'WhenToClean_Next']);
	sendPageView('/WhatToClean');
	showQuestions(2);
	step1.handlingStep1 = false;
	trackOrderChanges = true;

	// Mixed order
	step2.availableServices.carpet = !!response.content.services.carpet;
	step2.availableServices.carpetDelicate = !!response.content.services.carpetDelicate;
	step2.availableServices.upholstery = !!response.content.services.upholstery;
}

function getSubscription() {
	var name = step1.subscription;
	if (name == 'Once' || name == 'One - off') {
		return 0;
	}
	var subscription = step1.subscriptions
		.filter(item => {
			return item.name == name;
		})[0]
		.subscriptions.filter(item => {
			return item.month == step1.month;
		})[0];
	return subscription.id;
}

var updateOrderRequest;

var roomData = {
	bedrooms: 0,
	livings: 0,
	bathrooms: 0,
	halls: 0,
	stairs: 0,
	toilets: 0,
	kitchens: 0,
	offices: 0,
	windows: 0,
	microwave: 0,
	bookcase: 0,
	kitchenInside: 0,
	bedMaking: 0,
	fridge: 0,
	ironing: 0,
	oven: 0,
	ovenGrill: 0,
	conservatory: 0,
	garage: 0,
	outdoorCleaning: 0,
	chores: 0,
};

var serviceData = {
	cleaningProducts: 'no',
	sanitise: 'no',
	checkTheJob: 'no',
	pets: 'no',
	endOfTenancy: 'no',
	pickUpKey: 'no',
	laundry: 'no',
	hooverMop: 'no',
	priority: 'no',
	studio: 'no',
};

var step2Data = $.extend({}, roomData, serviceData, {
	// todo remove unnecessary fields from checkModel (intersections)
	adds: addsData,
	services: servicesData,
	roomsItems: step2RoomsItems,
	servicesItems: step2ServicesItems,

	keyComment: null,
	dirtLevel: 'Light',
	isSubscription: false,

	// CarpetUpholstery section
	availableServices: {
		carpet: false,
		carpetDelicate: false,
		upholstery: false,
	},
	hasCarpetServiceItems: false,
	hasCarpetDelicateServiceItems: false,
	hasUpholsteryStandardServiceItems: false,
	hasUpholsteryDelicateServiceItems: false,
	hasUpholsteryLeatherServiceItems: false,
	switchers: {
		upholstery: false,
		carpet: false,
		standard: false,
		delicate: false,
		leather: false,
	},
	mixedCarpetProps: {},
	mixedUpholsteryProps: {},
	prices: {
		standard: {},
		delicate: {},
		leather: {},
	},
	order: {
		id: null,
		fiber: 0,

		checkTheJob: false,
		pets: false,
		pickUpKey: false,
	},
});

var step2 = new Vue({
	el: '.booking-step--two',
	data: step2Data,
	computed: {
		dataForWatcher() {
			return _.cloneDeep(this.$data);
		},
	},
	watch: {
		dataForWatcher: {
			handler: function (val, oldVal) {
				if (!guardUpdating(val, oldVal)) return;
				if (updateOrderRequest) {
					updateOrderRequest.abort();
				}
				if (trackOrderChanges) {
					updateOrderRequest = updateOrderDetails(val);
				}
			},
			deep: true,
		},
		'order.fiber': function () {
			if (updateOrderRequest) {
				updateOrderRequest.abort();
			}
			if (trackOrderChanges) {
				updateOrderRequest = updateOrderDetails(this);
			}
		},
		// 'switchers.carpet': function () {
		// 	if (updateOrderRequest) {
		// 		updateOrderRequest.abort();
		// 	}
		// 	if (trackOrderChanges) {
		// 		updateOrderRequest = updateOrderDetails(this);
		// 	}
		// },
		// 'switchers.upholstery': function () {
		// 	if (updateOrderRequest) {
		// 		updateOrderRequest.abort();
		// 	}
		// 	if (trackOrderChanges) {
		// 		updateOrderRequest = updateOrderDetails(this);
		// 	}
		// },
	},
	methods: {
		getHMvalue(amount, timePerAdd) {
			return getHMText(amount * timePerAdd);
		},
		showQuestions: function () {
			showQuestions(1);
		},
		changeAddsItem: function (addsName, increment, specificValue) {
			const prop = this.adds[addsName];
			const newValue = specificValue || (increment ? this.adds[addsName].amount + increment : 0);

			if (!prop || newValue < 0 || (prop.maxValue && newValue > prop.maxValue) || (prop.minValue && newValue < prop.minValue)) {
				return;
			}

			this.adds[addsName].amount = newValue;

			if (updateOrderRequest) {
				updateOrderRequest.abort();
			}
			if (trackOrderChanges) {
				updateOrderRequest = updateOrderDetails(this);
			}
		},
		changeServicesItem: function (serviceName, itemName, increment, fiber) {
			const prop = this.services[serviceName][itemName];
			const newValue = increment ? this.services[serviceName][itemName].amount + increment : 0;

			if (
				!prop ||
				newValue < 0 ||
				!prop.amount ||
				(prop.maxValue && newValue > prop.maxValue) ||
				(prop.minValue && newValue < prop.minValue)
			) {
				return;
			}

			this.services[serviceName][itemName].amount = newValue;

			// todo
			let key = itemName.charAt(0).toUpperCase() + itemName.slice(1);
			if (fiber) {
				// 'Upholstery';
				if (newValue) {
					this.mixedUpholsteryProps[key] = newValue;
				} else {
					delete this.mixedUpholsteryProps[key];
				}
			} else {
				// 'Carpet';
				if (newValue) {
					this.mixedCarpetProps[key] = newValue;
				} else {
					delete this.mixedCarpetProps[key];
				}
			}

			if (updateOrderRequest) {
				updateOrderRequest.abort();
			}
			if (trackOrderChanges) {
				updateOrderRequest = updateOrderDetails(this);
			}
		},
		toStep3: function () {
			updateOrderDetails(this, function () {
				if (checkDesktop.hasRooms || checkDesktop.studio) {
					goToStep3();
					sendEvent('WhatToClean_Next');
					sendPageView('/PersonalInfoPayment');
					window.pagesense = window.pagesense || [];
					window.pagesense.push(['trackEvent', 'WhatToClean_Next']);
					showQuestions(3);
					errorBlock.resetError();
				} else {
					errorBlock.show(9198);
				}
			});
		},
		// carpetUpholstery mixed checkout
		updateProp(prop, newValue, navigation) {
			var object;
			if (navigation) {
				if (!this.order[navigation]) {
					this.order[navigation] = {};
				}
				object = this.order[navigation];
			} else {
				object = this.order;
			}
			if (!object[prop]) {
				object[prop] = 0;
			}
			if (newValue == '++') {
				object[prop]++;
			} else if (newValue == '--') {
				object[prop]--;
			} else {
				object[prop] = newValue;
			}
			var name = navigation ? `${navigation}${prop}` : prop;
			var $input = $(`.carpet-upholstery-steps .booking-step__boxes #${name}`);
			// $input.val(object[prop]);
			$input.siblings('.minus').prop('disabled', object[prop] == 0);

			this.setMixedProp(prop, object[prop], navigation);

			if (updateOrderRequest) {
				updateOrderRequest.abort();
			}
			if (trackOrderChanges) {
				updateOrderRequest = updateOrderDetails(this);
			}
		},
		setMixedProp(propName, propValue, fiber) {
			let key = propName.charAt(0).toUpperCase() + propName.slice(1);

			if (fiber) {
				// 'Upholstery';

				const keySuffix = fiber === 'standard' ? '' : fiber.charAt(0).toUpperCase();
				if (propValue) {
					this.mixedUpholsteryProps[key + keySuffix] = propValue;
				} else {
					delete this.mixedUpholsteryProps[key + keySuffix];
				}
			} else {
				// 'Carpet';

				if (propValue) {
					this.mixedCarpetProps[key] = propValue;
				} else {
					delete this.mixedCarpetProps[key];
				}
			}
		},
		getCarpetUpholsteryPrice(itemId, fiber) {
			if (fiber) {
				// Upholstery
				const suffix = fiber === 'delicate' ? 'D' : fiber === 'leather' ? 'L' : '';
				return this.services.upholstery?.[itemId + suffix]?.pricePerAdd;
			} else {
				// Carpet
				const service = this.order.fiber == '1' ? 'carpetDelicate' : 'carpet';
				return this.services[service]?.[itemId]?.pricePerAdd;
			}
		},
	},
});

var step3 = new Vue({
	el: '.booking-step--three',
	data: {
		userId: null,
		email: null,
		password: null,
		phoneCode: null,
		phone: null,
		name: null,
		surname: null,
		comments: null,
		address: locationInfo.addresses.length ? locationInfo.addresses[0] : null,
		addresses: locationInfo.addresses,
		paymentUserName: null,
		signInUrl: '#',
		handlingStep3: false,
		priority: null,
		priorityPrice: null,
		cardPreStepVisible: false,
		orderFinallyUpdated: false,
	},
	methods: {
		showQuestions() {
			showQuestions(2);
		},
		goToFinal: function () {
			if (this.handlingStep3) {
				return;
			}
			this.handlingStep3 = true;

			var hasError = false;
			$('.top-error').removeClass('show');
			errorBlock.resetError();
			$('#privacy_checkbox~.booking-step__card-block--checkbox').removeClass('has-error');
			$('#info_checkbox~.booking-step__card-block--checkbox').removeClass('has-error');
			$('.booking-step__label input[name=email]').removeClass('has-error');
			$('#password').removeClass('has-error');
			$('#phone').removeClass('has-error');
			$('.booking-step__label input[name=name]').removeClass('has-error');
			$('.booking-step__label input[name=surname]').removeClass('has-error');
			$('.booking-step__label--address .select2-selection.select2-selection--single').removeClass('has-error');

			var validationMessage = '';
			if (!$('#privacy_checkbox').prop('checked')) {
				$('#privacy_checkbox~.booking-step__card-block--checkbox').addClass('has-error');
				hasError = true;
			}
			if (!$('#info_checkbox').prop('checked')) {
				$('#info_checkbox~.booking-step__card-block--checkbox').addClass('has-error');
				hasError = true;
			}
			if (!this.email || !validateEmail(this.email)) {
				$('.booking-step__label input[name=email]').addClass('has-error');
				validationMessage += '- Please enter your email address <br>';
				hasError = true;
			}
			if (!this.userId && !this.password) {
				$('#password').addClass('has-error');
				validationMessage += '- Please enter your password <br>';
				hasError = true;
			}
			if (!this.phone) {
				hasError = true;
				validationMessage += '- Please enter your mobile number <br>';
				$('#phone').addClass('has-error');
			}
			if (!this.name) {
				hasError = true;
				validationMessage += '- Please enter your Name <br>';
				$('.booking-step__label input[name=name]').addClass('has-error');
			}
			if (!this.surname) {
				hasError = true;
				validationMessage += '- Please enter your Surname <br>';
				$('.booking-step__label input[name=surname]').addClass('has-error');
			}
			if (!$('.js-select-address').val()) {
				hasError = true;
				validationMessage += '- Please enter your property address <br>';
				$('.booking-step__label--address .select2-selection.select2-selection--single').addClass('has-error');
			}
			if (hasError) {
				this.handlingStep3 = false;
				if (validationMessage) {
					$('.top-error').addClass('show');
					errorBlock.errorMessage = validationMessage;
				}
				return;
			}

			var data = {
				orderId: finalStep.id,
				userId: this.userId,
				email: this.email,
				password: this.password,
				phone: this.phoneCode.replace('+', '') + this.phone.replace(/^0+/, ''),
				name: this.name,
				surname: this.surname,
				comments: this.comments,
				address: $('.booking-step__label--address .select2-selection__rendered').text(),
			};
			$('.modal-waiting').addClass('show');
			$('.overlay').fadeIn();
			StripeService.confirmStripePayment(data, () => {
				$('.modal-waiting').removeClass('show');
				$('.overlay').css('display', '');
				this.handlingStep3 = false;
			});
		},
		processPaymentData: function (rerender = false) {
			var hasError = false;
			$('.top-error').removeClass('show');
			errorBlock.resetError();
			$('#privacy_checkbox~.booking-step__card-block--checkbox').removeClass('has-error');
			$('#info_checkbox~.booking-step__card-block--checkbox').removeClass('has-error');
			$('.booking-step__label input[name=email]').removeClass('has-error');
			$('#password').removeClass('has-error');
			$('#phone').removeClass('has-error');
			$('.booking-step__label input[name=name]').removeClass('has-error');
			$('.booking-step__label input[name=surname]').removeClass('has-error');
			$('.booking-step__label--address .select2-selection.select2-selection--single').removeClass('has-error');

			var validationMessage = '';
			if (!this.email || !validateEmail(this.email)) {
				$('.booking-step__label input[name=email]').addClass('has-error');
				validationMessage += '- Please enter your email address <br>';
				hasError = true;
			}
			if (!this.userId && !this.password) {
				$('#password').addClass('has-error');
				validationMessage += '- Please enter your password <br>';
				hasError = true;
			}
			if (!this.phone) {
				hasError = true;
				validationMessage += '- Please enter your mobile number <br>';
				$('#phone').addClass('has-error');
			}
			if (!this.name) {
				hasError = true;
				validationMessage += '- Please enter your Name <br>';
				$('.booking-step__label input[name=name]').addClass('has-error');
			}
			if (!this.surname) {
				hasError = true;
				validationMessage += '- Please enter your Surname <br>';
				$('.booking-step__label input[name=surname]').addClass('has-error');
			}
			if (!$('.js-select-address').val()) {
				hasError = true;
				validationMessage += '- Please enter your property address <br>';
				$('.booking-step__label--address .select2-selection.select2-selection--single').addClass('has-error');
			}
			if (hasError) {
				if (validationMessage) {
					$('.top-error').addClass('show');
					errorBlock.errorMessage = validationMessage;
				}
				return;
			}
			$('.modal-waiting').addClass('show');
			$('.overlay').fadeIn();
			var data = {
				orderId: finalStep.id,
				userId: this.userId,
				email: this.email,
				password: this.password,
				phone: this.phoneCode.replace('+', '') + this.phone.replace(/^0+/, ''),
				name: this.name,
				surname: this.surname,
				comments: this.comments,
				address: $('.booking-step__label--address .select2-selection__rendered').text(),
			};
			if (!this.userId) {
				if (validateEmail(this.email)) {
					var referral = getCookie('referral');
					$.ajax({
						url: '/clientaccount/registerorloginbyemail',
						method: 'POST',
						data: {
							login: this.email,
							password: this.password,
							phone: this.phoneCode.replace('+', '') + this.phone.replace(/^0+/, ''),
							referral: referral,
						},
					})
						.done(response => {
							if (response.result) {
								this.userId = response.user.id;
								data.userId = this.userId;

								StripeService.updateCustomerDetails(
									data,
									() => {
										this.cardPreStepVisible = true;
										$('.modal-waiting').removeClass('show');
										$('.overlay').css('display', '');
										this.orderFinallyUpdated = true;
									},
									rerender,
								);
							}
						})
						.fail(error => {
							if (error.responseJSON.errorCode == 130) {
								errorBlock.errorCode = 11;
								$('.error-sign-in').attr('href', step3.signInUrl);
								$('.modal-waiting').removeClass('show');
								$('.top-error').addClass('show');
							}
						});
				} else {
					$('.booking-step__label input[name=email]').addClass('has-error');
					$('.modal-waiting').removeClass('show');
					$('.overlay').css('display', '');
				}
			} else {
				StripeService.updateCustomerDetails(
					data,
					() => {
						this.cardPreStepVisible = true;
						$('.modal-waiting').removeClass('show');
						$('.overlay').css('display', '');
						this.orderFinallyUpdated = true;
					},
					rerender,
				);
			}
		},
	},
	watch: {
		priority: {
			handler: function () {
				step2.priority = step3.priority === 'Sounds great' ? 'yes' : 'no';
			},
		},
	},
});
step3.phoneCode = locationInfo.phoneCode;

var finalStep = new Vue({
	el: '.booking-steps-final',
	data: {
		id: null,
	},
	methods: {
		toMyBookings: function () {
			location.href = '/client-mybookings-upcoming.html';
		},
	},
});

var errorBlock = new Vue({
	el: '.top-error',
	data: {
		errorCode: null,
		errorMessage: null,
		stillNeeded: true,
	},
	methods: {
		resetError() {
			this.errorCode = null;
			this.errorMessage = null;
			this.stillNeeded = false;
			$('.top-error').removeClass('show');
		},
		show(code, message) {
			if (!code && !message) {
				return;
			}
			this.errorCode = code;
			this.errorMessage = message;
			this.stillNeeded = true;

			setTimeout(() => {
				if (this.stillNeeded) {
					$('.top-error').addClass('show');
				}
			}, 300);
		},
	},
});

finalStep.id = urlParam('orderId');
setCheckProp('promoId', urlParam('promoId'));
if (checkDesktop.promoId) {
	promoId = checkDesktop.promoId;
}

if (finalStep.id) {
	loadOrderInfo();
}

function loadOrderInfo() {
	goToStep2();
	goToStep3();
	trackOrderChanges = false;
	showQuestions(3);
	if (checkDesktop.promoId) {
		$('.booking-steps-check__link').css({ color: 'transparent' });
		$('.booking-steps-check__link').css({ 'z-index': '-1' });
		$('.booking-steps-check__discount').addClass('booking-steps-check__discount--active');
	}
	$.get({ url: '/api/v5/Checkout/Order?id=' + finalStep.id }).done(function (response) {
		if (response.error) {
			alert(response.error);
		} else {
			setOrderFields(response.content);
		}
	});
}

//check functions
function setCheckProp(prop, value) {
	// check - is it float
	if (Number(value) === value && value % 1 !== 0) {
		value = +value.toFixed(2);
	}
	checkDesktop[prop] = value;
	checkMobile[prop] = value;
}

function setDirtLevelClass(dirtLevel) {
	if (!dirtLevel) return;
	checkDesktop.dirtLevelClass['dirty-light'] = false;
	checkDesktop.dirtLevelClass['dirty-medium'] = false;
	checkDesktop.dirtLevelClass['dirty-heavy'] = false;
	checkMobile.dirtLevelClass['dirty-light'] = false;
	checkMobile.dirtLevelClass['dirty-medium'] = false;
	checkMobile.dirtLevelClass['dirty-heavy'] = false;

	checkDesktop.dirtLevelClass['dirty-' + dirtLevel.toLowerCase()] = true;
	checkMobile.dirtLevelClass['dirty-' + dirtLevel.toLowerCase()] = true;
}

function checkFromObject(checkData) {
	for (var prop in checkData) {
		if (checkData.hasOwnProperty(prop)) {
			if (prop == 'cleanDate') {
				continue;
			}
			setCheckProp(prop, checkData[prop]);
		}
	}
	var currency = $('.fixed-header__price')[0].dataset.currency

	$('.fixed-header__date').text(checkDesktop.cleanDay + ' ' + checkDesktop.cleanDate);
	/*$('.fixed-header__price').text('£' + checkDesktop.servicePrice);*/
	$('.fixed-header__price').text(currency + checkDesktop.servicePrice);

	if (checkDesktop.minPrice && checkDesktop.minPrice > checkDesktop.servicePrice) {
		/*$('.fixed-header__min-price').text('£ ' + checkDesktop.minPrice);*/
		$('.fixed-header__min-price').text(currency + checkDesktop.minPrice);
		$('.fixed-header__min-price-wrapper').show();
	} else {
		$('.fixed-header__min-price-wrapper').hide();
	}
}

//step1 functions
window.getCleanDate = function () {
	var cleanDate = $('.booking-step__datepicker-value').val();
	var partsDate = cleanDate.split('/').map(function (el) {
		return parseInt(el);
	});
	var pickers = $('.timepicki-input');
	if (pickers.length != 2) {
		return NaN;
	}
	var cleanDateCheck = new Date(partsDate[2], partsDate[0] - 1, partsDate[1], parseInt(pickers[0].value), parseInt(pickers[1].value));
	setCheckProp('cleanDate', dateToStr(cleanDateCheck));
	return cleanDateCheck;
};

function guardUpdating(newVal, oldVal) {
	return (
		newVal.bedrooms != oldVal.bedrooms ||
		newVal.livings != oldVal.livings ||
		newVal.bathrooms != oldVal.bathrooms ||
		newVal.halls != oldVal.halls ||
		newVal.stairs != oldVal.stairs ||
		newVal.toilets != oldVal.toilets ||
		newVal.kitchens != oldVal.kitchens ||
		newVal.offices != oldVal.offices ||
		newVal.conservatory != oldVal.conservatory ||
		newVal.windows != oldVal.windows ||
		newVal.microwave != oldVal.microwave ||
		newVal.bookcase != oldVal.bookcase ||
		newVal.kitchenInside != oldVal.kitchenInside ||
		newVal.bedMaking != oldVal.bedMaking ||
		newVal.fridge != oldVal.fridge ||
		newVal.oven != oldVal.oven ||
		newVal.ovenGrill != oldVal.ovenGrill ||
		newVal.garage != oldVal.garage ||
		newVal.outdoorCleaning != oldVal.outdoorCleaning ||
		newVal.chores != oldVal.chores ||
		newVal.ironing != oldVal.ironing ||
		newVal.laundry != oldVal.laundry ||
		newVal.hooverMop != oldVal.hooverMop ||
		newVal.priority != oldVal.priority ||
		newVal.cleaningProducts != oldVal.cleaningProducts ||
		newVal.sanitise != oldVal.sanitise ||
		newVal.dirtLevel != oldVal.dirtLevel ||
		newVal.checkTheJob != oldVal.checkTheJob ||
		newVal.pets != oldVal.pets ||
		newVal.pickUpKey != oldVal.pickUpKey ||
		newVal.keyComment != oldVal.keyComment ||
		newVal.switchers.carpet != oldVal.switchers.carpet ||
		newVal.switchers.upholstery != oldVal.switchers.upholstery
	);
}
//step2 functions
function updateOrderDetails(orderData, callback) {
	var data = {
		id: finalStep.id,
		cleanDate: step1.cleanDate.toEmop(),
		keyComment: orderData.keyComment,
		subType: getSubscription(),
		adds: [],
		services: [],
	};

	for (var prop in roomData) {
		const key = prop.charAt(0).toUpperCase() + prop.slice(1);
		const value = orderData.adds[prop]?.amount;

		if (value) {
			data.adds.push({ key, value });
		}
	}

	for (var prop in serviceData) {
		const key = prop.charAt(0).toUpperCase() + prop.slice(1);
		let value = parseBool(prop) ? 1 : 0;

		switch (prop) {
			case 'endOfTenancy':
				value = parseBool(step1.endOfTenancy) ? 1 : 0;
				break;
			case 'studio':
				value = step2.studio ? 1 : 0;
				break;
			case 'priority':
				value = step2.priority == 'yes' ? 1 : 0;
				break;
			case 'laundry':
			case 'cleaningProducts':
			case 'hooverMop':
			case 'sanitise':
			case 'pickUpKey':
			case 'pets':
			case 'checkTheJob':
				value = step2.adds[prop].amount;
				break;
			default:
				break;
		}

		data.adds.push({ key, value });
	}
	data.adds.push({ key: 'DirtLevel', value: step2.isSubscription ? null : orderData.adds.dirtLevel.amount });

	if (orderData.switchers.carpet) {
		const props = [];
		Object.keys(orderData.mixedCarpetProps).forEach(key => {
			const value = orderData.mixedCarpetProps[key];
			props.push({ key, value });
		});

		const service = orderData.order.fiber == '1' ? 'CarpetDelicate' : 'Carpet';
		data.services.push({ key: service, value: props.length ? props : 1 });
	}

	if (orderData.switchers.carpet && orderData.switchers.upholstery) {
		const props = [];
		Object.keys(orderData.mixedUpholsteryProps).forEach(key => {
			const value = orderData.mixedUpholsteryProps[key];
			props.push({ key, value });
		});

		data.services.push({ key: 'Upholstery', value: props.length ? props : 1 });
	}

	return $.post({
		url: '/api/v5/Checkout/OrderDetails',
		data,
		success: function (response) {
			errorBlock.resetError();
			setOrderFields(response.content);

			if (callback) {
				callback(response);
			}

			if (step3.orderFinallyUpdated && currentStep == 3) {
				step3.processPaymentData(true);
			}
		},
		error: function (request) {
			errorBlock.show(request.responseJSON?.errorCode, request.responseJSON?.errorMessage);
		},
	});
}

function setCleanAddTime(property, orderAdds) {
	var value = orderAdds[property]?.amount;
	$(`.room-${property}`).data('currentValue', value);
}

function setOrderFields(orderModel) {
	trackOrderChanges = false;

	setCheckProp('cleanDate', dateToStr(orderModel.cleanDate.fromEmopDate()));
	setCheckProp('cleanTimeString', getHMText(orderModel.cleanTime1 + orderModel.cleanTime2));
	setCheckProp('cleanDay', days[orderModel.cleanDate.fromEmopDate().getDay()]);

	step1.cleanDate = orderModel.cleanDate.fromEmopDate();

	const isStudio = !!orderModel.adds.studio?.amount;
	step1.studio = boolToString(isStudio);
	step2.studio = isStudio;
	setCheckProp('studio', isStudio);

	const isEoT = !!orderModel.adds.endOfTenancy?.amount;
	step1.endOfTenancy = boolToString(isEoT);
	step2.endOfTenancy = isEoT;
	setCheckProp('endOfTenancy', isEoT);

	step3.priority = orderModel.adds.priority?.amount == 1 ? 'Sounds great' : 'Not for me';

	checkFromObject(orderModel);

	// Init adds
	step2.adds = orderModel.adds;
	setCheckProp('adds', orderModel.adds);
	setCheckProp(
		'hasRooms',
		Object.keys(orderModel.adds).some(x => roomData.hasOwnProperty(x) && orderModel.adds[x].amount),
	);

	initServices(orderModel.services);
	setCheckProp('services', orderModel.services);

	const dirtLevelValue = orderModel.adds.dirtLevel.amount;
	const dirtLevelLabel = dirtLevelValue == 1 ? 'Light' : dirtLevelValue == 2 ? 'Medium' : dirtLevelValue == 3 ? 'Heavy' : '';
	setCheckProp('dirtLevelLabel', dirtLevelLabel);
	setDirtLevelClass(dirtLevelLabel);

	setCleanAddTime('outdoorCleaning', orderModel.adds);
	setCleanAddTime('chores', orderModel.adds);
	setCleanAddTime('ironing', orderModel.adds);

	trackOrderChanges = true;
}

function initServices(services) {
	step2.services = services;
	setCheckProp('services', services);

	// todo
	step2.hasCarpetServiceItems = false;
	setCheckProp('hasCarpetServiceItems', false);
	step2.hasCarpetDelicateServiceItems = false;
	setCheckProp('hasCarpetDelicateServiceItems', false);
	step2.hasUpholsteryStandardServiceItems = false;
	setCheckProp('hasUpholsteryStandardServiceItems', false);
	step2.hasUpholsteryDelicateServiceItems = false;
	setCheckProp('hasUpholsteryDelicateServiceItems', false);
	step2.hasUpholsteryLeatherServiceItems = false;
	setCheckProp('hasUpholsteryLeatherServiceItems', false);

	// todo change it to Vue, not f*cking jQuery

	if (services.carpet) {
		Object.keys(services.carpet).forEach(itemKey => {
			const value = services.carpet[itemKey].amount;
			$('#' + itemKey).val(value);
			$('#' + itemKey + 'Checkbox').prop('checked', !!value);

			if (!step2.hasCarpetServiceItems && services.carpet[itemKey]?.amount) {
				step2.hasCarpetServiceItems = true;
				setCheckProp('hasCarpetServiceItems', true);
			}
		});
	}

	if (services.carpetDelicate) {
		Object.keys(services.carpetDelicate).forEach(itemKey => {
			const value = services.carpetDelicate[itemKey].amount;
			$('#' + itemKey).val(value);
			$('#' + itemKey + 'Checkbox').prop('checked', !!value);

			if (!step2.hasCarpetDelicateServiceItems && services.carpetDelicate[itemKey]?.amount) {
				step2.hasCarpetDelicateServiceItems = true;
				setCheckProp('hasCarpetDelicateServiceItems', true);
			}
		});
	}

	if (services.upholstery) {
		Object.keys(services.upholstery).forEach(itemKey => {
			var selector = itemKey;
			var selectorPrefix = '';
			var value = services.upholstery[itemKey].amount;

			if (itemKey.endsWith('D')) {
				selector = itemKey.substring(0, itemKey.length - 1);
				selectorPrefix = 'delicate';
				if (!step2.hasUpholsteryDelicateServiceItems && value) {
					step2.hasUpholsteryDelicateServiceItems = true;
					setCheckProp('hasUpholsteryDelicateServiceItems', true);
				}
			} else if (itemKey.endsWith('L')) {
				selector = itemKey.substring(0, itemKey.length - 1);
				selectorPrefix = 'leather';
				if (!step2.hasUpholsteryLeatherServiceItems && value) {
					step2.hasUpholsteryLeatherServiceItems = true;
					setCheckProp('hasUpholsteryLeatherServiceItems', true);
				}
			} else {
				selector = itemKey;
				selectorPrefix = 'standard';
				if (!step2.hasUpholsteryStandardServiceItems && value) {
					step2.hasUpholsteryStandardServiceItems = true;
					setCheckProp('hasUpholsteryStandardServiceItems', true);
				}
			}
			$('#' + selectorPrefix + selector).val(value);
			$('#' + selector + selectorPrefix).prop('checked', !!value);
		});
	}
}

function parseBool(boolString) {
	return boolString === 'yes';
}

function boolToString(boolValue) {
	return boolValue ? 'yes' : 'no';
}

function resetPromo() {
	$.ajax({
		url: '/api/v3/Checkout/ResetPromo',
		method: 'GET',
		data: {
			id: finalStep.id,
		},
	}).done(function (response) {
		var paymentInfo = response.content;
		checkFromObject(paymentInfo);
		$('.booking-steps-check__link').css({ color: '' });
		$('.booking-steps-check__link').css({ 'z-index': '' });
		$('.booking-steps-check__discount').removeClass('booking-steps-check__discount--active');
	});
}

function showQuestions(stepNumber) {
	if (stepNumber == 1) {
		$('.booking-steps-faq__item-when-to-clean').css('display', '');
		$('.booking-steps-faq__item-what-to-clean').css('display', 'none');
	}
	if (stepNumber == 2) {
		$('.booking-steps-faq__item-when-to-clean').css('display', 'none');
		$('.booking-steps-faq__item-what-to-clean').css('display', '');
		$('.booking-steps-faq__item-address-payment').css('display', 'none');
	}
	if (stepNumber == 3) {
		$('.booking-steps-faq__item-what-to-clean').css('display', 'none');
		$('.booking-steps-faq__item-address-payment').css('display', '');
	}
}
