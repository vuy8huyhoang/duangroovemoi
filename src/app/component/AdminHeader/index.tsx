import React from 'react';
import styles from './AdminHeader.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';

const AdminHeader: React.FC = () => {
    return (
        <div className={styles.header}>
            <div className={styles.hoverIcon}>
                <Link href="/">
                    <ReactSVG className={styles.svgIcon} src="/Exit to app.svg" />
                </Link>
        </div>
        </div>
    );
};

export default AdminHeader;
