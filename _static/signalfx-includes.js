window.onload = function(){
  var anchors = document.getElementsByClassName('new-page');
  for (var i=0; i<anchors.length; i++){
    anchors[i].setAttribute('target', '_blank');
  }
  //document.getElementsByName("q")[0].setAttribute("placeholder", "Search");

// Document scrolling via http://stackoverflow.com/a/13067009

(function(document, history, location) {
  var HISTORY_SUPPORT = !!(history && history.pushState);

  var anchorScrolls = {
    ANCHOR_REGEX: /^#[^ ]+$/,
    OFFSET_HEIGHT_PX: 100,

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function() {
      this.scrollToCurrent();
      $(window).on('hashchange', $.proxy(this, 'scrollToCurrent'));
      $('body').on('click', 'a', $.proxy(this, 'delegateAnchors'));
    },

    /**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
    getFixedOffset: function() {
      return this.OFFSET_HEIGHT_PX;
    },

    /**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
    scrollIfAnchor: function(href, pushToHistory) {
      var match, anchorOffset;

      if(!this.ANCHOR_REGEX.test(href)) {
        return false;
      }
      
      match = document.getElementById(href.slice(1));
      console.log("MATCH: " + match);
      if(match) {
        if((match == "[object HTMLElement]") || (match == "[object HTMLSpanElement]") || (match == "[object HTMLDivElement]") || (match == "[object HTMLHeadingElement]") || (match == "[object HTMLTableCellElement]")) {
          anchorOffset = $(match).offset().top - this.getFixedOffset();
          $('html, body').animate({ scrollTop: anchorOffset}, 0.1);
        }
        else
        {
          console.log("MATCH2: ");
          anchorOffset = 0;
          $('html, body').animate({ scrollTop: anchorOffset}, 0.1);
          
        }
        
        // $('html, body').scrollTop(anchorOffset);

        // Add the state to history as-per normal anchor links
        if(HISTORY_SUPPORT && pushToHistory) {
          history.pushState({}, document.title, location.pathname + href);
        }
      }
      
      return !!match;
    },
    
    /**
     * Attempt to scroll to the current location's hash.
     */
    scrollToCurrent: function(e) { 
      if(this.scrollIfAnchor(window.location.hash) && e) {
        e.preventDefault();
      }
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     */
    delegateAnchors: function(e) {
      var elem = e.target;

      if(this.scrollIfAnchor(elem.getAttribute('href'), true)) {
        e.preventDefault();
      }
    }
  };

    $(document).ready($.proxy(anchorScrolls, 'init'));
})(window.document, window.history, window.location);


}
