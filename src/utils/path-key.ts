export const getPathKey = () => {
  // 从localtion.href的路径中，/a/b 中 a为path，b为key
  const pathname = location.pathname;
  const paths = pathname.split('/');
  let [path, key] = paths.slice(1);
  path = path || '';
  key = key || '';
  return { path, key, id: path + '---' + key, prefix: `/${path}/${key}` };
};
