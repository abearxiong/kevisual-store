export const getPathKey = () => {
  // 从localtion.href的路径中，/a/b 中 a为path，b为key
  const pathname = location.pathname;
  const paths = pathname.split('/');
  const [path, key] = paths.slice(1);
  return { path, key, id: path + '---' + key, prefix: `/${path}/${key}` };
};
