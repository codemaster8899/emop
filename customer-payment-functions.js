var card;
var globalPayment;
var cardBrandToPfClass = {
	visa: 'card-visa',
	mastercard: 'card-mastercard',
	amex: 'card-amex',
	discover: 'card-discover',
	diners: 'card-diners_club',
	jcb: 'card-jcb',
	unknown: 'card-unknown',
};

class StripeService {
	static stripe;
	static stripeOptions;

	static getApiKey() {
		$.ajax({
			url: '/api/Checkout/GetStripeApiKey',
		}).done(function (response) {
			StripeService.stripe = Stripe(response);
			// var elements = StripeService.stripe.elements();

			// card = elements.create('cardNumber');
			// card.mount('#card-number');

			// card.on('change', function (event) {
			// 	if (event.brand) {
			// 		setBrandIcon(event.brand);
			// 	}
			// });

			// card = elements.create('cardCvc');
			// card.mount('#card-cvc');

			// card = elements.create('cardExpiry');
			// card.mount('#card-expiry');

			// forceReflow();
		});
	}

	static createPaymentForm(callback) {
		const options = {
			clientSecret: StripeService.stripeOptions.clientSecret,
			locale: 'en',
		};

		// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
		StripeService.stripeElements = StripeService.stripe.elements(options);

		// Create and mount the Payment Element
		const paymentElement = StripeService.stripeElements.create('payment', {
			fields: {
				billingDetails: {
					address: {
						country: 'never',
						postalCode: 'never', // Hide the postal code input
					},
					name: 'auto',
				},
			},
			terms: {
				auBecsDebit: 'never',
				bancontact: 'never',
				card: 'never',
				ideal: 'never',
				sepaDebit: 'never',
				sofort: 'never',
				usBankAccount: 'never',
			},
			// wallets: {
			// 	applePay: 'never',
			// 	googlePay: 'never',
			// },
		});
		paymentElement.mount('#payment-element');

		paymentElement.on('ready', function () {
			if (callback) {
				callback();
			}

			setTimeout(() => {
				window.scrollTo({
					top: document.getElementById('payment-element').getBoundingClientRect().top   + window.pageYOffset - 110,
					behavior: 'smooth',
				});
			}, 0);
		});

		console.log('StripeFormMount');
	}

	static orderFinalUpdate(data, callback) {
		$.post({
			url: '/api/v5/Checkout/OrderFinalUpdate',
			data,
		}).done(response => {
			if (response.userDeleted) {
				StripeService.paymentUserDeletedHandler(callback);
				return;
			}

			if (response.success) {
				StripeService.stripeOptions = response.content;
				StripeService.createPaymentForm(callback);
			} else {
				StripeService.errorPayment(response.error);
			}
		});
	}

	static updateCustomerDetails(data, callback, rerender) {
		if (rerender) {
			StripeService.cancelPayment(() => {
				StripeService.orderFinalUpdate(data, callback);
			}, true);
		} else {
			StripeService.orderFinalUpdate(data, callback);
		}
	}

	static confirmStripePayment(data, callback) {
		$('.booking-step__card-block--payment').removeClass('has-error');
		$('.top-error').removeClass('show');
		errorBlock.resetError();

		StripeService.stripe
			.confirmPayment({
				elements: StripeService.stripeElements, //`elements` instance that was used to create the Payment Element
				redirect: 'if_required',
				return_url: '/api/v5/Checkout/ConfirmCardAndPayment',
				confirmParams: {
					payment_method_data: {
						billing_details: {
							address: {
								country: null,
								postal_code: urlParam('postcode'),
							},
						},
					},
				},
			})
			.then(({ paymentIntent, error }) => {
				if (error) {
					switch (error.decline_code) {
						case 'requires_payment_method':
							StripeService.errorPayment('Wrong payment method');
							break;

						case 'do_not_honor':
						case 'insufficient_funds':
						case 'invalid_amount':
							StripeService.errorPayment(
								`Unfortunately, we can't connect to your bank to check your card balance. Please close current message and press 'Book your cleaning' one more time`,
							);
							break;

						case 'stolen_card':
						case 'merchant_blacklist':
						case 'pickup_card':
						case 'restricted_card':
							StripeService.errorPayment(
								`Some of your card details have been flagged as high risk fraud by our payment provider's system. We can't allow to process your booking.`,
							);
							break;
						default:
							StripeService.errorPayment(error.message);
							break;
					}
					console.log('StripePaymentError', error);

					//StripeService.cancelPayment(() => {
					//	StripeService.orderFinalUpdate(data, callback);
					//}, true);
					return;
				}

				globalPayment = paymentIntent;

				switch (paymentIntent?.status) {
					case 'requires_capture':
					case 'processing':
						StripeService.confirmCardAndPayment(data, callback);
						break;

					default:
						StripeService.cancelPayment(callback);
						break;
				}
			});
	}

