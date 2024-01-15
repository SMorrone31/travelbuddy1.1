import React from 'react'
import './list.css'
import PlaceDetails from '../PlaceDetails/PlaceDetails'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const List = ({ places, isLoading }) => {
    if (isLoading)
        return (
            <div className="list">
                <div className="listComponent">
                    <div className='listComponentSkeleton'>
                        <Skeleton style={{ borderRadius: '50%', width: '60px', fontSize: '60px', marginLeft: '10px' }} />
                        <br />
                        <Skeleton style={{ marginLeft: '10px', width: '90%', height: '15px' }} count={4} />
                        <Skeleton style={{ marginLeft: '10px', width: '60%', height: '15px' }} /><br />

                    </div>
                    <div className='listComponentSkeleton'>
                        <Skeleton style={{ borderRadius: '50%', width: '60px', fontSize: '60px', marginLeft: '10px' }} />
                        <br />
                        <Skeleton style={{ marginLeft: '10px', width: '90%', height: '15px' }} count={4} />
                        <Skeleton style={{ marginLeft: '10px', width: '60%', height: '15px' }} /><br />

                    </div>
                    <div className='listComponentSkeleton'>
                        <Skeleton style={{ borderRadius: '50%', width: '60px', fontSize: '60px', marginLeft: '10px' }} />
                        <br />
                        <Skeleton style={{ marginLeft: '10px', width: '90%', height: '15px' }} count={4} />
                        <Skeleton style={{ marginLeft: '10px', width: '60%', height: '15px' }} /><br />

                    </div>
                    <div className='listComponentSkeleton'>
                        <Skeleton style={{ borderRadius: '50%', width: '60px', fontSize: '60px', marginLeft: '10px' }} />
                        <br />
                        <Skeleton style={{ marginLeft: '10px', width: '90%', height: '15px' }} count={4} />
                        <Skeleton style={{ marginLeft: '10px', width: '60%', height: '15px' }} /><br />

                    </div>
                </div>
            </div>
        )

    return (
        <div className="placeDetail">
            <div className="card">
                {
                    // Mapping degli elementi nell'array 'places' per creare componenti PlaceDetails
                    places && places.map((place) => <PlaceDetails place={place} key={place.i} />)
                }
            </div>

        </div>

    )


}

export default List