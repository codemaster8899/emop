var currentStep = 1;
window.goToPrestep = () => {
	$('.booking-step--prestep').addClass('booking-step--active');
	$('.booking-step--two').removeClass('booking-step--active');
	$('.fixed-header').removeClass('added');
	$('.booking-step--three').removeClass('booking-step--active');
	$('.booking-step--one').removeClass('booking-step--active');
	$('.booking-steps-header__item--one').removeClass('booking-steps-header__item--active');
	$('.booking-steps-check').removeClass('booking-steps-check--active');
	$('.booking-steps-check--desktop').removeClass('js-booking-steps-check');
	$('.booking-steps-faq__items--what').removeClass('booking-steps-faq__items--show');
	$('.booking-steps-faq__items--personal').removeClass('booking-steps-faq__items--show');
	$('.booking-steps-faq__items--when').removeClass('booking-steps-faq__items--hide');
	$('.booking-steps-header').removeClass('booking-steps-header--mobile');
	$('.booking-steps-header__item--one').removeClass('booking-steps-header__item--done');
	$('.booking-steps-header__item--two').removeClass('booking-steps-header__item--done js-goTo-step2 booking-steps-header__item--active');
	$('.booking-steps-header__item--three').removeClass('booking-steps-header__item--active');
	$('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing');
};
window.goToStep1 = () => {
	currentStep = 1;
	$('.booking-step--two').removeClass('booking-step--active');
	$('.booking-step--prestep').removeClass('booking-step--active');
	$('.fixed-header').removeClass('added');
	$('.booking-step--three').removeClass('booking-step--active');
	$('.booking-step--one').addClass('booking-step--active');
	$('.booking-steps-header__item--one').addClass('booking-steps-header__item--active');
	$('.booking-steps-check').removeClass('booking-steps-check--active');
	$('.booking-steps-check--desktop').removeClass('js-booking-steps-check');
	$('.booking-steps-faq__items--what').removeClass('booking-steps-faq__items--show');
	$('.booking-steps-faq__items--personal').removeClass('booking-steps-faq__items--show');
	$('.booking-steps-faq__items--when').removeClass('booking-steps-faq__items--hide');

	$('.booking-steps-header').removeClass('booking-steps-header--mobile');
	$('.booking-steps-header__item--one').removeClass('booking-steps-header__item--done');
	$('.booking-steps-header__item--two').removeClass('booking-steps-header__item--done js-goTo-step2 booking-steps-header__item--active');
	$('.booking-steps-header__item--three').removeClass('booking-steps-header__item--active');
	window.dispatchEvent(new CustomEvent('scroll'));
	$('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing');
};
let isStep = false;
window.goToStep2 = () => {
	currentStep = 2;
	$('.booking-step--one').removeClass('booking-step--active');
	$('.booking-step--two').addClass('booking-step--active');
	setTimeout(function () {
		$('.fixed-header').addClass('added');
		if (window.matchMedia('(max-width: 576px)').matches) {
			$('.fixed-header').css('display', 'flex');
		}
	}, 400);
	$('.booking-step--three').removeClass('booking-step--active');
	$('.booking-steps-check').addClass('booking-steps-check--active');
	$('.booking-steps-faq__items--when').addClass('booking-steps-faq__items--hide');
	$('.booking-steps-faq__items--what').addClass('booking-steps-faq__items--show');
	$('.booking-steps-faq__items--personal').removeClass('booking-steps-faq__items--show');

	$('.booking-steps-header').addClass('booking-steps-header--mobile');
	$('.booking-steps-header__item--one').addClass('booking-steps-header__item--done js-goTo-step1');
	$('.booking-steps-header__item--two').addClass('booking-steps-header__item--active');
	$('.booking-steps-header__item--two').removeClass('booking-steps-header__item--done');
	$('.booking-steps-header__item--three').removeClass('booking-steps-header__item--active');
	window.dispatchEvent(new CustomEvent('scroll'));
	$('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing');
	setTimeout(() => {
		$('.booking-steps-faq--descktop').addClass('js-come-faq');
		$('.booking-steps-check--desktop').addClass('js-booking-steps-check');
	}, 1200);
	isStep = true;
};
window.goToStep3 = () => {
	currentStep = 3;
	$('.booking-step--two').removeClass('booking-step--active');
	//$('.fixed-header').removeClass('added');
	$('.booking-step--three').addClass('booking-step--active');
	$('.booking-steps-check').addClass('booking-steps-check--active');
	$('.booking-steps-faq__items--when').addClass('booking-steps-faq__items--hide');
	$('.booking-steps-faq__items--what').addClass('booking-steps-faq__items--show');
	$('.booking-steps-header__item--two').addClass('booking-steps-header__item--done js-goTo-step2');
	$('.booking-steps-header__item--three').addClass('booking-steps-header__item--active');

	//$('.top-error').addClass('show');
	//$('.modal-waiting').addClass('show');
	//$('.overlay').fadeIn();
	window.dispatchEvent(new CustomEvent('scroll'));
	$('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing');
};
window.goToFinal = () => {
	$('.booking-step--three').removeClass('booking-step--active');
	$('.booking-steps-final').addClass('booking-steps-final--active');
	$('.booking-steps-header__items').hide();
	$('.fixed-header').removeClass('added');
	$('.booking-steps__info').hide();
	$('.booking-steps-check--mobile').hide();
	$('.booking-steps-header').css({ border: 'none' });
	$('.booking-steps-header').addClass('booking-steps-header--final');
	$('.booking-steps__form').addClass('booking-steps__form--none');
	$('.booking-steps-faq--mobile').hide();
	$('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing');
};

$(document).ready(function () {
	$('.js-time-count').each(function () {
		const counter = $(this);
		const input = $(this).children('.js-time-input');
		const currentValue = $(this).data('current-value') || 0;
		let currentIndex = currentValue ? currentValue : 0;
		const $textHolder = $(this).children('.js-time-text');
		const plus = $(this).children('.js-time-plus');
		const minus = $(this).children('.js-time-minus');
		function setText(index) {
			const x = index * (counter.data('increase') || 30);
			$textHolder.text(getHMText(x));
			if (input.length) {
				input.val(currentIndex);
				input[0].dispatchEvent(new Event('input'));
			}
		}

		plus.on('click', () => {
			currentIndex = counter.data('currentValue') || currentIndex;
			currentIndex++;
			counter.data('currentValue', currentIndex);
			setText(currentIndex);
		});
		minus.on('click', () => {
			if (currentIndex > 0) {
				currentIndex--;
				counter.data('currentValue', currentIndex);
				setText(currentIndex);
			}
		});
	});
});
