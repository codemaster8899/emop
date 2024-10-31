var app = new Vue({
	el: '.carpet-upholstery-steps',
	data: {
		order: {
			id: urlParam('orderId'),
			fiber: 0,

			checkTheJob: false,
			pets: false,
			pickUpKey: 'no',
		},
		switchers: {
			upholstery: false,
			carpet: false,
			standard: false,
			delicate: false,
			leather: false,
		},
		bookingInfo: {},
		prices: {
			standard: {},
			delicate: {},
			leather: {},
		},
		questions: [],
		check: {
			minPrice: null,
		},
		promo: {
			id: urlParam('promoId'),
			word: null,
		},
		user: {
			id: null,
		},
		locationInfo: {
			postcode: urlParam('postcode'),
			addresses: null,
		},
		errors: {
			cleanDate: false,
			promo: false,

			personalData: false,
			financialInfo: false,
		},
		signInUrl: null,
		showRooms: false,
		skipUpdating: false,
		updateOrderRequest: null,
		cardPreStepVisible: false,
		orderFinallyUpdated: false,
	},
	methods: {
		getCarpetUpholsteryPrice(itemId, fiber) {
			if (fiber) {
				return this.prices[fiber][itemId];
			} else {
				return this.prices[itemId];
			}
		},
		toStep2() {
			var cleanDate = getCleanDate();
			this.errors.cleanDate = !cleanDate;
			if (this.errors.cleanDate) return;
			var adSource = getCookie('.Emop.AdSourceCookie');
			$.ajax({
				url: '/api/carpetupholstery/create',
				method: 'POST',
				data: {
					placeId: this.locationInfo.placeId,
					postcode: this.locationInfo.postcode,
					cleanDate: cleanDate.toISOString(),
					adSource: adSource,
				},
			}).done(response => {
				this.order.id = response.content.id;
				this.check = response.content;
				this.signInUrl = '/sign-in.html?postcode=' + this.locationInfo.postcode + '&orderId=' + this.order.id + '&type=carpet';
				if (adSource != 'Google') {
					deleteCookie('.Emop.AdSourceCookie', null);
				}
				goToStep2();
			});
		},
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
			var $input = $(`.booking-step__boxes #${name}`);
			$input.val(object[prop]);
			$input.siblings('.minus').prop('disabled', object[prop] == 0);
			this.updateOrder();
		},
		resetUpholstery(upholstery) {
			if (upholstery) {
				this.order[upholstery] = {};
				resetUpholsteryInputs(upholstery);
			} else {
				for (var fiber of ['standard', 'delicate', 'leather']) {
					this.order[fiber] = {};
					resetUpholsteryInputs(fiber);
				}
			}
			this.updateOrder();
		},
		resetCarpet() {
			for (var cleanAdd of allCleanAdds) {
				this.order[cleanAdd] = 0;
			}
			resetCarpetInputs();
			this.updateOrder();
		},
		applyPromo() {
			this.errors.promo = !this.promo.word;
			if (this.errors.promo) return;
			$.ajax({
				url: '/api/carpetupholstery/applypromo',
				method: 'POST',
				data: {
					orderId: this.order.id,
					promoWord: this.promo.word,
				},
				success: response => {
					this.errors.promo = !response.success;
					if (response.success) {
						this.promo.id = response.content.promoId;
						this.check.discount = response.content.discount;
						this.check.cleanPrice = response.content.cleanPrice;
						this.check.servicePrice = response.content.servicePrice;
						$('.carpet-upholstery-steps .booking-steps-check__promo').removeClass('booking-steps-check__promo--active');
						$('.carpet-upholstery-steps .booking-steps-check__discount').addClass('booking-steps-check__discount--active');
						this.signInUrl =
							'/sign-in.html?postcode=' +
							this.locationInfo.postcode +
							'&orderId=' +
							this.order.id +
							'&type=carpet&promoId=' +
							this.promo.id;
					}
				},
			});
		},
		roomsCount() {
			var sum = 0;
			sum += countProp(this.order, allCleanAdds);
			sum += this.upholsteryCount();
			return sum;
		},
		upholsteryCount() {
			var sum = 0;
			for (var fiber of ['standard', 'delicate', 'leather']) {
				var upholstery = this.order[fiber];
				if (upholstery) {
					sum += countProp(upholstery, upholsteryItems);
				}
			}
			return sum;
		},
		updateOrder() {
			this.order.priority = this.order.priorityText == 'Sounds great';
			if (this.updateOrderRequest) this.updateOrderRequest.abort();
			this.updateOrderRequest = $.ajax({
				url: '/api/carpetupholstery/details',
				method: 'POST',
				data: this.order,
			}).done(response => {
				this.check = response.content;
				this.showRooms = this.roomsCount() > 0;

				if (this.orderFinallyUpdated && currentStep == 3) {
					this.processPaymentData(true);
				}
			});
		},
		toStep3() {
			$('.top-error').removeClass('show');
			if (this.roomsCount() > 0) {
				goToStep3();

				if (this.orderFinallyUpdated) {
					this.processPaymentData(true);
				}
			} else {
				errorBlock.errorCode = 9198;
				$('.top-error').addClass('show');
			}
		},
		signIn() {
			localStorage.setItem('order', JSON.stringify(this.order));
			localStorage.setItem('check', JSON.stringify(this.check));
			localStorage.setItem('bookingInfo', JSON.stringify(this.bookingInfo));
			location.href = this.signInUrl;
		},
		toFinal() {
			$('.top-error').removeClass('show');
			this.errors.personalData = !$('#privacy_checkbox').prop('checked');
			this.errors.financialInfo = !$('#info_checkbox').prop('checked');

			this.order.address = $('.js-select-address').val();

			errorBlock.email = !this.user.email || !validateEmail(this.user.email);
			errorBlock.password = !this.user.id && !this.user.password;
			errorBlock.phone = !this.user.phone;
			errorBlock.name = !this.user.name;
			errorBlock.surname = !this.user.surname;
			errorBlock.address = !this.order.address;
			if (errorBlock.validationError) {
				$('.top-error').addClass('show');
			}
			if (this.errors.personalData || this.errors.financialInfo || errorBlock.validationError) return;

			var data = {
				orderId: this.order.id,
				userId: this.user.id,
				email: this.user.email,
				password: this.user.password,
				phone: this.locationInfo.phoneCode.replace('+', '') + this.user.phone.replace(/^0+/, ''),
				name: this.user.name,
				surname: this.user.surname,
				comments: this.order.comments,
				address: this.order.address,
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
			$('.top-error').removeClass('show');

			this.order.address = $('.js-select-address').val();

			errorBlock.email = !this.user.email || !validateEmail(this.user.email);
			errorBlock.password = !this.user.id && !this.user.password;
			errorBlock.phone = !this.user.phone;
			errorBlock.name = !this.user.name;
			errorBlock.surname = !this.user.surname;
			errorBlock.address = !this.order.address;
			if (errorBlock.validationError) {
				$('.top-error').addClass('show');
			}
			if (errorBlock.validationError) return;

			$('.modal-waiting').addClass('show');
			$('.overlay').fadeIn();
			var data = {
				orderId: this.order.id,
				userId: this.user.id,
				email: this.user.email,
				password: this.user.password,
				phone: this.locationInfo.phoneCode.replace('+', '') + this.user.phone.replace(/^0+/, ''),
				name: this.user.name,
				surname: this.user.surname,
				comments: this.order.comments,
				address: this.order.address,
			};
			if (!this.user.id) {
				var referral = getCookie('referral');
				$.ajax({
					url: '/clientaccount/registerorloginbyemail',
					method: 'POST',
					data: {
						login: this.user.email,
						password: this.user.password,
						phone: this.locationInfo.phoneCode.replace('+', '') + this.user.phone.replace(/^0+/, ''),
						referral: referral,
					},
				})
					.done(response => {
						if (response.result) {
							this.user.id = response.user.id;
							data.userId = this.user.id;

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
							$('.error-sign-in').attr('href', this.signInUrl);
							$('.modal-waiting').removeClass('show');
							$('.top-error').addClass('show');
						}
					});
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
		getPrices() {
			$.ajax({
				url: '/api/carpetupholstery/prices',
				method: 'POST',
				data: {
					placeId: this.locationInfo.placeId,
					fiber: this.order.fiber,
				},
			}).done(response => {
				this.prices = response.content;
			});
		},
		getQuestions() {
			$.ajax({
				url: '/api/carpetupholstery/questions',
			}).done(response => {
				this.questions = response.content.carpetUpholstery;
			});
		},
		getLocationInfo() {
			$.ajax({
				url: '/home/GetLocationInfo',
				data: {
					postcode: this.locationInfo.postcode,
				},
			}).done(response => {
				const data = JSON.parse(response)
				if (data.success) {
					this.locationInfo = data.content;
					saveLocationInfo(data.content);
					loadTime(data.content.placeId, initDateTime);
				}
			});
		},
		getCurrentUser() {
			$.ajax({
				url: '/api/Checkout/GetCurrentUser',
			}).done(response => {
				if (response) {
					this.user.id = response.id;
					this.user.email = response.email;
					this.user.phone = response.localPhone;
					this.user.name = response.name;
					this.user.surname = response.surname;
				}
			});
		},
		toMyBookings() {
			location.href = '/client-mybookings-upcoming.html';
		},
	},
	created() {
		if (this.locationInfo.postcode) {
			this.locationInfo.placeId = getPlacePostcode(this.locationInfo.postcode);
			var cachedInfo = loadLocationInfo(this.locationInfo.postcode);
			if (cachedInfo) {
				this.locationInfo = cachedInfo;
			}
		}
		if (this.order.id) {
			this.skipUpdating = true;
			this.order = JSON.parse(localStorage.getItem('order'));
			this.bookingInfo = JSON.parse(localStorage.getItem('bookingInfo'));

			$.ajax({
				url: '/api/carpetupholstery/details',
				method: 'POST',
				data: this.order,
			}).done(response => {
				this.check = response.content;
				this.showRooms = true;
				goToStep2();
				goToStep3();
			});
		}
		if (this.locationInfo.addresses == null) {
			this.getLocationInfo();
		} else {
			loadTime(this.locationInfo.placeId, initDateTime);
		}
		this.getCurrentUser();
		this.getPrices();
		this.getQuestions();
	},
	computed: {
		watchData() {
			return {
				fiber: this.order.fiber,
				checkTheJob: this.order.checkTheJob,
				pets: this.order.pets,
				pickUpKey: this.order.pickUpKey ? 'yes' : 'no',
				priority: this.order.priorityText,
			};
		},
	},
	watch: {
		watchData(newVal, oldVal) {
			if (this.skipUpdating) {
				this.skipUpdating = false;
				return;
			}
			this.updateOrder();
			if (newVal.fiber != oldVal.fiber) {
				this.getPrices();
			}
		},
		'switchers.upholstery': function (newVal) {
			if (!newVal) {
				this.resetUpholstery();
			}
		},
		'switchers.standard': function (newVal) {
			if (!newVal) {
				this.resetUpholstery('standard');
			}
		},
		'switchers.delicate': function (newVal) {
			if (!newVal) {
				this.resetUpholstery('delicate');
			}
		},
		'switchers.leather': function (newVal) {
			if (!newVal) {
				this.resetUpholstery('leather');
			}
		},
		'switchers.carpet': function (newVal) {
			if (!newVal) {
				this.resetCarpet();
			}
		},
	},
});

var errorBlock = new Vue({
	el: '.v-error-carpetupholstery',
	data: {
		email: false,
		password: false,
		phone: false,
		name: false,
		surname: false,
		address: false,
		errorCode: null,
		errorMessage: null,
	},
	computed: {
		validationError() {
			return this.email || this.password || this.phone || this.name || this.surname || this.address;
		},
	},
	methods: {
		resetError() {
			this.errorCode = null;
			this.errorMessage = null;
		},
	},
});

var getCleanDate = () => {
	var selectedItem = $('.datepicker--cell.datepicker--cell-day.-selected-');
	if (!selectedItem.length) return null;
	var date = selectedItem.data('date');
	var month = selectedItem.data('month');
	var year = selectedItem.data('year');

	var pickers = $('.timepicki-input');
	if (pickers.length != 2) return null;
	var hours = parseInt(pickers[0].value);
	var minutes = parseInt(pickers[1].value);
	var cleanDateLocal = new Date(year, month, date, hours, minutes);
	app.bookingInfo.cleanDateValue = cleanDateLocal;
	app.bookingInfo.cleanDate = dateToStr(cleanDateLocal);
	app.bookingInfo.cleanDay = days[cleanDateLocal.getDay()];
	return new Date(Date.UTC(year, month, date, hours, minutes));
};

function resetPromo() {
	$.ajax({
		url: '/api/v3/Checkout/ResetPromo',
		method: 'GET',
		data: {
			id: app.order.id,
		},
	}).done(function (response) {
		var paymentInfo = response.content;
		this.check.cleanPrice = paymentInfo.cleanPrice;
		this.check.servicePrice = paymentInfo.servicePrice;
		this.check.discount = paymentInfo.discount;
	});
}
$(document).ready(function () {
	if (app.order.id) {
		for (var prop in app.order) {
			if (app.order.hasOwnProperty(prop) && !!parseInt(app.order[prop])) {
				$(`.booking-step__boxes #${prop}`).val(app.order[prop]);
			}
		}
		if (app.upholsteryCount()) {
			$('#upholsteryInputstep').removeClass('booking-step__block--last');
			$('#upholsteryStep').addClass('booking-step__block--last active');
			initUpholstery(app.order.standard, 'standard');
			initUpholstery(app.order.delicate, 'delicate');
			initUpholstery(app.order.leather, 'leather');
		}
	}
});

var initUpholstery = (upholstery, value) => {
	if (upholstery) {
		var $input = $(`.upholsteryStep input[value="${value}"]`);
		if ($input.length) {
			$input.prop('checked', true);
			var $items = $input.parents('.js-subchecks').find('.js-subchecks-items');
			$items.addClass('active');
			for (var prop in upholstery) {
				if (upholstery.hasOwnProperty(prop) && typeof upholstery[prop] == 'number') {
					$items.find(`#${value.toLowerCase()}${prop}`).val(upholstery[prop]);
				}
			}
		}
	}
};

var resetUpholsteryInputs = value => {
	var $input = $(`.upholsteryStep input[value="${value}"]`);
	var $items = $input.parents('.js-subchecks').find('.js-subchecks-items');
	$items.find('input[type="text"]').val(0);
};

var resetCarpetInputs = () => {
	$('.booking-step__carpet-content').find('input[type="text"]').val(0);
};

var initDateTime = () => {
	if (app.order.id) {
		var cleanDate = new Date(app.bookingInfo.cleanDateValue);
		$('.booking-step__datepicker').datepicker().data('datepicker').selectDate(cleanDate);
		$('.timepicki-input').each((idx, item) => {
			idx === 0
				? (item.value = cleanDate.getHours())
				: (item.value = cleanDate.getMinutes() > 9 ? cleanDate.getMinutes() : `0${cleanDate.getMinutes()}`);
		});
	}
};
var step1,
	step3 = {},
	finalStep,
	checkDesktop = {};