	static confirmCardAndPayment(data, callback) {
		const formData = {
			name: data.name,
			surname: data.surname,
			comments: data.comments,
			address: data.address
		}
		$.post({
			url: '/api/v5/Checkout/ConfirmCardAndPayment',
			data: { ...formData, transactionId: StripeService.stripeOptions.transactionId },
		}).done(response => {
			if (response.userDeleted) {
				StripeService.paymentUserDeletedHandler(callback);
				return;
			}

			if (response.success) {
				StripeService.successPayment(data);
			} else {
				$('.top-error').addClass('show');
				errorBlock.errorMessage = 'Please check your payment details';
				$('div.booking-step__card-block--payment').addClass('has-error');
				$('div.booking-step__card-block--payment').addClass('payment-error');
				StripeService.errorPayment(response.error);
			}

			if (callback) {
				callback();
			}
		});
	}

	static paymentUserDeletedHandler(callback) {
		// Теперь, что делать, если пользователь удален:
		// ну во-первых выставить user.id в null
		// во-вторых вызвать /clientaccount/logout
		// в-третьих если будет повтор - начинать с первого шага.

		step3.userId = null;
		$.ajax({
			url: '/clientaccount/logout',
		}).done(response => {
			StripeService.errorPayment('User is deleted');
		});
	}

	static successPayment(data) {
		$('.fixed-header').removeClass('added');
		goToFinal();
		sendPageView('/Success');
		sendEvent('Registration_Success', data);
		deleteCookie('referral');
		window.pagesense = window.pagesense || [];
		window.pagesense.push(['trackEvent', 'Registration_Success']);
	}

	static cancelPayment(callback, rerender = false) {
		$.post({
			url: '/api/v5/Checkout/CancelCardAndPayment?transactionId=' + StripeService.stripeOptions.transactionId,
		}).done(response => {
			if (response.userDeleted) {
				StripeService.paymentUserDeletedHandler(callback);
				return;
			}

			if (response.success && rerender) {
				if (callback) {
					callback();
				}
				return;
			}

			if (response.success) {
				const signInUrl = step3?.signInUrl || app.signInUrl;
				StripeService.errorPayment(
					`It seems that you are one of our existing clients. Kindly Sign in <a href="${signInUrl}" class="booking-step__header-link">here</a>, or use the Sign in link on the top of the current page.`,
				);

				if (callback) {
					callback();
				}
			} else {
				StripeService.errorPayment(response.error);
			}
		});
	}

	static errorPayment(errorMessage, errorCode, errorReason) {
		errorBlock.errorCode = errorCode;
		errorBlock.errorMessage = errorMessage;
		step3.handlingStep3 = false;
		$('.modal-waiting').removeClass('show');
		$('.top-error').addClass('show');
		if (errorReason == 'promo_already_set') {
			errorBlock.errorCode = null;
		} else {
			$('.booking-step__card-block--payment').addClass('has-error');
		}
		$('.overlay').css('display', '');
		if (errorCode == 5) {
			resetPromo();
		}
	}
}

StripeService.getApiKey();

function confirmPayment(secret, intentId) {
	StripeService.stripe.handleCardPayment(secret).then(function (result) {
		if (result.error) {
			StripeService.errorPayment(result.error.message);
			$.ajax({
				url: '/api/Checkout/CancelPayment',
				method: 'POST',
				data: {
					intentId: intentId,
					errorCode: result.error.code,
				},
			});
		} else {
			$.ajax({
				url: '/api/Checkout/ConfirmPayment',
				method: 'POST',
				data: {
					intentId: intentId,
					promoId: promoId,
				},
				timeout: 20000,
			}).done(function (response) {
				if (response.success) {
					StripeService.successPayment();
				} else {
					StripeService.errorPayment(response.errorMessage, response.errorCode, response.reason);
				}
			});
		}
	});
}

// stripe methods
function getClassByBrand(brand) {
	if (brand == 'American Express') brand = 'amex';
	else brand = brand.split(' ')[0].toLowerCase();
	return cardBrandToPfClass[brand];
}

function setBrandIcon(brand) {
	var brandIconElement = document.getElementById('brand-icon');
	var pfClass = '';
	if (brand in cardBrandToPfClass) {
		pfClass = getClassByBrand(brand);
	}
	for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
		if (brandIconElement.classList[i] != 'card_number_img') brandIconElement.classList.remove(brandIconElement.classList[i]);
	}
	brandIconElement.classList.add(pfClass);
}

function forceReflow() {
	const StripeFields = $('.StripeElement');
	function fixField(field) {
		field.style.display = 'none';
		field.offsetHeight;
		field.style.display = 'block';
	}
	function isElementInViewport(el) {
		var rect = el.getBoundingClientRect();
		return rect.top > -1 && rect.bottom <= $(window).height();
	}
	$(window).on('scroll resize', function () {
		[].forEach.call(StripeFields, function (item) {
			if (isElementInViewport(item)) {
				if (isElementInViewport(item)) {
					setTimeout(function () {
						fixField(item);
					}, 0);
				}
			}
		});
	});
}
