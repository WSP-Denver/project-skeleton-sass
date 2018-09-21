/*
    Handle Dropdown navigation utilizing roles and aria attributes
  */
buildDropdownNavigation = function () {
  function showSubmenu(dropdown) {
    clearMenus();
    // Find element within the dropdown with aria-hidden attribute
    var subMenu = dropdown.target.parentNode.querySelectorAll('[aria-hidden]');
    // If it exists, change the attribute to false to show the menu
    if (subMenu.length) subMenu[0].setAttribute('aria-hidden', 'false');
  };

  function hideSubmenu(dropdown) {
    // To handle events from child and parents, we're verifying dropdown has the aria-haspopup attribute. If it doesn't, select the parent
    var menu = !dropdown.target.hasAttribute('aria-haspopup') ? dropdown.target : dropdown.target.parentNode;

    // Find element within the dropdown with aria-hidden attribute
    // returns NodeList
    var subMenu = menu.querySelectorAll('[aria-hidden]');
    // If it exists, change the attribute to true to hide the menu
    if (subMenu.length) subMenu[0].setAttribute('aria-hidden', 'true');
  };

  // Close all other dropdowns when a new top level link is active
  function clearMenus(item) {
    var dropdowns = document.querySelectorAll('[role=navigation] [aria-hidden]');
    for (i = 0; i < dropdowns.length; i++) {
      dropdowns[i].setAttribute('aria-hidden', 'true');
    }
  };

  var navDropdown = document.querySelectorAll('[role=navigation] [aria-haspopup]');
  for (i = 0; i < navDropdown.length; i++) {
    navDropdown[i].addEventListener('mouseover', showSubmenu);
    navDropdown[i].addEventListener('focus', showSubmenu);
    navDropdown[i].parentNode.addEventListener('mouseleave', hideSubmenu);
  };

  var navItems = document.querySelectorAll('[role=navigation] > ul > li > a:not([aria-haspopup])');
  for (i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('mouseover', clearMenus);
    navItems[i].addEventListener('focus', clearMenus);
  }

  // Close menus on click
  this.addEventListener('click', clearMenus);
}
buildDropdownNavigation();

/*
  Listens to clicks of the navigationToggle button and toggles the aria-expanded attribute

  Usage:
    <button id="navigationToggle" aria-controls="%navId%" /> %navId% could be mainNav, subNav, etc

    <div id="%navId%">...
  
  Result:
    <button id="navigationToggle" aria-controls="%navId%" class="spin" />
    <div id="%navId%" aria-expanded="true">...

  CSS: 
    div[aria-expanded] {
      display: block;
    }
*/
navigationToggle = function () {
  function toggle(e) {
    var toggle = e.currentTarget,
      targetId = toggle.getAttribute('aria-controls'),
      targetElem = document.querySelector('#' + targetId);

    if (!targetElem) return false;

    if (targetElem.getAttribute('aria-expanded')) {
      toggle.classList.remove('spin');
      targetElem.removeAttribute('aria-expanded');
    } else {
      toggle.classList.add('spin');
      targetElem.setAttribute('aria-expanded', 'true');
    }
    return true;
  };

  var navigationToggle = document.querySelector('#navigationToggle');
  navigationToggle.addEventListener('click', toggle);
}
navigationToggle();