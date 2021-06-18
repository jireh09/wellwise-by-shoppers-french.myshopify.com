/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
(function(window, $) {
  window.matchHeights = function(selector, resizeEnabled) {
    resizeEnabled = resizeEnabled || false;
    
    const $sel = $(selector);
    const resizeHeight = function() {
    	var minHeight = 0;
		var heights = $sel.get().map(function(item) {
			return $(item).height();
		});
  	
  		if(heights.length > 0 ) {
      		minHeight = heights.sort(function(a, b) {
        		return b - a;
      		})[0];
      		$sel.css('min-height', minHeight);
  		}
		//console.log(selector, minHeight, resizeEnabled);
    };
    resizeHeight();
    
    $(window).on('resize', function() {
      if(resizeEnabled) {
    	$sel.attr('style', '');
      	resizeHeight();
      }
    });
  };
  window.deeplinkTo = function(hash, delay) {
    hash = hash || window.location.hash;
    delay = delay || 500;
    
    console.log('dl', hash, delay);
    
    if(hash.indexOf('#deeplink=') > -1) {
      var selector = hash.replace('#deeplink=', '');
      var scrollPosition = $(selector).offset().top - ($('#shopify-section-header').height() + 20);
      
      setTimeout(function() {
          $('html, body').animate({
            scrollTop: scrollPosition
          });
      }, delay);
    }
  };
  
  $(document).ready(function() {
    const resizeSelectors = [
      	'.quick-links-v2 h2',
      	'.footer-shoppers .fg span',
  		'.supp-mobil-sect .flex-mob-group .mob-body h2',
  		'.category-items-spons-group .spons__header h2',
      	'.sec_flex_group .sect__header h3'
    ];
    const slickInit = function() {
        const $slickCarousels = $('.slick-carousel');
      	
      	$slickCarousels.each(function() {
          	const $slickCarousel = $(this);
            const slickOptions = {
              rows: 1,
              slidesToScroll: 1,
              slidesToShow: 1,
              dots: false,
              arrows: false,
              infinite: true,
              customPaging: function(slider, i) {
                return '<span class="dot"></span>';
              },
              speed: 300,
              responsive: [{
                breakpoint: 1024,
                settings: { }
              }]
            };

            if(typeof $slickCarousel.attr('data-slidesToScroll') !== 'undefined') {
              const showSlideNum = parseInt($slickCarousel.attr('data-slidesToScroll') || 1);

              slickOptions.slidesToScroll = showSlideNum;
              slickOptions.slidesToShow = showSlideNum;
            }
          	if(typeof $slickCarousel.attr('data-rows') !== 'undefined') {
              slickOptions.rows = parseInt($slickCarousel.attr('data-rows'));
            }
            if(typeof $slickCarousel.attr('data-arrows') !== 'undefined') {
              slickOptions.arrows = $slickCarousel.attr('data-arrows') == "true";
            }
            if(typeof $slickCarousel.attr('data-speed') !== 'undefined') {
              slickOptions.speed = parseInt($slickCarousel.attr('data-speed'));
            }
            if(typeof $slickCarousel.attr('data-autoplay') !== 'undefined') {
              slickOptions.autoplay = $slickCarousel.attr('data-autoplay') == "true";
            }
          	if(typeof $slickCarousel.attr('data-swipe') !== 'undefined') {
              const canSwipe = $slickCarousel.attr('data-swipe') == "true";
              slickOptions.swipe = canSwipe;
            }
            if(typeof $slickCarousel.attr('data-responsive') !== 'undefined') {
              try {
              	slickOptions.responsive = JSON.parse($slickCarousel.attr('data-responsive'));
              } catch(e) {
                console.error('Err: Incorrect json formatting in data attribute for slick slider data-responsive');
              }
              console.log(
                'responsive',
                slickOptions.responsive,
                $slickCarousel.attr('class')
              );
            }

            $slickCarousel.on('breakpoint init', function(event, slick) {
              
                let html = '<ul class="slick-dots custom-dots" style="display: block;">';
                const dotsLength = Math.ceil(slick.slideCount / slick.options.slidesToShow);
                const $dots = slick.$dots;

                if(dotsLength > 1)
                    html += '<li class="not-slick arrow-prev"><span></span></li>';
                for(var i = 0; i < dotsLength; i++) {
                    html += '<li ' + (i == 0 ? 'class="slick-active"' : '' ) + '><span class="dot"></span></li>';
                }
                if(dotsLength > 1)
                    html += '<li class="not-slick arrow-next"><span></span></li>';

                html += '</ul>';
              	
                if(dotsLength > 1)
                    $(slick.$list).append(html);
            });

            $slickCarousel.on('swipe', function(event, slick, direction) {
                const currentSlide = slick.currentSlide;
                const $slickList = slick.$list.parents('.slick-slider');
              	//console.log('SWIPE: ', currentSlide);

                $slickList.find('.slick-active').removeClass('slick-active');
                $slickList.find('.slick-dots > li:not(.not-slick)').eq(currentSlide).addClass('slick-active');
            });

            $slickCarousel.slick(slickOptions);
          	
          	if($slickCarousel.hasClass('slick-collection-list')) {
          		window.matchHeights('#shopify-section-collection-list .collection-item__title');
          	}
      	});
    };
    
    deeplinkTo();
    slickInit();
    
    $(document).on('click', '.service-deeplink', function(e) {
      e.preventDefault();
      
      const target = $(this).attr('data-target');
      const section = $(this).attr('data-section');
      const $servicePageAttr = $(this).parents('.quick-links-v2').attr('data-service-page');
      const isServicePage = $servicePageAttr.length > 0 && $servicePageAttr == 'true';
      
      if(!isServicePage) {
          return window.location = "/pages/services?dl=" + section;
      }

      $('html, body').animate({ scrollTop: $(target).offset().top - 180}, 1000);
    });
    
    $(document).on('click', '.more-view-all', function(e) {
      e.preventDefault();
      const $this = $(this);
      const $moreGrid = $this.parent().find('.more-grid');
      const labelOptions = ["View All", "View Less"];
      const moreGridLength = $moreGrid.find('.more-grid-item:visible').length;
      
      if(moreGridLength > 6) {
          $moreGrid.find('.more-grid-item:gt(5)').slideUp(function() {
              $this.text(labelOptions[0]);
          }).addClass('.not-visible')
          return false;
      }

      $moreGrid.find('.not-visible').slideDown(function() {
          $this.text(labelOptions[1]);
      });
    });
    
    $(document).on('click', '.not-slick.arrow-next, .not-slick.arrow-prev', function() {
    	const $parentEl = $(this).parents('.custom-dots');
      	const numOfSlides = $parentEl.find('li:not(.not-slick)').length;
      	const $carousel = $(this).parents('.slick-slider');
      	var $goTo = []
     	
        if($(this).hasClass('arrow-next')) {
          	$goTo = $carousel.find('.slick-active').next('li:not(.not-slick)');
          
          	if($goTo.length == 0)
              $goTo = $carousel.find('li:not(.not-slick)').eq(0);
        } else {
          	$goTo = $carousel.find('.slick-active').prev('li:not(.not-slick)');
          
          	if($goTo.length == 0)
              $goTo = $carousel.find('li:not(.not-slick)').eq($carousel.find('li:not(.not-slick)').length - 1);
        }
        $parentEl.find('li').removeClass('slick-active');
      
      	if($goTo.length > 0)
        	$goTo.addClass('slick-active').trigger('click');
  	});
  
  	$(document).on('click', '.slick-dots.custom-dots > li', function() {
      if($(this).hasClass('not-slick')) return false;
      const $carousel = $(this).parents('.slick-slider');
      const numberOfColumns = $carousel.find('.slick-dots li:not(.not-slick)').length;
      const numberOfSlides = $carousel.slick('getSlick').$list.find('.slick-active').length;
      
      $carousel.find('.slick-dots.custom-dots > li').removeClass('slick-active');
      $(this).addClass('slick-active');
      
      const slideIndex = $(this).parents('.custom-dots').find('.slick-active').index() - 1;
      
      $carousel.slick('slickGoTo', slideIndex * numberOfSlides);
  	});
    
    $(document).on('click', '.category-banner .button', function() {
      var hash = $(this).attr('href');
      
      if(hash.indexOf('#deeplink=') > -1) {
      	deeplinkTo(hash, 1);
        return false;
      }
    });
   
    $(document).on('click', '.header__action-item--stay-touch, .popup-contact-us__close', function() {
      const $modalContactUsEl = $('#modal-contact-us');
      $modalContactUsEl.attr('aria-hidden', $modalContactUsEl.attr('aria-hidden') == 'false');
    });
    
    $(document).on('click', '.mega-menu__main_ul .mega-menu__title', function(e) {
      e.preventDefault();
      const $megaMenu = $('.mega-menu__inner');
      const href = $(this).attr('href');
      const cdnUrl = 'https://wellwise.s3.amazonaws.com';
      
      $megaMenu.find('.mega-menu__main_ul .active-menu').removeClass('active-menu');
      $(this).parents('li').addClass('active-menu');
      $megaMenu.find('.mm-col-sub .inner').css('visibility', 'visible');
      $megaMenu.find('.mega-menu__linklist').hide();
      $megaMenu.find('[data-parent-url="' + href + '"]').css('display', 'flex');
      
      //TODO - Replace and add a section in the admin panel for user to input these
      const navLearnMore = [
        {
            id: "/collections/incontinence",
            image_name: "incontience.jpg",
            copy: "Explore resources designed to help you find the best incontinence solutions for your unique needs.",
            cta_label: "Incontinence",
            cta_link: "/pages/incontinence-1"
        },
        {
            id: "/collections/ostomy",
            image_name: "ostomy.jpg",
            copy: "Browse a variety of resources that can help you manage your unique ostomy needs.",
            cta_label: "Ostomy",
            cta_link: "/pages/ostomy"
        },
        {
            id: "/collections/cpap",
            image_name: "cpap.jpg",
            copy: "Discover our wide range of sleep apnea resources and learn what you can do to get a better night's sleep.",
            cta_label: "CPAP",
            cta_link: "/pages/cpap"
        },
        {
            id: "/collections/electronics-1",
            image_name: "electronics.jpg",
            copy: "Gain a better understanding of our latest electronics products and solutions with these helpful resources.",
            cta_label: "Electronics",
            cta_link: "/pages/electronics"
        },
        {
            id: "/collections/sleep-aids",
            image_name: "sleepaids.jpg",
            copy: "Explore resources designed to help you find the best sleep solutions for your unique needs.",
            cta_label: "Sleep Aids",
            cta_link: "/pages/sleep-aids"
        },
        {
            id: "/collections/light-therapy",
            image_name: "lighttherapy.jpg",
            copy: "Gain a better understanding of our latest light therapy products and solutions with these helpful resources.",
            cta_label: "Light Therapy",
            cta_link: "/pages/light-therapy"
        },
        {
            id: "/collections/rollators-walkers",
            image_name: "rollatorwalkers.jpg",
            copy: "Discover our wide range of mobility resources and learn what you can do to help maintain your independence.",
            cta_label: "Rollators & Walkers",
            cta_link: "/pages/rollators-walkers"
        },
        {
            id: "/collections/scooters-power-chairs-1",
            image_name: "scooterspowerchairs.jpg",
            copy: "Gain a better understanding of our scooters and power chairs with these helpful resources.",
            cta_label: "Scooters & Power Chairs",
            cta_link: "/pages/scooters-power-chairs"
        },
        {
            id: "/collections/wheelchairs-transport-chairs",
            image_name: "wheelchairs.jpg",
            copy: "Browse a variety of resources that can help you manage your unique mobility needs.",
            cta_label: "Wheelchairs & Transport Chairs",
            cta_link: "/pages/wheelchairs-transport-chairs"
        },
        {
            id: "/collections/canes-1",
            image_name: "canes.jpg",
            copy: "Explore resources designed to help you find the best cane(s) for your unique needs.",
            cta_label: "Canes",
            cta_link: "/pages/canes"
        },
        {
            id: "/collections/braces-supports",
            image_name: "bracessupport.jpg",
            copy: "Gain a better understanding of our latest braces and supports offerings with these helpful resources.",
            cta_label: "Braces & Supports",
            cta_link: "/pages/braces-supports"
        },
        {
            id: "/collections/compression",
            image_name: "compression.jpg",
            copy: "Discover our wide range of compression therapy resources and how compression products could help you.",
            cta_label: "Compression",
            cta_link: "/pages/compression"
        },
        {
            id: "/collections/pain-management",
            image_name: "painmanagement.jpg",
            copy: "Explore resources designed to help you learn more about available pain management products and solutions.",
            cta_label: "Pain Management",
            cta_link: "/pages/pain-management"
        },
        {
            id: "/collections/health-monitoring",
            image_name: "healthmonitoring.jpg",
            copy: "Browse a variety of resources that can help you better understand your health monitoring needs.",
            cta_label: "Health Monitoring",
            cta_link: "/pages/health-monitoring"
        },
        {
            id: "/collections/home-1",
            image_name: "home.jpg",
            copy: "Discover our wide range of home comfort and safety resources and learn what you can do to stay longer in the home you love.",
            cta_label: "Home",
            cta_link: "/pages/home"
        },
        {
            id: "/collections/daily-living",
            image_name: "dailyliving.jpg",
            copy: "Gain a better understanding of our latest daily living products and solutions with these helpful resources.",
            cta_label: "Daily Living",
            cta_link: "/pages/daily-living"
        },
        {
            id: "/collections/fitness-nutrition",
            image_name: "fitness.jpg",
            copy: "Explore resources designed to help you create and reach your fitness and nutrition goals.",
            cta_label: "Fitness & Nutrition",
            cta_link: "/pages/fitness-nutrition"
        },
        {
            id: "/collections/wellness",
            image_name: "wellness.jpg",
            copy: "Browse a variety of wellness resources that can help educate you on your everyday needs.",
            cta_label: "Wellness",
            cta_link: "/pages/wellness"
        }
      ];
      
	  var learnMoreData = navLearnMore.filter(function(a) { if(a.id.toLowerCase().indexOf(href.toLowerCase()) > -1) return a; });
      if(learnMoreData != null && learnMoreData.length > 0) {
        learnMoreData = learnMoreData[0];
        
        $megaMenu.find('.mm-col-3 img').attr('src', cdnUrl + '/nav/learn/' + learnMoreData.image_name);
        $megaMenu.find('.mm-col-3 p').text(learnMoreData.copy);
        $megaMenu.find('.mm-col-3 a').text(learnMoreData.cta_label + " Resources").attr('href', learnMoreData.cta_link);
      }
    });
    
    //STAY IN THE KNOW FORM
    $(document).on('click', '.subscribe-submit-btn', function() {
      const $this = $(this);

      if($this.hasClass('disable-btn')) return false;
      $this.addClass('disable-btn');

      const $stayInTouchForm = $(this).parents('.stay-in-touch-form');
      const $email = $stayInTouchForm.find('.subscribe-email-input');
      const emailPattern = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
      const formData = {};
      const isEmailValid = emailPattern.test($email.val());

      if(isEmailValid) {
       formData.email = $email.val().trim();

        $stayInTouchForm.removeClass('has-failed');
        console.log('form submission', formData);

        $.ajax({
          url: "https://social.richmondday.com/contact.php",
          type: "POST",
          dataType: "json",
          data: formData,
          complete: function(data, status) {
            console.log('data - ', data, status);

            $this.removeClass('disable-btn');

            if(data.statusText == "error") 
              return console.error('Salesfource - Not Authorized - https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm');

            $stayInTouchForm.removeClass('has-failed');
            $stayInTouchForm.find('.hide-if-success').slideUp();
            $stayInTouchForm.find('.show-if-success').slideDown();
          }
        });
      } else {
        $this.removeClass('disable-btn');
        $stayInTouchForm.addClass('has-failed');
      }
    });
    
    $(document).on('click', '.nav-bar__linklist > .nav-bar__item:first-child > a', function(e) {
      const isValid = $(this).parents('.nav-bar__linklist').hasClass('nav-dropdown--glued');
      const pathName = window.location.pathname;
      const selector = '.mega-menu__main_ul .mega-menu__column > a[href="' + pathName + '"]';
      
      if(isValid) {
        const $menuItem = $(selector);
        
        if($menuItem.length > 0) {
        	$menuItem.trigger('click');
        } else {
      		$('.mega-menu__main_ul .mega-menu__column:first-child > a').trigger('click');
        }
      }
    });
    
    resizeSelectors.map(function(sel) {
      window.matchHeights(sel, true);
    });
    
    
    $('.no-blank').attr('target','_self');
  });
}(window, jQuery));

