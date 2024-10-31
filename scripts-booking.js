$(document).ready(function () {
	new WOW().init();

	/** Set Active class for button **/
	$(document).on('click', '.booking-step__button', function () {
		$('.booking-step__button').removeClass('booking-step__button--active');
		$(this).addClass('booking-step__button--active');
	});

	/** Set Active class for input **/
	$('.booking-step__card').on('click', function () {
		$('.booking-step__card').removeClass('booking-step__card--active');
		$(this).addClass('booking-step__card--active');
	});

	// Initialize Datepicker
	//let dateString = '',
	//    weekDay = '';

	//$.fn.datepicker.language['en'] = {
	//    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	//    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	//    daysMin: ['Sun', 'Mon', 'Tue', 'Wes', 'Thu', 'Fri', 'Sat'],
	//    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	//    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	//    today: 'Today',
	//    clear: 'Clear',
	//    dateFormat: 'mm/dd/yyyy',
	//    timeFormat: 'hh:ii aa',
	//    firstDay: 1
	//};

	//$('.booking-step__datepicker').datepicker({
	//    inline: true,
	//    language: 'en',
	//    nextHtml: `<svg width="10px" height="18px" viewBox="0 0 10 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	//          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
	//            <g id="1-choose-cleaning" transform="translate(-510.000000, -1139.000000)" fill="#50606B" fill-rule="nonzero">
	//              <polygon id="Path-56-Copy-3" points="510 1140.46179 511.397262 1139 520 1148 511.397262 1157 510 1155.53821 517.204699 1148"></polygon>
	//            </g>
	//          </g>
	//        </svg>`,
	//    prevHtml: `<svg width="10px" height="18px" viewBox="0 0 10 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	//            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
	//                <g id="1-choose-cleaning" transform="translate(-494.000000, -1139.000000)" fill="#50606B" fill-rule="nonzero">
	//                    <polygon id="Path-56-Copy" transform="translate(499.000000, 1148.000000) scale(-1, 1) translate(-499.000000, -1148.000000) " points="494 1140.46179 495.397262 1139 504 1148 495.397262 1157 494 1155.53821 501.204699 1148"></polygon>
	//                </g>
	//            </g>
	//        </svg>`,
	//    onSelect(formattedDate, date) {
	//        let block = $('.booking-step__block--date'),
	//            span = block.find('span:first');
	//        span.text('✔');
	//        let month = date.toLocaleString('en-EU', {
	//            month: 'long'
	//        }),
	//            day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
	//        dateString = `${day} ${month} ${date.getFullYear()}`;
	//        weekDay = date.toLocaleString('en-EU', {
	//            weekday: 'long'
	//        });
	//    },
	//    onRenderCell(date, cellType) {
	//        let year = date.getFullYear(),
	//            currentYear = new Date().getFullYear(),
	//            month = date.getMonth(),
	//            currentMonth = new Date().getMonth(),
	//            day = date.getDate(),
	//            currentDay = new Date().getDate();
	//        if (cellType === 'day' && year > currentYear) {
	//            return {
	//                classes: 'datepicker--cell--lock'
	//            }
	//        }
	//        if (cellType === 'day' && day < currentDay && month <= currentMonth && year === currentYear) {
	//            return {
	//                classes: 'datepicker--cell--disabled',
	//                disabled: true
	//            }
	//        }
	//        if (cellType === 'day' && year < currentYear) {
	//            return {
	//                classes: 'datepicker--cell--disabled',
	//                disabled: true
	//            }
	//        }
	//        if (cellType === 'day' && month > currentMonth) {
	//            return {
	//                classes: 'datepicker--cell--lock'
	//            }
	//        }

	//    }
	//});

	/** Initialize Timepicker **/
	//$('.booking-step__timepicker').timepicki({
	//    show_meridian: false,
	//    min_hour_value: 0,
	//    max_hour_value: 23,
	//    increase_direction: 'up'
	//});

	//$('.timepicki-input').each((idx, item) => {
	//    idx === 0 ? item.value = new Date().getHours() : (item.value = new Date().getMinutes() > 9 ? new Date().getMinutes() : `0${new Date().getMinutes()}`);
	//});

	/** Dropdown **/
	$(document).on('click', '.booking-steps-faq__item', function () {
		if ($(this).hasClass('booking-steps-faq__item--active')) {
			$(this).find('.booking-steps-faq__content').slideUp();
		} else {
			$(this).find('.booking-steps-faq__content').slideToggle();
		}
		$(this).toggleClass('booking-steps-faq__item--active');
	});

	/** Show or Hide Textarea **/

	$(window).on('load', function () {
		if ($('.js-show-textarekeys:checked').val() === 'yes') {
			$('.booking-step__choose-msg').addClass('booking-step__choose-msg--active');
		} else $('.booking-step__choose-msg').removeClass('booking-step__choose-msg--active');
	});
	$('.js-show-textarekeys').on('click', function () {
		let val = $(this).val();
		if (val === 'yes') {
			$('.booking-step__choose-msg').addClass('booking-step__choose-msg--active');
		} else $('.booking-step__choose-msg').removeClass('booking-step__choose-msg--active');
	});

	/** calc **/
	$('.plus').on('click', function (e) {
		e.stopImmediatePropagation();
		if (typeof checkoutType !== 'undefined') return;
		let input = $(this).siblings('input'),
			val = input.val();
		if (+val === 0) $(this).parent().parent().siblings('input').prop('checked', true);

		val++;
		input.val(+val);
		input[0].dispatchEvent(new Event('input'));
	});
	let ifClick = true;
	$('.minus').on('click', function (e) {
		e.stopImmediatePropagation();
		if (typeof checkoutType !== 'undefined') return;
		let input = $(this).siblings('input'),
			val = input.val();
		if (val > 0) val--;
		input.val(+val);
		input[0].dispatchEvent(new Event('input'));
		if ($(this).parent().parent().siblings('input').length !== 0 && +val < 1) {
			$(this).parent().parent().siblings('input')[0].checked = false;
		}
	});
	//$('.booking-step__box-label').on('click', function (e) {
	//    let val = $(this).find('.booking-step__box-row').find('input').val();
	//    if (val === '0' && ifClick) {
	//        var input = $(this).find('.booking-step__box-row').find('input')
	//        input.val('1');
	//        input[0].dispatchEvent(new Event('input'));
	//    }
	//});
	/** Change text **/
	$('input[type="radio"], input[type="checkbox"]').on('change', function () {
		let block = $(this).closest('.booking-step__block'),
			span = block.find('span:first');
		span.text('✔');
	});

	$('input, textarea').on('change', function () {
		if ($(this).val()) {
			let block = $(this).closest('.booking-step__block'),
				span = block.find('span:first');
			span.text('✔');
		}
	});

	/** Go to 2-d and 3-d screen, and set info **/
	$('.js-goTo-prestep').on('click', goToPrestep);

	$('.js-goTo-step1').on('click', goToStep1);

	$('.js-goTo-step2').on('click', goToStep2);

	$('.js-goTo-step3').on('click', goToStep3);

	$('.js-goTo-final').on('click', goToFinal);

	$('.booking-steps-check__link').on('click', function (e) {
		e.preventDefault();
		$(this).css({ color: 'transparent' });
		$('.booking-steps-check__promo').addClass('booking-steps-check__promo--active');
		$(this).css({ 'z-index': '-1' });
	});
	let promoInput = $('.booking-steps-check__promo').find('input');
	promoInput.on('input', function () {
		if ($(this).val().length > 5) {
			setTimeout(() => {
				$('.js-send-promo').addClass('active-promo');
			}, 1300);
		} else {
			$('.js-send-promo').removeClass('active-promo');
		}
	});
	$('.js-send-promo').on('click', function () {
		let promoInput = $(this).siblings('input');
		if (promoInput[0].value) {
			$('.booking-steps-check__promo').removeClass('booking-steps-check__promo--active');
			$('.booking-steps-check__discount').addClass('booking-steps-check__discount--active');
		} else {
			promoInput.addClass('input-error');
		}
	});

	$('.js-select-address').select2({
		placeholder: '',
	});

	$('textarea').on('input', function () {
		let length = $(this).val().length;
		$(this).siblings('.counter').find('p.currentLength').text(length);
	});

	autosize($('textarea'));

	/** Setting for inputs by card holder **/
	function formatCardCode() {
		let cardCode = $(this).val().replace(/[^\d]/g, '').substring(0, 16);
		cardCode = cardCode !== '' ? cardCode.match(/.{1,4}/g).join(' ') : '';
		$(this).val(cardCode);
	}

	$('.js-card-number').on('input', formatCardCode);

	$('.js-card-date').on('input', formatCardCode);

	$('.js-card-cvc').on('input', formatCardCode);

	/** Show password **/
	$('.js-show-pass').on('click', function () {
		$(this).toggleClass('close-eye');
		let input = $($(this).attr('toggle'));
		input.attr('type') === 'password' ? input.attr('type', 'text') : input.attr('type', 'password');
	});

	/** DropDown  **/
	$('.js-dropdown-check').on('click', function () {
		let parent = $(this).closest('.booking-steps-check--mobile'),
			content = $('.booking-steps-check__content');

		if (content.is(':visible')) {
			content.slideUp();
			$(this).removeClass('booking-steps-check__shopping--full');
			$('.booking-steps-check__close').fadeOut(100);
			$('body').css('overflow-y', 'auto');
			$('.booking-steps__form').css('z-index', 10)
		} else {
			content.slideDown();
			$(this).addClass('booking-steps-check__shopping--full');

			$.when($(this).addClass('booking-steps-check__shopping--full')).then(function () {
				parent.find('.booking-steps-check--mob-content').css({
					'overflow-y': 'scroll',
					'overflow-x': 'hidden',
				});
			}).then(function () {
				$('.booking-steps-check__close').fadeIn(100);
				$('body').css('overflow-y', 'hidden'); // Hide body scroll
				$('.booking-steps__form').css('z-index', 1)
			});
		}
	});


	$('.js-close-check').on('click', function () {
		$(this).fadeOut();
		$('.js-dropdown-check').removeClass('open');
		$('.js-shoping-card-counter').fadeIn();
		$('.booking-steps-check__content').fadeOut();
		$('.booking-steps-check--mobile').removeClass('booking-steps-check--dropdown');
		$('.js-dropdown-check').removeClass('booking-steps-check__shopping--full booking-steps-check__shopping--hide');
		$('.js-dropdown-check').addClass('booking-steps-check__shopping--reverse');
		$('.booking-steps').removeClass('booking-steps--hidden');
		$('.booking-steps-check').removeClass('booking-steps-check--ohidden');
		$('.booking-steps-check').find('.booking-steps-check--mob-content').css({
			overflow: 'initial',
		});
	});

	let isOpenDrop = false;
	$('.booking-step__card-block--checkbox').on('click', function (e) {
		e.preventDefault();
		let isChecked = !!$(this).siblings('input').attr('checked');
		isChecked = isChecked === false ? true : false;
		$(this).parent('.booking-step__card-block').toggleClass('booking-step__card-block--checked');
		$(this).siblings('input').attr('checked', isChecked);
	});

	function forceReflow(selector) {
		const [el] = document.querySelectorAll(selector);
		if (el) {
			el.style.display = 'none';
			el.offsetHeight;
			el.style.display = 'block';
		}
	}

	$(window).on('scroll', function () {
		let scrollTop = $(window).scrollTop();

		if ($('.js-stripe-step').hasClass('animated')) {
			forceReflow('.StripeElement');
		}

		if (scrollTop > 30) {
			$('.booking-steps-header').addClass('booking-steps-header--scroll');
		} else {
			$('.booking-steps-header').removeClass('booking-steps-header--scroll');
		}
		if (scrollTop > 100) {
			$('.booking-steps__info').addClass('booking-steps__info--scroll');
		} else {
			$('.booking-steps__info').removeClass('booking-steps__info--scroll');
		}
		if (scrollTop > 520) {
			$('.js-booking-steps-check').addClass('booking-steps-check--top');

			if ($('.booking-steps-check-drop').hasClass('booking-steps-check-drop--active') && !isOpenDrop) {
				$('.booking-steps-check-drop').removeClass('booking-steps-check-drop--active');
			}
		} else if (scrollTop === 0) {
			$('.booking-steps-check-drop').removeAttr('style');
			if ($('.booking-steps-check__item--top').hasClass('booking-steps-check__item--reverse')) {
				$('.booking-steps-check__item--top').removeClass('booking-steps-check__item--reverse');
			}
			$('.booking-steps-check--date--hidden').removeAttr('style');
			isOpenDrop = false;
		} else {
			$('.js-booking-steps-check').removeClass('booking-steps-check--top');
			// $('.booking-steps-check--date--hidden').fadeOut()
			$('.booking-steps-check-drop').addClass('booking-steps-check-drop--active');
		}

		if (scrollTop > 130 && $('.fixed-header').length) {
			$('.fixed-header').addClass('fixed');
			$('.fixed-header').removeClass('static');
		} else {
			$('.fixed-header').addClass('static');
		}
		if (scrollTop > 10 && $('.fixed-header').length) {
			$('.fixed-header').addClass('fixed-on-top');
			$('.booking-steps-check--mobile').css('top', '40px');
			$('.booking-steps-check__content').css('margin-top', 0);
		} else {
			$('.fixed-header').removeClass('fixed-on-top');
			$('.booking-steps-check--mobile').css('top', '70px');
			$('.booking-steps-check__content').css('margin-top', '100px');
		}
		if (!(scrollTop > 100 && $('.fixed-header').length)) {
			$('.fixed-header').removeClass('static');
			$('.fixed-header').removeClass('fixed');
		}
	});

	$('.fixed-header').on('click', function () {
		$('.js-dropdown-check').trigger('click');
		$('.js-dropdown-check').addClass('open');
	});

	$('.booking-steps-header__item').on('click', function () {
		if ($(this).hasClass('js-goTo-step1')) {
			goToStep1();
		} else if ($(this).hasClass('js-goTo-step2')) {
			goToStep2();
		}
	});

	function setAnimationForQuestion(questions) {
		let num = 0;
		setInterval(() => {
			questions.each(function (i) {
				if (i === num) $(this).fadeIn();
				else $(this).fadeOut();
				$(this).on('click', () => {
					let popup = $('.booking-steps-faq--popup');
					popup.fadeIn();
				});
			});
			if (num !== questions.length) num++;
			else num = 0;
		}, 1500);
	}
	$('#cleaningChoose input').on('change', function () {
		$('#cleaningLink').attr('href', $(this).val());
	});
	let questions = $('.booking-steps-faq__items--mobile').find('.booking-steps-faq__item');
	setAnimationForQuestion(questions);

	$('.js-hide-faq').on('click', () => {
		$('.booking-steps-faq--mobile').fadeOut();
	});

	$('.js-close-faqpopup').on('click', () => {
		$('.booking-steps-faq--popup').fadeOut();
	});

	function setLevelColor() {
		let levelInput = $(this),
			info = $('.booking-step__level-info'),
			label = levelInput.siblings('label'),
			color = levelInput.val() === '1' ? 'light' : levelInput.val() === '2' ? 'medium' : 'heavy';
		$('.booking-step__level-item').find('label').removeClass('light, medium, heavy');
		label.addClass(color);
		console.log(color);
		info.find('div').each(function () {
			$(this).removeClass('active');
			console.log($(this));
			if ($(this).data('level-info') === color) {
				$(this).addClass('active');
			}
		});
	}

	$('.booking-step__level-item').find('input').on('click', setLevelColor);

	$('.booking-steps-check__remove').on('click', function () {
		$(this).parent().fadeOut();
	});

	$('.booking-steps-check__item--top').on('click', function () {
		if ($(this).parent().hasClass('booking-steps-check--top')) {
			$(this).siblings('.booking-steps-check-drop').slideToggle();
			$(this).toggleClass('booking-steps-check__item--reverse');
			isOpenDrop = !isOpenDrop;
			if (isOpenDrop) {
				$(this).find('.booking-steps-check--date--hidden').css({
					position: 'absolute',
					opacity: '0',
				});
			} else {
				$(this).find('.booking-steps-check--date--hidden').css({
					position: 'relative',
					opacity: '1',
				});
			}
		}
	});

	$('.top-error__close').on('click', function (e) {
		e.preventDefault();
		$('.top-error').removeClass('show');
		$('.overlay').css('display', '');
	});

	$('.js-close-popup-check').on('click', function () {
		$('.booking-steps-check--popup').fadeOut();
	});
	$('.js-subchecks').each(function () {
		let $subitems = $(this).find('.js-subchecks-items');
		let $item = $(this);
		$(this)
			.find('.js-subchecks-check')
			.on('change', function (e) {
				$subitems[0].classList.toggle('active');
				$item[0].classList.toggle('active');
			});
	});
});
