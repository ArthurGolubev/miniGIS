import * as React from 'react'
import { useProfileStore } from './store'
import { Link } from 'react-router-dom'



export const Profile = () => {

    const fetchUserAlg = useProfileStore().fetchUserAlg
    const userAlg = useProfileStore().userAlg
    React.useEffect(() => {
        fetchUserAlg()
    }, [])
    

    return <div className='row justify-content-center'>
        <div className='col-12'>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <p>Алгоритмы:</p>
                    {
                        Object.keys(userAlg).length > 0 &&
                        <ul>
                            {
                                Object.keys(userAlg).map(key => <li key={key}><Link to={`/algorithm/${userAlg[key].id}`}>{userAlg[key].name}</Link></li>)
                            }
                        </ul>
                    }
                </div>
            </div>
            
            <div className='row justify-content-center'>
                <div className='col-12'>
                    
                </div>
            </div>
            
        </div>
    </div>
}