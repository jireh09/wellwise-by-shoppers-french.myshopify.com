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
                var html = '<ul class="slick-dots custom-dots" style="display: block;">';
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
                    $(slick.$list.context).append(html);
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
      const labelOptions = ["Voir tout", "Voir moins"];
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
      const hash = $(this).attr('href');
      
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
      const title = $(this).text().trim().toLowerCase();
      
      $megaMenu.find('.mega-menu__main_ul .active-menu').removeClass('active-menu');
      $(this).parents('li').addClass('active-menu');
      $megaMenu.find('.mm-col-sub .inner').css('visibility', 'visible');
      $megaMenu.find('.mega-menu__linklist').hide();
      $megaMenu.find('[data-parent-url="' + href + '"]').css('display', 'flex');
      
      $('.endx[data-title').hide();
      $('.endx[data-title="' + title + '"]').show();
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
