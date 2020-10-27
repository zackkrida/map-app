import { withAuth } from 'lib/session'

async function Login(req, res) {
  if (!req.body.pass || req.body.pass !== process.env.AUTH_PASSWORD) {
    res.send({ isLoggedIn: false })
  }

  req.session.set('user', { authenticated: true })
  await req.session.save()

  res.send({ isLoggedIn: true })
}

export default withAuth(Login)
