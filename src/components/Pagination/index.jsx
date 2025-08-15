import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
    className = "",
    classNameBtn="",
    color="",
    prevText = "",
    nextText = ""
}) => {
    const maxVisiblePages = 3;
    const getVisiblePages = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if(endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        return { startPage, endPage };
    };
    const { startPage, endPage } = getVisiblePages();
    if(totalPages <= 1) return null;
    return (
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={classNameBtn ? classNameBtn : 'p-2 rounded-lg glass-effect border border-purple-500/30 text-white hover:bg-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 cursor-pointer'}
            >
                {prevText ? prevText : <ChevronLeft className="w-5 h-5" /> }
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={classNameBtn ? classNameBtn : 'w-10 h-10 rounded-lg text-sm font-medium glass-effect border border-purple-500/30 text-white hover:bg-purple-600/20 hover:scale-105 transition-all duration-200 cursor-pointer'}
                    >
                        1
                    </button>
                    {startPage > 2 && (
                        <span className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">
                            ...
                        </span>
                    )}
                </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                const pageNum = startPage + index;
                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`${classNameBtn ? classNameBtn : 'text-white w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer'} ${
                        pageNum === currentPage
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                            : 'border border-purple-500/30 hover:bg-purple-600/20 hover:scale-105'
                        }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">
                            ...
                        </span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 border border-purple-500/30 hover:bg-purple-600/20 hover:scale-105 ${color ? color : ''}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={classNameBtn ? classNameBtn : 'p-2 rounded-lg glass-effect border border-purple-500/30 text-white hover:bg-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 cursor-pointer'}
            >
                {nextText ? nextText : <ChevronRight className="w-5 h-5" /> }

            </button>
        </div>
    )
}

export default Pagination;