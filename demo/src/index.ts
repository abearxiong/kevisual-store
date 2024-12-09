console.log('index.js');
import { Page } from '@kevisual/store/page';

const page = new Page({
  isListen: true,
});
page.basename = '';
page.addPage('/', 'home');
page.addPage('/:id', 'user');
page.subscribe(
  'home',
  (params, state) => {
    console.log('home', params, 'state', state);
    return;
  },
);
page.subscribe('user', (params, state) => {
  console.log('user', params, 'state', state);
  return;
});

// page.navigate('/c', { id: 3 });
// page.navigate('/c', { id: 2 });
// page.refresh();

// @ts-ignore
window.page = page;