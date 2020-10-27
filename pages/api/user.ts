import { withAuth } from 'lib/session'

async function User(req, res) {
  const user = req.session.get('user')

  if (user) {
    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
}

export default withAuth(User)
