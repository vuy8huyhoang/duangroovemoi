import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import style from './bxh.module.scss';
import { ReactSVG } from 'react-svg';

interface Music {
    id_music: string;
    name: string;
    url_cover: string;
    composer: string;
    types: {
        name: string;
    }[];
}

export default function Bxh() {
    const [musicData, setBxhData] = useState<Music[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/music")
            .then((response: any) => {
                console.log(response); 
                if (response && response.result && response.result.data) {
                    const musicObj = response.result.data; 
                    setBxhData(musicObj.slice(0, 5)); 
                } else {
                    console.error('Response result.data is undefined or null', response);
                }
            })
            .catch((error: any) => {
                console.error('Lỗi fetch album', error);
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);



    return (
        <>
            <div className={style.headerSection}>
                <h2>Bảng xếp hạng </h2>
                <div className={style.all}>
                    <a href="#" className={style.viewAllButton}>Tất cả</a>
                    <ReactSVG className={style.csvg} src="/all.svg" />
                </div>
            </div>

            <div className={style.albumGrid}>
                {loading ? (
                    <p>Đang tải album...</p>
                ) : (
                    musicData.map((music) => (
                        <div key={music.id_music} className={style.albumCard}>
                            <div className={style.albumWrapper}>
                                <img src={music.url_cover} alt={music.name} className={style.musicCover} />
                                <div className={style.overlay}>
                                    <button className={style.likeButton}>
                                        <ReactSVG src="/heart.svg" />
                                    </button>
                                    <button className={style.playButton}>
                                        <ReactSVG src="/play.svg" />
                                    </button>
                                    <button className={style.moreButton}>
                                        <ReactSVG src="/more.svg" />
                                    </button>
                                </div>
                            </div>
                            <a className={style.musicTitle}>{music.name}</a>
                            <p className={style.composerName}>
                                {music.types.map((type) => type.name).join(', ')}
                            </p>

                        </div>
                    ))
                )}
            </div>
        </>
    );
}
