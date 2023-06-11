import './style.scss';

console.clear();

let scroll = 0;
let scrolltimeout;
let activeIndex;
let activeItem;

const el = {
  scroller: document.querySelector('.scroller'),
  nav: document.querySelector('nav'),
  navitems: Array.from(document.querySelectorAll('nav li')),
  naviteminputs: Array.from(document.querySelectorAll('nav li input')),
};

const getIndexFromScroll = (scroll) =>
  Math.round((scroll * el.navitems.length) / el.scroller.scrollWidth);

const getScrollFromIndex = (index) =>
  (el.scroller.scrollWidth * index) / el.navitems.length;

// uses a hidden, scrollable element to smoothly rotate our nav
// items by calculating the scroll position and passing it as a
// CSS variable. CSS is responsible for all nav visual effects.
const onScroll = () => {
  // starts the scrollend timeout on every scroll
  onScrollEnd();

  // retrieve required values from our scroll
  const {
    scrollLeft,
    scrollTop,
    offsetWidth,
    offsetHeight,
    scrollHeight,
    scrollWidth,
  } = el.scroller;

  // X / Y scroll position without overflow
  const scrollX = Math.max(
    0,
    Math.min(1, scrollLeft / (scrollWidth - offsetWidth))
  );
  const scrollY = Math.max(
    0,
    Math.min(1, scrollTop / (scrollHeight - offsetHeight))
  );
  // ensure comparisons check equivalence up to 3 decimal places
  const scrollXDelta = Math.round((scrollX - scroll) * 1e3);
  const scrollYDelta = Math.round((scrollY - scroll) * 1e3);

  // absolute greater-than comparison of "equivalence"
  if (Math.abs(scrollXDelta) > Math.abs(scrollYDelta)) {
    el.scroller.scrollTop = scrollLeft;
    scroll = scrollX;
    // absolute less-than comparison
  } else if (scrollXDelta !== scrollYDelta) {
    el.scroller.scrollLeft = scrollTop;
    scroll = scrollY;
    // equivalent equality
  } else {
    scroll = scrollX;
  }

  // update CSS var with percentage scrolled
  el.nav.style.setProperty('--scroll', scroll);
};

// a simple defered utility to handle nav item focus after scroll
// and errant keyboard nav past the first / last item
const onScrollEnd = () => {
  clearTimeout(scrolltimeout);
  if (dragging) {
    return;
  }
  scrolltimeout = setTimeout(() => {
    const visibleIndex = getIndexFromScroll(el.scroller.scrollLeft);
    const item = el.naviteminputs.at(visibleIndex);
    activeIndex = visibleIndex;
    activeItem = item;
    item.checked = true;
    // only switch focus if nav has focus
    if (el.nav.contains(document.activeElement)) {
      item.focus();
    } else {
      onFocusIn({ target: item });
    }
  }, 100);
};

// handles scroll "snapping" by scrolling to the focused
// nav item, or reverting to the previous focused item
// if the focused item is out of view
const onFocusIn = ({ target }) => {
  const isVisible =
    target.checkVisibility?.({ checkOpacity: true }) ??
    +getComputedStyle(target).opacity;
  if (!isVisible) {
    activeItem.checked = true;
    activeItem.focus();
    return;
  }
  activeItem = target;
  activeIndex = el.naviteminputs.indexOf(target);

  scroll = getScrollFromIndex(activeIndex);
  el.scroller.scrollTo({
    top: scroll,
    behavior: 'smooth',
    left: scroll,
  });
};

const init = () => {
  // set the total number of nav elements
  el.nav.style.setProperty('--items', el.navitems.length);
  // give each nav element an index
  for (const [index, item] of el.navitems.entries()) {
    item.style.setProperty('--index', index);
  }
  // reset the active index and item
  activeIndex = 0;
  activeItem = el.naviteminputs.at(activeIndex);

  // set up mouse and keyboard navigation listeners
  el.nav.addEventListener('focusin', onFocusIn);
  el.scroller.addEventListener('scroll', onScroll);
  navDragInit();
};

let dragging;
const navDragInit = () => {
  const controller = new AbortController();
  el.nav.addEventListener(
    'mousedown',
    (e) => {
      e.preventDefault();
      dragging = true;

      const { left, right, top, bottom, width } =
        e.currentTarget.getBoundingClientRect();
      const cX = (left + right) / 2;
      const cY = (top + bottom) / 2;
      const itemsCircle = +getComputedStyle(el.nav).getPropertyValue(
        '--items-circle'
      );
      const rotations = (el.navitems.length - 1) / itemsCircle;

      console.log('dragstart', e.currentTarget, {
        cX,
        cY,
        itemsCircle,
      });

      document.addEventListener(
        'mouseup',
        () => {
          controller.abort();
          dragging = false;
          onScrollEnd();
          navDragInit();
        },
        { once: true }
      );

      addEventListener(
        'mousemove',
        (e) => {
          const mX = cX - e.clientX;
          const mY = cY - e.clientY;
          const hyp = Math.hypot(mX, mY);
          if (hyp < 40) {
            return;
          }

          const a0 = Math.atan2(mY, mX);
          const a1 = Math.atan2(mY - e.movementY, mX - e.movementX);
          console.log(hyp);
          const aD = a1 - a0;
          const angle =
            Math.abs(aD) > Math.PI ? aD + (aD > 0 ? -1 : 1) * 2 * Math.PI : aD;
          const ratio = angle / (2 * Math.PI);

          el.scroller.scrollTop +=
            (ratio * el.scroller.scrollHeight) / rotations;
        },
        {
          signal: controller.signal,
        }
      );
    },
    {
      once: true,
    }
  );
};

addEventListener('load', init);

addEventListener('click', (e) => {
  console.log(e.clientX, e.clientY);
  const x = document.elementFromPoint(e.clientX, e.clientY);
  const xx = document.elementsFromPoint(e.clientX, e.clientY);
  console.log(x, xx);
});
