import {configureStore} from '@reduxjs/toolkit'
import authReducer from './Slices/userAuthSlice'
import adminAuthReducer from './Slices/adminAuthSlice'



const store = configureStore({
    reducer:{
        auth:authReducer,
        adminAuth:adminAuthReducer
    }
})

export default store