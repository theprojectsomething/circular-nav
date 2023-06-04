import './style.scss';

console.clear();
const el = {
  scroller: document.querySelector('.scroller'),
  nav: document.querySelector('nav'),
  navitems: document.querySelectorAll('nav li'),
};

let scrollXPrev = 0;
let scrollYPrev = 0;
let scrollPrev = 0;

const onScroll = () => {
  console.log('no scroll', xxx);

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
  console.log({ scrollXDelta, scrollYDelta });
  if (Math.abs(scrollXDelta) > Math.abs(scrollYDelta)) {
    console.log('Set Y');
    el.scroller.scrollTop = scrollLeft;
    scrollPrev = scrollX;
  } else if (scrollXDelta !== scrollYDelta) {
    console.log('Set X');
    el.scroller.scrollLeft = scrollTop;
    scrollPrev = scrollY;
  } else {
    console.log('Set None');
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
  init() {
    el.nav.style.setProperty('--items', el.navitems.length);
    for (const [index, item] of el.navitems.entries()) {
      item.style.setProperty('--index', index);
    }
    el.scroller.addEventListener('scroll', onScroll);
    el.nav.addEventListener('input', (e) => {
      const index = e.target.closest('li').style.getPropertyValue('--index');
      console.log(index);
      const scroll =
        (el.scroller.scrollWidth * index) / (el.navitems.length - 1);
      // xxx = true;
      // el.scroller.scrollTop = el.scroller.scrollLeft = scroll;
      scrollPrev = scroll;
      el.scroller.scrollTo({
        top: scroll,
        behavior: 'smooth',
        left: scroll,
        // behavior: 'instant',
      });
      console.log(
        typeof scroll,
        scroll,
        el.scroller.scrollTop,
        el.scroller.scrollLeft,
        el.scroller.offsetWidth,
        el.scroller.scrollWidth
      );
    });
  },
};

fn.init();
