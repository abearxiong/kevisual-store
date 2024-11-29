console.log('index.js');
import { Page } from '@kevisual/store/page';

const page = new Page({
  isListen: true,
});

page.addPage('/:id', 'user');

page.subscribe('user', (params, state) => {
  console.log('user', params, 'state', state);
  return;
});

// page.navigate('/c', { id: 3 });
// page.navigate('/c', { id: 2 });
// page.refresh();
