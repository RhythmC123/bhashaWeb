// Test endpoint to check if middleware is working
export default function handler(req, res) {
  const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'bhasha_admin'
  const token = req.cookies.get ? req.cookies.get(COOKIE_NAME)?.value : req.cookies[COOKIE_NAME]
  
  console.log('Test middleware endpoint:', {
    cookieName: COOKIE_NAME,
    token: token,
    allCookies: req.cookies,
    headers: req.headers
  })
  
  res.status(200).json({
    cookieName: COOKIE_NAME,
    token: token,
    hasToken: !!token,
    allCookies: req.cookies
  })
}
