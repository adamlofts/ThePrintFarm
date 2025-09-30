import React, {useEffect, useState} from 'react'

type FileDropWrapperProps = {
    targetElement: HTMLElement | null;
    onFilesDropped: (files: FileList) => void;
    children: (hover: boolean) => React.ReactNode; // children as a function to receive hover state
};

export const FileDropWrapper: React.FC<FileDropWrapperProps> = ({
                                                                    targetElement,
                                                                    onFilesDropped,
                                                                    children,
                                                                }) => {
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (!targetElement) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = "copy";
            setHover(true);
        };

        const handleDragLeave = () => {
            setHover(false);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setHover(false);
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                onFilesDropped(e.dataTransfer.files);
                e.dataTransfer.clearData();
            }
        };

        targetElement.addEventListener("dragover", handleDragOver);
        targetElement.addEventListener("dragleave", handleDragLeave);
        targetElement.addEventListener("drop", handleDrop);

        return () => {
            targetElement.removeEventListener("dragover", handleDragOver);
            targetElement.removeEventListener("dragleave", handleDragLeave);
            targetElement.removeEventListener("drop", handleDrop);
        };
    }, [targetElement, onFilesDropped]);

    return <>{children(hover)}</>;
};
