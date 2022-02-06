import { Fragment, useEffect, useState } from "react";
import CommonHeader from "../components/partials/CommonHeader";
import Notification from "../components/partials/Notification";
import classes from './InteractionsPage.module.css';
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import es from 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime';
import { doc, onSnapshot, getFirestore, updateDoc} from "firebase/firestore";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
const isES = (navigator.language === 'es');

if (isES) {
    dayjs.locale(es)
}


const InteractionsPage = props => {
    const [notifications, setNotifications] = useState([]);
    const [notificationsToday, setNotificationsToday] = useState([]);
    const [notificationsWeek, setNotificationsWeek] = useState([]);
    const [notificationsMonth, setNotificationsMonth] = useState([]);
    const [notificationsOld, setNotificationsOld] = useState([]);
    
    const db = getFirestore(app);

    const milliDay = 86400000;
    const now = new Date().getTime();
    const aMonth = +now - (milliDay * 30);
    
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "notifications", localStorage.getItem('uid')), (doc) => {
            const loadedNotifications = [];
            for (const key in  doc.data()) {
                loadedNotifications.push(doc.data()[key])
            }
            const followNotifications = [...loadedNotifications].filter((noti) => noti.type === 'follow');
            const uniqueNotifications = [...new Map(followNotifications.map(v => [v.from.userId, v])).values()]
            const finalNotifications = [...uniqueNotifications, ...loadedNotifications.filter(noti => noti.type !== 'follow')]

            setNotifications(finalNotifications);
            const todayNots = finalNotifications.filter((notification) => (dayjs(+notification.from.date).isToday()))
            setNotificationsToday(todayNots);
            const weekNots = finalNotifications.filter((notification) => ( (dayjs(now).diff(+notification.from.date, 'day') < 7) && (dayjs(now).diff(+notification.from.date, 'hour') > 24)));
            setNotificationsWeek(weekNots);
            const monthNots = finalNotifications.filter((notification) => ( (dayjs(now).diff(+notification.from.date, 'day') < 30) && (dayjs(now).diff(+notification.from.date, 'day') > 7)));
            setNotificationsMonth(monthNots);
            const oldNots = finalNotifications.filter((notification) => notification.from.date < aMonth)
            setNotificationsOld(oldNots);
        });
       
    }, []);

    useEffect(() => {
        if (!!notifications) {
            setTimeout(() => {
                notifications.forEach(notification => {
                   if (!notification.seen) {
                       const notiRef = doc(db, "notifications", localStorage.getItem('uid'));
                       const notId = notification.notificationId
                       const pre = {           
                            ...notification, seen:true
                       };
                       const post = {};
                       post[notId] = pre
                      
                       updateDoc(notiRef, post)

                        notification.seen = true;
                    }
                })
            }, 2000)
        }
       

        return () => {};
    }, [notifications])

    const notsTodaySorted = notificationsToday.sort((a, b) => (a.from.date < b.from.date) ? 1 : -1);

    
    const textHeading = (isES) ? 'Actividad' : 'Activity';
    const textToday = (isES) ? 'Hoy' : 'Today';
    const textThisWeek = (isES) ? 'Esta semana' : 'This week';
    const textThisMonth = (isES) ? 'Este mes' : 'This month';
    const textOlder = (isES) ? 'Notificaciones antiguas' : 'Older notifications';
    const textNoNotis = (isES) ? 'Todavía no tienes notificaciones' : 'You don\'t have any notifications yet.'


    return(
        <Fragment>
            <CommonHeader heading={textHeading} />
            {notifications.length > 0 
              ? <section className={classes.NotificationWrapper}>
                    {notsTodaySorted.length > 0 && 
                        <section className={classes.WrapperByDate}>
                            <p className={classes.Separator}>{textToday}</p>
                            {notsTodaySorted.map((notification => <Notification time={dayjs(+notification.from.date).fromNow()} key={notification.from.date} notification={notification}/>))}
                        </section>
                    }
                    {notificationsWeek.length > 0 && 
                        <section className={classes.WrapperByDate}>
                            <p className={classes.Separator}>{textThisWeek}</p>
                            {notificationsWeek.map((notification => <Notification time={dayjs(+notification.from.date).fromNow()} key={notification.from.date} notification={notification}/>))}
                        </section>
                    }
                    {notificationsMonth.length > 0 && 
                        <section className={classes.WrapperByDate}>
                            <p className={classes.Separator}>{textThisMonth}</p>
                            {notificationsMonth.map((notification => <Notification time={dayjs(+notification.from.date).fromNow()} key={notification.from.date} notification={notification}/>))}
                        </section>
                    }
                    {notificationsOld.length > 0 && 
                        <section className={classes.WrapperByDate}>
                            <p className={classes.Separator}>{textOlder}</p>
                            {notificationsOld.map((notification => <Notification time={dayjs(+notification.from.date).fromNow()} key={notification.from.date} notification={notification}/>))}
                        </section>
                    }
                </section>
              : <section  className={classes.NoNots}>{textNoNotis}</section>
            }  
        </Fragment>
    )
}

export default InteractionsPage;