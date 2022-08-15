import {useCallback} from "react";
import axios from "axios";

export const useHttp = () => {
    // const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, config) => {

        // setProcess('loading');

        try {
            const response = await axios({
                url,
                ...config
            });
            if (response.status > 400) {
                throw new Error(`Could not fetch ${url}, status: ${response.statusText}`);
            }

            const data = await response.data;
            return data;
        } catch (e) {
            // setProcess('error');
            throw e;
        }
    }, []);

    // const clearError = useCallback(() => {
    // setProcess('loading');
    // }, []);

    return {
        request,
        // clearError,
        // process,
        // setProcess
    }
}