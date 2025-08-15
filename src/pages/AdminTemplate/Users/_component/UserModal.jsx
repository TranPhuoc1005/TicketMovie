import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';

// Zod schema cho validation
const userSchema = z.object({
    taiKhoan: z.string()
        .min(1, 'Tài khoản không được để trống')
        .min(3, 'Tài khoản phải có ít nhất 3 ký tự')
        .max(50, 'Tài khoản không được quá 50 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới'),
    
    matKhau: z.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu không được quá 100 ký tự')
        .optional()
        .or(z.literal('')), // Cho phép empty string khi edit
    
    hoTen: z.string()
        .min(1, 'Họ tên không được để trống')
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ tên không được quá 100 ký tự')
        .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
    
    email: z.string()
        .min(1, 'Email không được để trống')
        .email('Email không hợp lệ')
        .max(100, 'Email không được quá 100 ký tự'),
    
    soDT: z.string()
        .min(1, 'Số điện thoại không được để trống')
        .regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
    
    maNhom: z.string().min(1, 'Mã nhóm không được để trống'),
    
    maLoaiNguoiDung: z.enum(['KhachHang', 'QuanTri'], {
        errorMap: () => ({ message: 'Loại tài khoản không hợp lệ' })
    })
});

const editUserSchema = userSchema.extend({
    matKhau: z.string().optional().or(z.literal(''))
});

export default function UserModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    user = null, 
    isLoading = false 
}) {
    const [formData, setFormData] = useState({
        taiKhoan: '',
        matKhau: '',
        email: '',
        soDT: '',
        maNhom: 'GP01',
        maLoaiNguoiDung: 'KhachHang',
        hoTen: ''
    });

    const [errors, setErrors] = useState({});
    const isEditMode = !!user;

    useEffect(() => {
        if (user) {
            setFormData({
                taiKhoan: user.taiKhoan || '',
                matKhau: '',
                email: user.email || '',
                soDT: user.soDT || '',
                maNhom: user.maNhom || 'GP01',
                maLoaiNguoiDung: user.maLoaiNguoiDung || 'KhachHang',
                hoTen: user.hoTen || ''
            });
        } else {
            setFormData({
                taiKhoan: '',
                matKhau: '',
                email: '',
                soDT: '',
                maNhom: 'GP01',
                maLoaiNguoiDung: 'KhachHang',
                hoTen: ''
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const validateForm = () => {
        try {
            const schema = isEditMode ? editUserSchema : userSchema;
            const dataToValidate = { ...formData };
            if (isEditMode && !formData.matKhau.trim()) {
                delete dataToValidate.matKhau;
            }

            schema.parse(dataToValidate);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach((err) => {
                    const field = err.path[0];
                    newErrors[field] = err.message;
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const submitData = { ...formData };
            if (isEditMode && !formData.matKhau.trim()) {
                delete submitData.matKhau;
            }
            onSubmit(submitData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        try {
            if (name === 'matKhau' && isEditMode && !value.trim()) {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
                return;
            }

            const schema = isEditMode ? editUserSchema : userSchema;
            const fieldSchema = schema.shape[name];
            
            if (fieldSchema) {
                fieldSchema.parse(value);
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({
                    ...prev,
                    [name]: error.errors[0]?.message || 'Giá trị không hợp lệ'
                }));
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
                    <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {isEditMode ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                            >
                                <X size={20} />
                            </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tài khoản *
                            </label>
                            <input
                                type="text"
                                name="taiKhoan"
                                value={formData.taiKhoan}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isEditMode} // Không cho sửa tài khoản khi edit
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.taiKhoan ? 'border-red-500' : 'border-gray-300'
                                } ${isEditMode ? 'bg-gray-100' : ''}`}
                                placeholder="Nhập tài khoản (chữ cái, số, dấu gạch dưới)"
                            />
                            {errors.taiKhoan && (
                                <p className="text-red-500 text-sm mt-1">{errors.taiKhoan}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu {!isEditMode && '*'}
                                {isEditMode && <span className="text-gray-500 text-xs block">(để trống nếu không muốn thay đổi)</span>}
                            </label>
                            <input
                                type="password"
                                name="matKhau"
                                value={formData.matKhau}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.matKhau ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder={isEditMode ? "Nhập mật khẩu mới (tối thiểu 6 ký tự)" : "Nhập mật khẩu (tối thiểu 6 ký tự)"}
                            />
                            {errors.matKhau && (
                                <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên *
                            </label>
                            <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.hoTen ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập họ tên đầy đủ"
                            />
                            {errors.hoTen && (
                                <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập địa chỉ email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                name="soDT"
                                value={formData.soDT}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.soDT ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập số điện thoại (10-11 số)"
                            />
                            {errors.soDT && (
                                <p className="text-red-500 text-sm mt-1">{errors.soDT}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại tài khoản
                            </label>
                            <select
                                name="maLoaiNguoiDung"
                                value={formData.maLoaiNguoiDung}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="KhachHang">Khách hàng</option>
                                <option value="QuanTri">Quản trị</option>
                            </select>
                            {errors.maLoaiNguoiDung && (
                                <p className="text-red-500 text-sm mt-1">{errors.maLoaiNguoiDung}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors"
                            >
                                {isLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
                                {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}