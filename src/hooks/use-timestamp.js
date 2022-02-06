import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import es from 'dayjs/locale/es'
dayjs.extend(relativeTime);

const useTimestamp = (timestamp) => {
    const isES = (navigator.language === 'es');
    if (isES) {
        dayjs.locale(es)
    }
    return dayjs(timestamp).fromNow();
}

export default useTimestamp;