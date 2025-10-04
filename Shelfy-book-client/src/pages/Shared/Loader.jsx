import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../../assets/lotties/loader.json';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Lottie
                animationData={loaderAnimation}
                loop={true}
                style={{ width: 180, height: 180 }}
            />
        </div>
    );
};

export default Loader;


