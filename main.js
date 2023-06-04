import './style.scss';

console.clear();
const el = {
  scroller: document.querySelector('.scroller'),
  nav: document.querySelector('nav'),
  navitems: Array.from(document.querySelectorAll('nav li')),
  naviteminputs: Array.from(document.querySelectorAll('nav li input')),
};

let scrollXPrev = 0;
let scrollYPrev = 0;
let scrollPrev = 0;

const onScroll = () => {
  fn.onScrollEnd();
  if (xxx) {
    xxx = false;
    return;
  }
  const {
    scrollLeft,
    scrollTop,
    offsetWidth,
    offsetHeight,
    scrollHeight,
    scrollWidth,
  } = el.scroller;
  const scrollX = scrollLeft / (scrollWidth - offsetWidth);
  // const scrollXDelta = scrollX - scrollXPrev;
  const scrollXDelta = Math.round((scrollX - scrollPrev) * 1000);
  scrollXPrev = scrollX;

  const scrollY = scrollTop / (scrollHeight - offsetHeight);
  // const scrollYDelta = scrollY - scrollYPrev;
  const scrollYDelta = Math.round((scrollY - scrollPrev) * 1000);
  scrollYPrev = scrollY;

  // let scroll;
  // console.log({ scrollXDelta, scrollYDelta });
  if (Math.abs(scrollXDelta) > Math.abs(scrollYDelta)) {
    el.scroller.scrollTop = scrollLeft;
    scrollPrev = scrollX;
  } else if (scrollXDelta !== scrollYDelta) {
    el.scroller.scrollLeft = scrollTop;
    scrollPrev = scrollY;
  } else {
    scrollPrev = scrollX;
  }
  // const scroll = Math.min(1, (scrollX ** 2 + scrollY ** 2) ** 0.5);
  const scroll = scrollPrev;

  el.nav.style.setProperty('--scroll', scroll);
  el.nav.style.setProperty('--scroll-x', scrollX);
  el.nav.style.setProperty('--scroll-y', scrollY);

  // const scroll = Math.max()
};

let xxx;
const fn = {
  indexFromScroll: (scroll) =>
    Math.round((scroll * el.navitems.length) / el.scroller.scrollWidth),
  scrollFromIndex: (index) =>
    (el.scroller.scrollWidth * index) / el.navitems.length,
  onScrollEnd: () => {
    console.log('scroll timeout');
    clearTimeout(fn.scrolltimeout);
    fn.scrolltimeout = setTimeout(() => {
      const visibleIndex = fn.indexFromScroll(el.scroller.scrollLeft);
      console.log('scrollend', el.scroller.scrollLeft, visibleIndex);
      if (visibleIndex !== fn.activeIndex) {
        const item = el.naviteminputs.at(visibleIndex);
        fn.activeIndex = visibleIndex;
        item.checked = true;
        item.focus();
        console.log('scrollToIndex', item);
        return;
      }
    }, 100);
  },
  init() {
    el.nav.style.setProperty('--items', el.navitems.length);
    for (const [index, item] of el.navitems.entries()) {
      item.style.setProperty('--index', index);
    }
    el.scroller.addEventListener('scroll', onScroll);
    fn.activeIndex = 0;
    fn.activeItem = el.naviteminputs.at(fn.activeIndex);
    el.nav.addEventListener('focusin', (e) => {
      // console.log(document.activeElement)
      // e.preventDefault();
      // return;
      const index = el.naviteminputs.indexOf(e.target);
      if (Math.abs(index - fn.activeIndex) > 4) {
        fn.activeItem.checked = true;
        fn.activeItem.focus();
        console.log(fn.activeItem.checked);
        return;
      }
      fn.activeItem = e.target;
      fn.activeIndex = index;

      // const index = e.target.closest('li').style.getPropertyValue('--index');
      console.log(index);
      const scroll = fn.scrollFromIndex(index);
      // xxx = true;
      // el.scroller.scrollTop = el.scroller.scrollLeft = scroll;
      scrollPrev = scroll;
      el.scroller.scrollTo({
        top: scroll,
        behavior: 'smooth',
        left: scroll,
        // behavior: 'instant',
      });
      // console.log(
      //   typeof scroll,
      //   scroll,
      //   el.scroller.scrollTop,
      //   el.scroller.scrollLeft,
      //   el.scroller.offsetWidth,
      //   el.scroller.scrollWidth
      // );
    });
  },
};

fn.init();
