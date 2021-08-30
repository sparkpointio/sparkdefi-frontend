import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

export function RedirectToFarms({ location }: RouteComponentProps){
    return <Redirect to={{...location, pathname: '/farms'}} />
}

export function RedirectToPools({ location }: RouteComponentProps){
    return <Redirect to={{...location, pathname: '/pools'}} />
}