"use client";
import { useEffect, useState, useRef } from 'react';
import style from './thuvien.module.scss';
import { Link } from 'react-router-dom';
import PlaylistPage from '../playlist/page';
export default function Thuvien() {
    

    

    
    return (
        <div className={style.mymusicoverivew }>
        <div className={style.header}>
            <div className={style.text}>Thư viện</div>
                <button className={style.zmbtnbutton} tabIndex="0">
                    <i className={style.icon}>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <g filter="url(#filter0_d_3141_46346)"><circle cx="22" cy="21" r="18" fill="#FEFFFF"></circle></g>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8449 13.5557C18.1011 13.14 17.7292 12.9322 17.4248 12.9672C17.1591 12.9977 16.9187 13.1388 16.7624 13.3558C16.5833 13.6045 16.5833 14.0305 16.5833 14.8825V27.1179C16.5833 27.9698 16.5833 28.3958 16.7624 28.6445C16.9186 28.8615 17.1591 29.0026 17.4247 29.0331C17.7292 29.0681 18.101 28.8604 18.8447 28.4448L29.7922 22.3277C30.568 21.8942 30.9559 21.6775 31.0849 21.3922C31.1973 21.1434 31.1973 20.8584 31.0849 20.6096C30.956 20.3243 30.5681 20.1076 29.7923 19.674L18.8449 13.5557Z" fill="#141414"></path>
                            <defs>
                                <filter id="filter0_d_3141_46346" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3141_46346"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3141_46346" result="shape"></feBlend>
                                </filter>
                        </defs>
                        </svg>
                    </i>
                </button>
            </div>

            {/* <div className={style.content}>
                <h3>
                    PLAYLIST
                </h3>
                <p>Tất Cả</p>

            </div> */}
            <PlaylistPage/>  
    </div>
         
    );
}

