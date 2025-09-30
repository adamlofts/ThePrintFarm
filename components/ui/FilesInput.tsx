import React, {useState} from 'react'
import styles from './FilesInput.module.css';

export function FilesInput({setFiles}) {

    const handleFileChange = (evt) => {
        setFiles(evt.target.files);
    }

    return <div className={styles.row}>
        <label className={styles.labelCol}>Files</label>
        <div className={styles.inputCol}>
            <input
                type="file"
                // ref={inputRef}
                onChange={handleFileChange}
                multiple
            />
        </div>
    </div>;
}
