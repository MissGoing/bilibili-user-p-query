function isOnHtmlScreen(se) {
    var win = $(window);
    var viewport = {
        top: 0,
        left: 0
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = $(se).offset();
    bounds.right = bounds.left + $(se).outerWidth();
    bounds.bottom = bounds.top + $(se).outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
}