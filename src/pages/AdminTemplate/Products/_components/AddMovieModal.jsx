import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Upload, Calendar, Star, Film, Link, FileText, Hash, Save, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovieApi, updateMovieApi } from "../../../../services/movie.api";
import { toast } from "react-toastify";


const schema = z.object({
  tenPhim : z.string().nonempty("Vui lòng nhập tên phim").min(6,"Nhập ít nhất 6 ký tự !"),
  trailer: z.string().nonempty("Vui lòng nhập thông tin").regex(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/gi , "Vui lòng nhập đúng định dạng url"),
  moTa: z.string().nonempty("Vui lòng nhập thông tin").max(100, "Nội dung không được vượt quá 200 ký tự"),
  ngayKhoiChieu: z.string().nonempty("Vui lòng nhập thông tin"),
  trangThai: z.string().optional(),
  Hot:  z.boolean().optional(),
  maNhom: z.string().optional("GP01"),
  danhGia: z.union([z.string(), z.number()]).refine((val) => {const num = Number(val); return !isNaN(num) && num >= 0 && num <= 10;}, "Vui lòng nhập từ 0 đến 10"),
  hinhAnh: z.any()
})

const AddMovieModal = ({ isOpen, onClose, editData = null, setEditData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isValid } } = useForm({
        mode: "onChange",
        defaultValues: {
            tenPhim: "",
            biDanh: "",
            trailer: "",
            hinhAnh: null,
            moTa: "",
            maNhom: "GP01",
            ngayKhoiChieu: "",
            danhGia: "",
            Hot: false,
            trangThai: false,
        },
        resolver: zodResolver(schema)
    });

    const watchTenPhim = watch("tenPhim");
    const generateBiDanh = (tenPhim) => {
        return tenPhim
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    useEffect(() => {
        if (watchTenPhim) {
            const biDanh =
                generateBiDanh(watchTenPhim) + Math.floor(Math.random() * 1000);
            setValue("biDanh", biDanh);
        }
    }, [watchTenPhim, setValue]);

    const hinhAnh = watch("hinhAnh");

    // Add movie
    const queryClient = useQueryClient();
    const {mutate: addMovie, isLoading } = useMutation({
        mutationFn: addMovieApi,
        onSuccess: () => {
            toast.success("Thêm phim thành công");
            setIsSubmitting(false);
            queryClient.invalidateQueries(["movies"]);
            handleClose();
        },
        onError: (error) => {
            toast.error("Thêm phim thất bại !");
            setIsSubmitting(false);
            console.log("❌ Lỗi cụ thể:", error);
        }
    })

    // Edit movie có hình
    const { mutate: updateMovie } = useMutation({
        mutationFn: updateMovieApi,
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries(["list-movie"]);
            setIsSubmitting(false);
            handleClose();
        },
        onError: () => {
            toast.error("Cập nhật thất bại!");
            setIsSubmitting(false);
        }
    })

    const formatDateForInput = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (editData) {
            setPreviewImageUrl(editData.hinhAnh);
            reset({
                ...editData,
                ngayKhoiChieu: formatDateForInput(editData.ngayKhoiChieu),
                trangThai: editData.dangChieu ? "dangChieu" : "sapChieu",
                Hot: editData.hot,
                hinhAnh: null,
            });
        }else {
            setPreviewImageUrl(null);
            reset({
                maNhom: "GP01",
                danhGia: "0",
                Hot: false,
            });
        }
    }, [editData]);

    const handleClose = () => {
        reset();
        setSelectedImage(null);
        setPreviewImageUrl(null);
        setEditData(null);
        onClose();
    };
    
    const onSubmitForm = async (values) => {
        try {
            setIsSubmitting(true);
            const { trangThai, Hot, ...rest } = values;
            const newValues = {
                ...rest,
                SapChieu: trangThai === "sapChieu",
                DangChieu: trangThai === "dangChieu",
                Hot: Hot === true || Hot === "true"
            };
            console.log("typeof hinhAnh:", typeof newValues.hinhAnh);
            console.log("instanceof File:", newValues.hinhAnh instanceof File);
            console.log("isEdit:", Boolean(editData));
            if(editData) {
                // Edit có hình mới
                const formData = new FormData();
                formData.append("maPhim", editData.maPhim);
                formData.append("tenPhim", newValues.tenPhim);
                formData.append("trailer", newValues.trailer);
                formData.append("moTa", newValues.moTa);
                formData.append("danhGia", newValues.danhGia);
                formData.append("SapChieu", newValues.SapChieu);
                formData.append("DangChieu", newValues.DangChieu);
                formData.append("ngayKhoiChieu", format(new Date(newValues.ngayKhoiChieu), "dd/MM/yyyy"));
                formData.append("maNhom", newValues.maNhom);
                formData.append("hot", newValues.Hot);
                if(selectedImage instanceof File) {
                    formData.append("hinhAnh", selectedImage);
                } else {
                    console.log("No new image selected, keeping existing image");
                }
                updateMovie(formData);
            }else {
                // Add new movie
                const formData = new FormData();
                formData.append("tenPhim", newValues.tenPhim);
                formData.append("trailer", newValues.trailer);
                formData.append("moTa", newValues.moTa);
                formData.append("danhGia", newValues.danhGia);
                formData.append("SapChieu", newValues.SapChieu);
                formData.append("DangChieu", newValues.DangChieu);
                formData.append("ngayKhoiChieu", format(new Date(newValues.ngayKhoiChieu), "dd/MM/yyyy"));
                formData.append("hinhAnh", newValues.hinhAnh);
                formData.append("maNhom", newValues.maNhom);
                addMovie(formData);
            }
        } catch (error) {
            console.error("Submit lỗi", error);
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Film size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Thêm phim mới
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Điền thông tin phim để thêm vào hệ thống
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Film
                                            size={16}
                                            className="mr-2 text-purple-500"
                                        />
                                        Tên phim *
                                    </label>
                                    <input
                                        {...register("tenPhim")}
                                        type="text"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                            errors?.tenPhim
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Nhập tên phim..."
                                    />
                                    {errors?.tenPhim?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {errors.tenPhim.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Hash
                                            size={16}
                                            className="mr-2 text-blue-500"
                                        />
                                        Bí danh
                                    </label>
                                    <input
                                        {...register("biDanh")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        placeholder="Tự động tạo từ tên phim..."
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Link
                                            size={16}
                                            className="mr-2 text-red-500"
                                        />
                                        Link trailer YouTube *
                                    </label>
                                    <input
                                        {...register("trailer")}
                                        type="url"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                                            errors?.trailer ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {errors?.trailer?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {errors.trailer.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FileText
                                            size={16}
                                            className="mr-2 text-green-500"
                                        />
                                        Mô tả phim
                                    </label>
                                    <textarea
                                        {...register("moTa")}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                                            errors?.moTa ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                        placeholder="Nhập mô tả nội dung phim..."
                                    />
                                    {errors?.moTa?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {errors.moTa.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Calendar
                                            size={16}
                                            className="mr-2 text-orange-500"
                                        />
                                        Ngày khởi chiếu *
                                    </label>
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="default-datepicker"
                                            type="date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Select date"
                                            {...register("ngayKhoiChieu")}
                                        />
                                    </div>
                                    {errors?.ngayKhoiChieu?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {errors.ngayKhoiChieu.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <label
                                        htmlFor="image-upload"
                                        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-gray-50 ${
                                        errors.hinhAnh ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                    >
                                        {!previewImageUrl  && (
                                            <span className="text-gray-500 text-sm">Click để chọn ảnh</span>
                                        )}

                                        {previewImageUrl  && (
                                            <img
                                                src={previewImageUrl}
                                                className="h-full object-cover"
                                                alt="preview"
                                            />
                                        )}
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept=".png,.jpeg,.jpg"
                                        className="hidden"
                                         onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setValue("hinhAnh", file);
                                                setSelectedImage(file);
                                                setPreviewImageUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {previewImageUrl  && (
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 border border-red-500 text-xs"
                                            onClick={() => {
                                                setValue("hinhAnh", null, { shouldValidate: true });
                                                setPreviewImageUrl(null);
                                            }}
                                            >
                                        Delete
                                        </button>
                                    )}
                                    </div>
                                    {errors?.hinhAnh?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {errors.hinhAnh.message}
                                        </p>
                                    )}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Star
                                            size={16}
                                            className="mr-2 text-yellow-500"
                                        />
                                        Đánh giá (1-10) *
                                    </label>
                                    <Controller
                                        name="danhGia"
                                        control={control}
                                        rules={errors.danhGia}
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    {...field}
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                />
                                                <div className="flex items-center space-x-1 min-w-[60px]">
                                                    <Star
                                                        size={16}
                                                        className="text-yellow-500 fill-current"
                                                    />
                                                    <span className="font-bold text-lg">
                                                        {field.value}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    />
                                    {errors?.danhGia?.message && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {errors.danhGia.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Hash
                                            size={16}
                                            className="mr-2 text-teal-500"
                                        />
                                        Mã nhóm
                                    </label>
                                    <input className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all border-gray-300" disabled type="text" value="GP01" />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                                        Trạng thái phim
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                {...register("Hot")}
                                                type="checkbox"
                                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                🔥 Phim Hot
                                            </span>
                                        </label>

                                       <div className="space-y-3">
                                            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    {...register("trangThai")}
                                                    type="radio"
                                                    name="trangThai"
                                                    value="dangChieu"
                                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    🎬 Đang chiếu
                                                </span>
                                            </label>

                                            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    {...register("trangThai")}
                                                    type="radio"
                                                    name="trangThai"
                                                    value="sapChieu"
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    ⏰ Sắp chiếu
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Đang thêm...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Thêm phim</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #fbbf24;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }

                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #fbbf24;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AddMovieModal;
