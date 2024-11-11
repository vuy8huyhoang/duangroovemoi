import React, { useState, useEffect } from "react";
import style from "./sildeshow.module.scss"; 

const Slideshow = () => {
    const images = [
        "https://photo-zmp3.zmdcdn.me/cover/3/f/4/1/3f41f32d1ca9baeb2206137e5f2eab5c.jpg",
        "https://photo-zmp3.zmdcdn.me/cover/d/0/6/4/d06469e7ceb051257efd91671ff2e698.jpg",
        "https://photo-zmp3.zmdcdn.me/cover/1/4/b/d/14bde6474eb1bb1c3c3e04e6a6a619fc.jpg"
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000); 

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className={style.slideshow}>
            <img 
                src={images[currentIndex]} 
                alt="Slideshow Banner" 
                className={style.bannerImage} 
            />
        </div>
    );
};

export default Slideshow;
