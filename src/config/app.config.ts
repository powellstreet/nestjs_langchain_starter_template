export default () => ({
  port:
    process.env.PORT || (process.env.NODE_ENV === 'development' ? 3000 : 8000),
  isDevelopment: process.env.NODE_ENV === 'development',
});
