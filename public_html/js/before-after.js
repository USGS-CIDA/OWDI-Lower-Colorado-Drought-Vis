/* global owdiDrought */
/* global $ */

// Pulled from http://codyhouse.co/gem/css-jquery-image-comparison-slider/
(function() {
    "use strict";
    owdiDrought.slider = {};
    owdiDrought.slider.sliderInit = function() {
        var $cdImageContainer = $(".cd-image-container"),
            cdImageLabelClassname = ".cd-image-label",
            cdResizeImgClassName = ".cd-resize-img";

        //check if the .cd-image-container is in the viewport 
        //if yes, animate it
        owdiDrought.slider.checkPosition($cdImageContainer);
        $(window).on("scroll", function() {
            owdiDrought.slider.checkPosition($cdImageContainer);
        });

        //make the .cd-handle element draggable and modify .cd-resize-img width according to its position
        $cdImageContainer.each(function() {
            var actual = $(this);
                
            owdiDrought.slider.drags(
                actual.find(".cd-handle"),
                actual.find(cdResizeImgClassName),
                actual,
                actual.find(cdImageLabelClassname + "[data-type='original']"),
                actual.find(cdImageLabelClassname + "[data-type='modified']"));

        });

        //upadate images label visibility
        $(window).on("resize", function() {
            $cdImageContainer.each(function() {
                var actual = $(this);
                owdiDrought.slider.updateLabel(actual.find(cdImageLabelClassname + "[data-type='modified']"), actual.find(cdResizeImgClassName), "left");
                owdiDrought.slider.updateLabel(actual.find(cdImageLabelClassname + "[data-type='original']"), actual.find(cdResizeImgClassName), "right");
            });
        });
    };

    owdiDrought.slider.checkPosition = function(container) {
        container.each(function() {
            var actualContainer = $(this);
            if ($(window).scrollTop() + $(window).height() * 0.5 > actualContainer.offset().top) {
                actualContainer.addClass("is-visible");
            }
        });
    };

    //draggable functionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
    owdiDrought.slider.drags = function(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
        var vmouseAndMouseUp = "mouseup vmouseup",
                draggable = "draggable",
                resizable = "resizable";
                
        dragElement.on("mousedown vmousedown", function(e) {
            dragElement.addClass(draggable);
            resizeElement.addClass(resizable);

            var dragWidth = dragElement.outerWidth(),
                xPosition = dragElement.offset().left + dragWidth - e.pageX,
                containerOffset = container.offset().left,
                containerWidth = container.outerWidth(),
                minLeft = containerOffset + 10,
                maxLeft = containerOffset + containerWidth - dragWidth - 10;

            dragElement.parents().on("mousemove vmousemove", function(e) {
                var leftValue = e.pageX + xPosition - dragWidth;

                //constrain the draggable element to move inside his container
                if (leftValue < minLeft) {
                    leftValue = minLeft;
                } else if (leftValue > maxLeft) {
                    leftValue = maxLeft;
                }

                var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";

                $("." + draggable).css("left", widthValue).on(vmouseAndMouseUp, function() {
                    $(this).removeClass(draggable);
                    resizeElement.removeClass(resizable);
                });

                $("." + resizable).css("width", widthValue);

                owdiDrought.slider.updateLabel(labelResizeElement, resizeElement, "left");
                owdiDrought.slider.updateLabel(labelContainer, resizeElement, "right");

            }).on(vmouseAndMouseUp, function() {
                dragElement.removeClass(draggable);
                resizeElement.removeClass(resizable);
            });
            e.preventDefault();
        }).on(vmouseAndMouseUp, function() {
            dragElement.removeClass(draggable);
            resizeElement.removeClass(resizable);
        });
    };

    owdiDrought.slider.updateLabel = function(label, resizeElement, position) {
        var isHiddenLabel = "is-hidden";
        if (position == "left") {
            if (label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth()) {
                label.removeClass(isHiddenLabel);
            } else {
                label.addClass(isHiddenLabel);
            }
        } else {
            if (label.offset().left > resizeElement.offset().left + resizeElement.outerWidth()) {
                label.removeClass(isHiddenLabel);
            } else {
                label.addClass(isHiddenLabel);
            }
        }
    };
})();