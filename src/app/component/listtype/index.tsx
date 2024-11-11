import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import style from './listtype.module.scss'; 
import Link from 'next/link';
interface Type {
    id_type: string;
    name: string;
    slug: string;

}

export default function ListType() {
    const [albumData, setAlbumData] = useState<Type[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/type')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    const data = response.result.data;
                    const ngaunhien = data.sort(() => 0.5 - Math.random());
                    setAlbumData(ngaunhien.slice(0, 3)); 
                } else {
                    console.error('Response data is undefined or null:', response);
                    setAlbumData([]); 
                }
            })
            .catch((error: any) => {
                console.error('Lỗi fetch album:', error); 
                setAlbumData([]); 
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);
    return (
        <>
            <div className={style.albumGrid}>
                {loading ? (
                    <p>Đang tải album...</p>
                ) : (
                    albumData.map((album,index) => (
                       
                        <div key={album.id_type || index} className={style.albumCard}>
                          <Link href={`/type/${album.id_type}`} className={style.typeLink} >
                          {album.name}
                        </Link>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
