import style from './musicpartner.module.scss';

export default function MusicPartner() {
    return (
        <div className={style.partnerSection}>
            <h2>Đối Tác Âm Nhạc</h2>
            <div className={style.logoGrid}>
                <div className={style.logoCard}><img src="/danal.png" alt="Danal Entertainment" /></div>
                <div className={style.logoCard}><img src="/route-note.png" alt="Routenote" /></div>
                <div className={style.logoCard}><img src="/believe.png" alt="Believe" /></div>
                <div className={style.logoCard}><img src="/FUGA.png" alt="Fuga" /></div>
                <div className={style.logoCard}><img src="/genie.png" alt="Genie" /></div>
                <div className={style.logoCard}><img src="/monstercat.png" alt="Monstercat" /></div>
                <div className={style.logoCard}><img src="/stone-music.png" alt="Stone Music Entertainment" /></div>
                <div className={style.logoCard}><img src="/SM-Entertainment.png" alt="SM Entertainment" /></div>
                <div className={style.logoCard}><img src="/yg.png" alt="YG Entertainment" /></div>
                <div className={style.logoCard}><img src="/kakao.png" alt="Kakao Entertainment" /></div>
                <div className={style.logoCard}><img src="/beggers.png" alt="Big Hit" /></div>
                <div className={style.logoCard}><img src="/empire.png" alt="Empire" /></div>
                <div className={style.logoCard}><img src="/universal-1.png" alt="Universal Music Group" /></div>
                <div className={style.logoCard}><img src="/ingrooves.png" alt="Virgin Music Group" /></div>
                <div className={style.logoCard}><img src="/sony.png" alt="Sony Music" /></div>
                <div className={style.logoCard}><img src="/orcahrd.png" alt="The Orchard" /></div>
            </div>
        </div>
    );
}
