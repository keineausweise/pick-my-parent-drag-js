(function () {
    "use strict";
    /*
    Declare the "initDraggable" function that takes an element as a parameter - the subject.
    This function will make the element draggable.
    Whenever it is dragged an element it is dragged over is determined and if released the
    subject is moved to be a child of that element.
     */

    const ELEMENT_HOOVER_CLASS = "pmpd-hover";

    function getElementSelector(element) {
        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += "#" + element.id;
        }
        if (element.className) {
            selector += "." + element.className.split(" ").join(".");
        }

        if (document.querySelectorAll(selector).length > 1) {
            selector += ":nth-child(" + (Array.prototype.indexOf.call(element.parentNode.children, element) + 1) + ")";
        }

        return selector;
    }

    function initDraggable(subject) {
        if (!subject) {
            throw new Error("Subject is not defined");
        }
        let hoverOverElement = null;
        const gctx = {
            shiftX: 0,
            shiftY: 0
        };

        function markHooveredElement(element) {
            element.style.border = "1px solid red";
        }

        function unmarkHooveredElement(element) {
            element.style.border = "";
        }

        function onHoverOver(element) {
            if (hoverOverElement !== element) {
                hoverOverElement && unmarkHooveredElement(hoverOverElement);
                hoverOverElement = element;
                markHooveredElement(hoverOverElement);
            }
        }

        function discardHover() {
            hoverOverElement && unmarkHooveredElement(hoverOverElement);
            hoverOverElement = null;
        }

        function moveAt(e) {
            subject.style.left = e.pageX - gctx.shiftX + "px";
            subject.style.top = e.pageY - gctx.shiftY + "px";
        }

        let lastOnMoveTimeout = -1;
        const onDocumentMouseMoveListener = function(e) {
            moveAt(e);
            clearTimeout(lastOnMoveTimeout);
            lastOnMoveTimeout = setTimeout(function() {
                const cursorViewPortX = e.clientX;
                const cursorViewPortY = e.clientY;
                const elementsUnderCursor = document.elementsFromPoint(cursorViewPortX, cursorViewPortY);
                const firstNonSubjectElement = elementsUnderCursor.find(function(element) {
                    return element !== subject && !subject.contains(element);
                });
                firstNonSubjectElement && onHoverOver(firstNonSubjectElement);
            }, 25);
        };

        const onMouseUpListener = function() {
            document.removeEventListener("mousemove", onDocumentMouseMoveListener);
            subject.removeEventListener("mouseup", onMouseUpListener);
            subject.style.opacity = "1";
            subject.style.position = "relative";
            subject.style.left = "";
            subject.style.top = "";
            subject.style.zIndex = "";
            if (hoverOverElement) {
                console.log("Move " + getElementSelector(subject) + " to " + getElementSelector(hoverOverElement));
                const event = new CustomEvent("pmpd-dropped", {
                    detail: {
                        subject: subject,
                        target: hoverOverElement,
                        targetSelector: getElementSelector(hoverOverElement)
                    }
                });
                hoverOverElement.appendChild(subject);
                hoverOverElement.dispatchEvent(event);
            }

            discardHover();
        };

        const onMouseDownListener = function(e) {
            const coords = getCoords(subject);
            const shiftX = e.pageX - coords.left;
            const shiftY = e.pageY - coords.top;
            gctx.shiftX = shiftX;
            gctx.shiftY = shiftY;

            subject.style.position = "absolute";
            document.body.appendChild(subject);
            moveAt(e);

            subject.style.zIndex = "1000";
            subject.style.opacity = "0.1";

            document.addEventListener("mousemove", onDocumentMouseMoveListener);

            subject.addEventListener("mouseup", onMouseUpListener);

        }

        subject.addEventListener("mousedown", onMouseDownListener);

        subject.ondragstart = function() {
            return false;
        };

        function getCoords(elem) {
            const box = elem.getBoundingClientRect();
            return {
                top: box.top + (scrollY || pageYOffset),
                left: box.left + (scrollX || pageXOffset)
            };
        }

        return {
            destroy: function() {
                subject.removeEventListener("mousedown", onMouseDownListener);
            },
            onDropped: function(callback) {
                subject.addEventListener("pmpd-dropped", function(e) {
                    callback(e.detail);
                });
            }
        };
    }

    window.PMPDInitDraggable = initDraggable;
})();
