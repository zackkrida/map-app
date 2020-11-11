import Dialog from '@reach/dialog'
import { postFetcher } from 'lib/utils'
import React, { useState } from 'react'

export function LoginModal({
  setUnauthenticated,
}: {
  setUnauthenticated: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      let { isLoggedIn } = await postFetcher('/api/login', { pass })
      if (isLoggedIn) {
        setErr('')
        setUnauthenticated(false)
      } else {
        throw new Error('Invalid password.')
      }
    } catch (error) {
      setErr('Invalid password. Please try again.')
      setPass('')
      console.error(error)
    }
  }

  return (
    <Dialog aria-label="Login pop up">
      <form
        onSubmit={handleSubmit}
        className="p-4 h-full flex flex-col justify-between items-center text-center flex-grow bg-white rounded sm:shadow-md"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Log in to the Marshall Map
          </h3>
          <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
            <p>Enter the password to stay logged-in for 15 days.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="max-w-xs w-full">
              <label htmlFor="email" className="sr-only">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="email"
                  type="password"
                  className="form-input block w-full sm:text-sm sm:leading-5"
                  placeholder="Enter the password here"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                />
              </div>
            </div>
            <span className="mt-3 inline-flex rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-brand-navy hover:bg-blue-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 sm:w-auto sm:text-sm sm:leading-5"
              >
                Submit
              </button>
            </span>
          </div>
          {err && <p>{err}</p>}
        </div>
      </form>
    </Dialog>
  )
}
