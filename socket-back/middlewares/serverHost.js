export default function serverHost(req, res, next) {
  try {
    global.serverURI = req.protocol + '://' + req.headers.host;
    next();
  } catch (e) {
    next(e);
  }
}
