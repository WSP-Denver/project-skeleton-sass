<!-- Google Tracking Script. Also tracks downloads. -->
<script type="text/javascript">
  var SITE_URL = 'YourSite.com';
  var PAGE_TITLE_PREFIX = 'YOUR SITE TITLE';
  var GA_TRACKING_ID = 'CHANGE ME';
  if (document.location.hostname.toLowerCase().search(SITE_URL) !== -1) {
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'CHANGE ME TOO WITH THE SAME CODE', 'auto');
    ga('send', 'pageview');
  }

  function TrackFileDownload(item) {
    if (document.location.hostname.toLowerCase().search(SITE_URL) !== -1) {
      var el = item.target;
      var customLink = (typeof (el.getAttribute('href')) != 'undefined') ? el.getAttribute('href').toLowerCase() : "";
      var pageTitle = document.title.replace(PAGE_TITLE_PREFIX, '');
      ga('send', {
        hitType: 'event',
        eventCategory: 'File Download - ' + pageTitle + ' - ' + el.html(),
        eventAction: 'File Download',
        eventLabel: customLink
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Track file download link clicks for Google Analytics
    var trackingTargets = document.querySelectorAll("a[href$='.pdf'], a[href$='.xls'], a[href$='.ppt'], a[href$='.doc']");
    for(i=0; i< trackingTargets.length; i++) {
        trackingTargets[i].addEventListener('click', TrackFileDownload);
    };
  });
</script>
