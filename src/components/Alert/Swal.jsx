import Swal from "sweetalert2";

const swalHelper = {
    success: (text = "Thành công!", title = "✅") =>
        Swal.fire({
            icon: "success",
            title,
            text,
            timer: 2000,
            showConfirmButton: false,
        }),

    error: (text = "Đã xảy ra lỗi!", title = "❌") =>
        Swal.fire({
            icon: "error",
            title,
            text,
        }),

    warning: (text = "Cảnh báo!", title = "⚠️") =>
        Swal.fire({
            icon: "warning",
            title,
            text,
        }),

    confirm: (
        text = "Bạn chắc chắn muốn thực hiện thao tác này?",
        title = "Xác nhận",
        confirmText = "Xác nhận",
        cancelText = "Huỷ"
    ) =>
        Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            customClass: {
                confirmButton: "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700",
                cancelButton: "bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-300 mr-3",
            },
            buttonsStyling: false,
        }),
};

export default swalHelper;