var pco = null;

const getPcoInfo = () => {
  if(!pco) {
    var productJsonElement = document.querySelector('[data-product-json]');
    if (productJsonElement) {
      const jsonData = JSON.parse(productJsonElement.innerHTML);
      pco = jsonData['pco'];
    }
  }

  return pco;
};

const calculateBasePco = (price) => {
  var priceStr = (price + '');
  var size = priceStr.length;
  var nonDecimalPrice = priceStr.substr(0, size-2);
  
  return nonDecimalPrice * 15;
  
};

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
   
document.addEventListener('variant:changed', function(event) {
  var variant = event.detail.variant; // Gives you access to the whole variant details

  var productPco = document.querySelector('.product-meta__pco');

  if (!productPco) {
    return;
  }

  var pco = getPcoInfo();
  var pcoVariant = pco.find(x => x.sku === variant.sku);

  if(pcoVariant) {
    var productBasePco = productPco.querySelector('.product-meta__pco-base');

    productBasePco.innerHTML = formatNumber(calculateBasePco(variant.price));
    
    var productBonusPco = productPco.querySelector('.product-meta__pco-bonus');
    
    if(pcoVariant && pcoVariant.pco && pcoVariant.pco.PCOBonus === 'yes' && productBonusPco  ) {
      if(pcoVariant.pco.PCOPromoType === 'fixed') {
      	productBonusPco.innerHTML = '<span class="product-meta__pco-bonusAmount">' + formatNumber(pcoVariant.pco.PCOAmount) + '</span> bonus points* and '
      } else { 
      	productBonusPco.innerHTML = '<span class="product-meta__pco-bonusAmount">' + (pcoVariant.pco.PCOAmount) + '</span>x the points* and'
      }
    } else {
      productBonusPco.innerHTML = '';
    }
    
  } 
});

