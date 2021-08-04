import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

export default function RedirectToFarms({ location }: RouteComponentProps){
    return <Redirect to={{...location, pathname: '/farms'}} />
}