function stickyHeader() {
  $(window).bind('scroll', function() {
    var mainContent = $('#mainContent'),
        header = $('header');
        headerH = header.height();
    if ( $(window).scrollTop() > 0 ) {
      header.addClass('stick');
      mainContent.css('paddingTop', headerH);
    } else {
      header.removeClass('stick');
      mainContent.attr('style', "");
    }
  });
}

function checkViewWidth() {
  var mainWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);//Compares width among 3 arguments and determines mobile or desktop
  if (mainWidth >= 900 ) {
    //Tablet & Desktop
    stickyHeader();
  } else {
    return
  }
}

checkViewWidth();

function focusInput() {
  var searchBtn = $('#searchTrigger'), searchInput = $('#search');
  $(searchBtn).on('touchstart', function(event) {
    searchInput.focus();
  })
}

focusInput();

var mobBtn = $('#mobBtn'), menu = $('#mainNav');

function mobileMenuFunx() {
  mobBtn.on('click', function(event) {
    if ( menu.hasClass('expand') ) {
      $(this).removeClass('spin');
      menu.removeClass('expand').slideUp('fast');
    } else {
      $(this).addClass('spin');
      menu.addClass('expand').slideDown('fast');
    }
  });
}

mobileMenuFunx();

$('.option-box').each(function() {
  $(this).on('click', function(event) {
    if ( $(this).hasClass('selected') ) {
      return
    } else {
      $('button').removeClass('selected');
      $(this).addClass('selected');
    }
  })
})

  

/*
  Update navigation to add the aria-current="page" attribute and value to the current page element.
  By doing so we denote the current page for both visual and aural users.
  https://tink.uk/using-the-aria-current-attribute/

  Usage:
    <body id="%myPage%"> %myPage% could be home, faqs, etc
    #navigation
    <ul>
      <li>
        <a href="/" id="%myPage%PageLink">Page name</a>

  Result:
    <a href="/" id="%myPage%PageLink" aria-current="page">Page name</a>

  CSS: 
    a[aria-current=page] {
      color: red;
    }
*/
updateNavigationAria = function() {
  // Get the body element's id. If this does not exist, exit the method.
  var currentPageId = document.getElementsByTagName('body')[0].id;
  if(!currentPageId) return false;

  // Get the element with the current page's id + PageLink (see above usage), exit the method if it doesn't exist;
  var currentPageLink = document.querySelector('#' + currentPageId + 'PageLink');
  if(currentPageLink == null) return false;

  // Create/Set the aria-current attribute to page for the appropriate navigation link.
  currentPageLink.setAttribute('aria-current','page');
  return true;
}
updateNavigationAria();