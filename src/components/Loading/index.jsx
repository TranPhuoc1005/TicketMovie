const LoadingUI = () => {

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-white backdrop-blur-sm transition-opacity duration-300" />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingUI;
