import React from 'react'
import listRoutes from './listRoutes'
import { Route } from 'react-router-dom'

export default function generateRoutes() {
    return listRoutes.map((route) => {
        if(route.nested) {
            return (
                <Route key={route.path} path={route.path} element={<route.element />}>
                    {route.nested.map((item) => (
                        <Route 
                            key={item.path}
                            path={item.path}
                            element={<item.element />}
                        />
                    ))}
                </Route>
            )
        }else {
            return <Route key={route.path} path={route.path} element={route.element} />
        }
    });
}
