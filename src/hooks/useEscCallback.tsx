import { useEffect } from "react";

const useEscHandler = (callback: () => void) => {
    useEffect(() => {
        const keyDownHandler = (event : KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();

                callback();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        // 👇️ Clean up event listener
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };

    }, []);
}

export default useEscHandler;