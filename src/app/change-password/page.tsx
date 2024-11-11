// src/app/change-password/page.tsx

"use client";
import { useState } from 'react';
import axios from '@/lib/axios';
import styles from './changepassword.module.scss';

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Thực hiện đổi mật khẩu');
    
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp');
            console.log('Mật khẩu xác nhận không khớp');
            return;
        }
    
        try {
            console.log('Gửi yêu cầu đổi mật khẩu', { oldPassword, newPassword });
            const response: any = await axios.patch('/change-password', {
                oldPassword,
                newPassword,
            });
            
            // setMessage(response.data.message);
            console.log('Đổi mật khẩu thành công:', response.result.message);
            alert("Đăng nhập thành công!");
        } catch (error: any) {
            // Kiểm tra sự tồn tại của error.response trước khi truy cập
            const errorMessage = error.response ;
            setMessage(errorMessage);
            console.log('Lỗi khi đổi mật khẩu:', errorMessage);
            console.error('Chi tiết lỗi:', error); // Log chi tiết lỗi
        }
    };
    

    return (
        <div className={styles.container}>
        <h1 className={styles.title}>Đổi mật khẩu</h1>
        <form onSubmit={handleChangePassword}>
            <input
                type="password"
                placeholder="Mật khẩu cũ"
                className={styles.input} // Sử dụng lớp cục bộ
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu mới"
                className={styles.input} // Sử dụng lớp cục bộ
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className={styles.input} // Sử dụng lớp cục bộ
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className={styles.button}>Đổi mật khẩu</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
    </div>
    );
}
