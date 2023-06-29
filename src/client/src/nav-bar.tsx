import React from 'react'
import ky from 'ky'
import { errorToast, successToast } from './toasts'

export default function NavBar() {
    function logout() {
        if (!window.confirm('Are you sure you want to logout?')) {
            return
        }

        ky.post('/api/v1/auth/logout')
        .then(res => {
            successToast('Logged out!')
        })
        .catch(err => errorToast('Could not log out.'))
    }

    return (<>
        <div>
            <a href="/">home</a>
            <div onClick={logout}>logout</div>
        </div>
    </>)
}