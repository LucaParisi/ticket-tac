import {ReactNode, useEffect, useRef, useState} from 'react';

type Props = Readonly<{
    placeholder?: string;
    className?: string;
    onSelectionChanged: (val: string) => void;
    icon?: ReactNode;
    options: string[];
    selectedValue?: string | null;
}>
export function Dropdown({ placeholder, className, icon, options, onSelectionChanged, selectedValue} : Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(query.toLowerCase())
    );

    const optionsRef = useRef<(HTMLButtonElement)[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && optionsRef.current[highlightedIndex]) {
            optionsRef.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
            });
        }
    }, [highlightedIndex, isOpen]);

    const handleQueryChange = (val: string) => {
        setQuery(val);
        setHighlightedIndex(0);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev + 1 < filteredOptions.length ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedOption = filteredOptions[highlightedIndex];
            if (selectedOption) {
                setIsOpen(false);
                setQuery('');
                setHighlightedIndex(0);
                onSelectionChanged(selectedOption);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                onClick={() => {
                    setIsOpen(prev => !prev);
                    setTimeout(() => document.getElementById('dropdown-input')?.focus(), 0);
                }}
                className={`base-dropdown ${className}`}
            >
               <span className="absolute top-4 inset-y-0 left-3 flex items-center pointer-events-none">
                    {icon}
                </span>
                {selectedValue || placeholder}
            </button>

            {isOpen && (
                <div
                    className="absolute z-10 w-full mt-1 rounded-lg shadow-2xl bg-white"
                >
                    <input
                        id="dropdown-input"
                        type="text"
                        value={query}
                        onChange={(event) => handleQueryChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Filtra..."
                        className="w-full px-3 py-2 border-b border-gray-200 outline-none border-none"
                    />
                    <ul className="max-h-26 overflow-y-auto scrollbar-hidden">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, idx) => (
                                <div
                                    key={option}
                                    /*@ts-expect-error optionsRef.current results in error */
                                    ref={el => (optionsRef.current[idx] = el)}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                        setHighlightedIndex(0);
                                        onSelectionChanged(option);
                                    }}
                                    className={`w-full py-2 text-center cursor-pointer hover:text-orange-800 outline-none border-none ${
                                        idx === highlightedIndex && 'text-orange-600'
                                    }`}
                                >
                                    <span className="bg-transparent">
                                        {option}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 list-none text-md">Nessun risultato...</li>
                        )}
                    </ul>

                    <button  className="w-full px-4 cursor-pointer bg-slate-200 hover:opacity-75 text-orange-600 text-md rounded-b-lg border-none outline-none border-t-gray-200 border-t" onClick={() => {
                        setQuery('');
                        onSelectionChanged('');
                    }}>
                        <p className="text-center">Reset</p>
                    </button>
                </div>
            )}

        </div>
    );
};
