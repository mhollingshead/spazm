import { useEffect, useState } from 'react'
import Header from '../Header/Header';
import Following from '../Following';
import './Streams.scss'

export default function Streams() {
    const [streams, setStreams] = useState([]);
    const [chats, setChats] = useState([]);
    const [active, setActive] = useState(null);

    const resize = () => {
        document.querySelectorAll('.stream').forEach(stream => {
            if (streams.length === 1) {
                stream.style.width = "100%";
                stream.style.height = "100%";
            } else if (streams.length === 2) {
                stream.style.width = "100%";
                stream.style.height = "50%";
            } else if (streams.length <= 4) {
                stream.style.width = "50%";
                stream.style.height = "50%";
            } else if (streams.length <= 6) {
                stream.style.width = "33.33%";
                stream.style.height = "50%";
            } else if (streams.length <= 9) {
                stream.style.width = "33.33%";
                stream.style.height = "33.33%";
            } else {
                stream.style.width = "25%";
                stream.style.height = "33.33%";
            }
        })
    }

    const addStream = channel => {
        const stream = <iframe src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`} frameBorder="0" className="stream__frame" id={channel} key={channel}></iframe>;
        setStreams([...streams, stream]);
        setChats([...chats, channel]);
        setActive(channel);
    }

    const removeStream = ind => {
        const _streams = streams.filter((stream, _ind) => _ind !== ind);
        const _chats = chats.filter((chat, _ind) => _ind !== ind);
        setStreams(_streams);
        setChats(_chats);
    }

    useEffect(resize, [streams])
    useEffect(() => {
        if (!chats.find(chat => chat === active)) setActive(chats[0] || null);
    }, [chats])

    return (
        <>
            <Header addStream={addStream} />
            <Following addStream={addStream} />
            <main className="streams">
                <section className="viewers">
                    {streams.length === 0 && <div className="icon streams__icon">videocam_off</div>}
                    {streams.length > 0 && streams.map((stream, ind) => (
                        <div className="stream">
                            {stream}
                            <div className="stream__remove" onClick={() => removeStream(ind)}>Remove</div>
                        </div>
                    ))}
                </section>
                {streams.length > 0 && <section className="chats">
                    <ul className="chats__list">
                        {chats.map(user => (
                            <li className={`chats__item ${user === active ? "active" : ""}`} key={user} onClick={() => setActive(user)}>{user}</li>
                        ))}
                    </ul>
                    {active && <iframe src={`https://www.twitch.tv/embed/${active}/chat?parent=localhost`} frameBorder="0" className="chat dark"></iframe>}
                </section>}
            </main>
        </>
    )
}