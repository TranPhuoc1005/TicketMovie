// components/Alert/Alert.js
import { toast } from 'react-toastify';

// Icon components
const SuccessIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
);

const ErrorIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
    </svg>
);

const WarningIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
);

const InfoIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
);

const defaultOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export default class Alert {
    static success(message, options = {}) {
        const toastOptions = {
            ...defaultOptions,
            ...options,
            className: 'toast-success',
            icon: <SuccessIcon />,
        };
        
        return toast.success(message, toastOptions);
    }

    static error(message, options = {}) {
        const toastOptions = {
            ...defaultOptions,
            autoClose: 4000,
            ...options,
            className: 'toast-error',
            icon: <ErrorIcon />,
        };
        
        return toast.error(message, toastOptions);
    }

    static warning(message, options = {}) {
        const toastOptions = {
            ...defaultOptions,
            ...options,
            className: 'toast-warning',
            icon: <WarningIcon />,
        };
        
        return toast.warning(message, toastOptions);
    }

    static info(message, options = {}) {
        const toastOptions = {
            ...defaultOptions,
            ...options,
            className: 'toast-info',
            icon: <InfoIcon />,
        };
        
        return toast.info(message, toastOptions);
    }

    static loading(message = 'Đang xử lý...', options = {}) {
        const toastOptions = {
            ...defaultOptions,
            autoClose: false,
            closeOnClick: false,
            ...options,
            className: 'toast-loading',
        };
        
        return toast.loading(message, toastOptions);
    }

    static promise(promise, messages, options = {}) {
        const promiseOptions = {
            pending: {
                render: messages.loading || 'Đang xử lý...',
                ...defaultOptions,
                autoClose: false,
                closeOnClick: false,
            },
            success: {
                render: messages.success || 'Thành công!',
                ...defaultOptions,
                autoClose: 2000,
                icon: <SuccessIcon />,
            },
            error: {
                render: messages.error || 'Có lỗi xảy ra!',
                ...defaultOptions,
                autoClose: 4000,
                icon: <ErrorIcon />,
            },
            ...options,
        };
        
        return toast.promise(promise, promiseOptions);
    }

    static custom(message, options = {}) {
        const toastOptions = {
            ...defaultOptions,
            ...options,
        };
        
        return toast(message, toastOptions);
    }

    static dismissAll() {
        toast.dismiss();
    }

    static dismiss(toastId) {
        toast.dismiss(toastId);
    }

    static update(toastId, options) {
        toast.update(toastId, options);
    }

    static loginSuccess(username = '') {
        return this.success(
            username ? `Chào mừng ${username}!` : 'Đăng nhập thành công!',
            { autoClose: 2000 }
        );
    }

    static loginError() {
        return this.error('Tài khoản hoặc mật khẩu không đúng!');
    }

    static logoutSuccess() {
        return this.info('Đã đăng xuất thành công!', { autoClose: 2000 });
    }

    static networkError() {
        return this.error('Lỗi kết nối mạng. Vui lòng thử lại!');
    }

    static registerSuccess() {
        return this.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', {
            autoClose: 3000
        });
    }

    static registerError(message = 'Đăng ký thất bại! Vui lòng thử lại.') {
        return this.error(message, {
            autoClose: 4000
        });
    }

    static validationError(field = '') {
        return this.warning(
            field ? `Vui lòng nhập ${field}!` : 'Vui lòng kiểm tra lại thông tin!'
        );
    }

    static saveSuccess() {
        return this.success('Lưu thành công!', { autoClose: 2000 });
    }

    static deleteSuccess() {
        return this.success('Xóa thành công!', { autoClose: 2000 });
    }

    static deleteConfirm(callback) {
        return this.warning('Tính năng xác nhận sẽ được thêm vào sau!');
    }
}