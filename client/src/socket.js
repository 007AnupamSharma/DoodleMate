import { io } from 'socket.io-client';
import React, {useMemo} from 'react'

const socket = useMemo(()=> io("http://localhost:3000"),[]);
export default socket;