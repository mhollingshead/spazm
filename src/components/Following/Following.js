import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserProvider from "../../contexts/UserProvider";
import './Following.scss';

export default function Following({ addStream }) {
    const userData = useContext(UserProvider.context);
    const [following, setFollowing] = useState([]);
    const [list, setList] = useState(true);

    const getFollowing = () => {
        if (userData.accessToken) {
            const headers = { headers: { 'Authorization': `Bearer ${userData.accessToken}`, 'Client-Id': process.env.REACT_APP_CLIENT_ID } }
            axios.get(`https://api.twitch.tv/helix/streams/followed?user_id=${userData.id}&first=20`, headers)
            .then(res => {
                const params = res.data.data.map(user => user.user_login).join("&login=");
                return axios.get(`https://api.twitch.tv/helix/users?login=${params}`, headers)
            })
            .then(res => setFollowing(res.data.data))
            .catch(e => console.log(e));
        }
    }

    const toggleList = () => list ? setList(false) : setList(true);

    useEffect(() => getFollowing(), [userData]);

    return (
        <section className="following">
            <div className="following__head">
                <h4 className="following__title">Following</h4>
                <div className="following__live">LIVE</div>
                {list && <div className="icon following__icon" onClick={getFollowing}>autorenew</div>}
                {list && <div className="icon following__icon following__icon--float" onClick={toggleList}>remove</div>}
                {!list && <div className="icon following__icon following__icon--float" onClick={toggleList}>add</div>}
            </div>
            {following.length > 0 && list && <div className="following__list">
                {following.sort((a, b) => b.view_count - a.view_count).map(channel => (
                    <div key={channel.id} aria-label={channel.display_name} data-microtip-position="right" role="tooltip">
                        <img className="following__img" src={channel.profile_image_url} alt={channel.display_name} onClick={() => addStream(channel.display_name)} />
                        <div className="icon following__add">add</div>
                    </div>
                ))}
            </div>}
            {following.length === 0 && list && <div className="following__list">
                <a href="/auth/twitch" className="following__alert">Login to view live followed streams</a>
            </div>}
        </section>
    );
}