/*
 * Custom v1.0
 * www.designorbital.com
 *
 * Copyright (c) 2013 DesignOrbital.com
 *
 * License: GNU General Public License, GPLv3
 * http://www.gnu.org/licenses/gpl-3.0.html
 *
 */

(function($){
	
	var kamn = {
		
		readyInit: function() {
			
			/** Hash Scroll */
			/** Portfolio Filter */
			$( '#navbar-spy' ).off( 'click' ).on( 'click', 'a', function( e ) {			
			  
				e.preventDefault();
								
				var elmHash = $( this ).attr( 'href' );

				if(elmHash.indexOf("#") !== 0)
				{
					location.href = elmHash;
					return;
				}

				var elmOffsetTop = Math.ceil( $( this.hash ).offset().top );
				var windowOffsetTop = Math.ceil( $(window).scrollTop() );
				
				if( elmOffsetTop != 0 ) {
					elmOffsetTop = elmOffsetTop - 70;
					if( windowOffsetTop == 0 ) {
						elmOffsetTop = elmOffsetTop - 70;
					}
				}
				
				//console.log( $( this ).attr( 'href' ) );				
				$( 'html:not(:animated), body:not(:animated)' ).animate({ scrollTop: elmOffsetTop }, 500 );											  
			
			});
			
			/** Initialise Stellar */
			$.stellar({
				horizontalScrolling: false
			});
			
			/** Nice Scroll */
			$( 'html' ).niceScroll({
				cursorcolor: '#2d3032',
				cursorwidth: '10px',
				cursoropacitymax: 0.5,								
				scrollspeed: 300,
				zindex: 1060
			});
			
			/** prettyPhoto */
			$( "a[data-rel^='prettyPhoto']" ).prettyPhoto({ 
				deeplinking: false,
				show_title: false,
				social_tools: ''
			});	
			
			/** ToolTip */	
			$( 'a[data-toggle="tooltip"]' ).tooltip();
			
			/** Navbar Animation */
			kamn.navbarAnimationInit();
			
			/** Contact Form */
			kamn.contactFormInit();
						
		},
		
		loadInit: function() {
			
			/** #carousel-hero */
			$( '#carousel-1' ).carousel({
				interval: false
			})
			
			/** Portfolio */
			kamn.portfolioInit();
			
			/** GMap */
			kamn.gmapInit();
			
		},
		
		scrollInit: function() {
		},
		
		smartresizeInit: function() {
			
			/** Portfolio */
			kamn.portfolioInit();
			
		},
		
		spyRefreshInit: function() {
		
			$('[data-spy="scroll"]').each(function () {
			  var $spy = $(this).scrollspy('refresh')
			});
		
		},
		
		navbarAnimationInit: function() {
			
			/** Navbar Animation */
			$( '#navbar-section' ).waypoint( function( direction ) {
				
				if( direction == 'down' ) {						
					$( '#navbar-section' ).removeClass( 'navbar-static-top animated fadeInUp' );
					$( '#navbar-section' ).addClass( 'navbar-fixed-top animated fadeInDown' );
				} else {			
					  $( '#navbar-section' ).removeClass( 'navbar-fixed-top animated fadeInDown' );	
					  $( '#navbar-section' ).addClass( 'navbar-static-top animated fadeInUp' );			
				}
			
			}, {			   
			   offset: -80			
			});
		
		},
		
		portfolioInit: function() {
			
			/** Portfolio */
			var $container = $( '#projects' );
			var container_width = $container.width();
			
			/** Masonry Columns */			
			var masonryColumns = 4;
			if( Modernizr.mq( 'only screen and (max-width: 959px)' ) ) {
				/** Smaller than standard 960 (devices and browsers) */
				masonryColumns = 3;
			}
			if( Modernizr.mq( 'only screen and (max-width: 767px)' ) ) {
				/** All Mobile Sizes (devices and browser) */
				masonryColumns = 1;
			}
			
			/** Masonry Column Width */			
			var columnWidth = Math.floor( container_width / masonryColumns );			
			$( '#projects > .element' ).width( columnWidth );			
			
			$container.isotope({
				
				masonry: { 
					columnWidth: columnWidth,
					gutterWidth: 0
				},
				
				resizable: false,
				animationEngine: 'best-available',
				animationOptions: {
					duration: 300,
					easing: 'easeInOutQuad',
					queue: false
				}							
			
			}, kamn.portfolioCallbackInit( 300 ));
			
			/** Portfolio Filter */
			$( '#filters' ).off( 'click' ).on( 'click', 'a', function( e ) {			
			  
				e.preventDefault();
				
				var filter = $(this).attr( 'data-option-value' );
				$container.isotope({ filter: filter }, kamn.portfolioCallbackInit( 1200 ));
				$( '#filters a' ).removeClass( 'active' );			  
				$(this).addClass( 'active' );
				
			});
			
		},
		
		portfolioCallbackInit: function( delay ) {		
			setTimeout( function() { kamn.spyRefreshInit() }, delay );		
		},		
		
		gmapInit: function() {
		
			
			$( '#location-gmap' ).width( '100%' ).height( '350px' ).gmap3({				
				  
				marker: {
					address: 'Boulder, CO'
				},
				
				map: {				
					options: {				  
						zoom: 7,
						mapTypeControlOptions: {
							mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'KAMN-location-gmap']
						},
						mapTypeId: 'KAMN-location-gmap',
						mapTypeControl: true,
						navigationControl: true,
						streetViewControl: true,
						scrollwheel: 0			  
					}			  
				},
				
				styledmaptype: {
				
					id: 'KAMN-location-gmap',
					options: {
						name: 'Simplified'
					},
					styles: [
					{
					stylers: [
						{ saturation: -90 }						
					]
					},{
						featureType: 'road',
						elementType: 'geometry',
						stylers: [
						{ hue: '#0c98f7' },
						{ visibility: 'simplified' }
						]
					},{
						featureType: 'road',
						elementType: 'labels',
						stylers: [
						{ visibility: 'off' }
						]
					}
					]				
				}			  
				
			});	  
		
		},
		
		emailFilterInit: function( email ) {
		  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		  return pattern.test( email );
		},
		
		contactFormInit: function() {
			
			var options = { 
				target:        '#contact-response',
				beforeSubmit:  kamn.contactFormRequestInit,
				success:       kamn.contactFormResponseInit,
				dataType:  'json',
				clearForm: true,
				resetForm: true,
				timeout:   3000 
			}; 		 
			$( '#contact-form' ).ajaxForm(options);
			
		},
		
		contactFormRequestInit: function(formData, jqForm, options) {
			
			var form = jqForm[0];
			var formValidation = true;
			var formAlertDanger = '<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Oh snap!</strong> Fix the following erros and try submitting again.</div>';
			var formAlertInfo = '<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Working!</strong> We are processing your request.</div>';
			
			/** Form Validation */
			if ( form.fullname.value == "" ) {
				$( '.form-group-fullname' ).addClass( 'has-error' );
				formValidation = false;
			} else {
				$( '.form-group-fullname' ).removeClass( 'has-error' );
			}
			
			if ( !kamn.emailFilterInit( form.email.value ) ) {			
				$( '.form-group-email' ).addClass( 'has-error' );
				formValidation = false;
			} else {
				$( '.form-group-email' ).removeClass( 'has-error' );
			}
			
			if ( form.message.value == "" ) {
				$( '.form-group-message' ).addClass( 'has-error' );
				formValidation = false;
			} else {
				$( '.form-group-message' ).removeClass( 'has-error' );
			}
			
			/** Form Processing */
			if( formValidation == false ) {
				$( '#contact-response' ).empty().html( formAlertDanger );
				return false;
			}
			
			/** Submit Form */
			$( '#contact-response' ).empty().html( formAlertInfo );		
			return true;
			
		},
		
		contactFormResponseInit: function(responseText, statusText, xhr, $form) {
			$( '#contact-response' ).empty().html( responseText.message );
		}
	
	}
	
	/** Document Ready */
	$(document).ready(function(){
		kamn.readyInit();
	});
	
	/** Windows Load */
	$(window).load(function(){
		kamn.loadInit();
	});
	
	/** Windows Scroll */
	$(window).scroll(function(){
		kamn.scrollInit();
	});
	
	/** Windows Smartresize */
	$(window).smartresize(function(){			  
		kamn.smartresizeInit();
	});

})(jQuery);
