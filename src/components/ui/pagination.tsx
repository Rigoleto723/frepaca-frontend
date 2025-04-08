import * as React from 'react';
import { Button } from './button';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                    variant="pageControls"
                    size={null}
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Primera</span>
                    <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                    variant="pageControls"
                    size={null}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                {pageNumbers.map((number) => (
                    <Button
                        key={number}
                        onClick={() => onPageChange(number)}
                        variant={`${currentPage === number ? 'pageNumberActive' : 'pageNumberDisabled'}`}
                        size={null}
                    >
                        {number}
                    </Button>
                ))}
                <Button
                    variant="pageControls"
                    size={null}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                    variant="pageControls"
                    size={null}
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Última</span>
                    <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                </Button>
            </nav>
        </div>
    );
};

export { Pagination }