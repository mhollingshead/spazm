import axios from 'axios';
import { useContext, useState } from 'react';
import UserProvider from '../../contexts/UserProvider';
import logo from '../../logo.svg';
import './Header.scss';

export default function Header({ addStream, toggleChatVisibility, toggleFollowingVisibility }) {
    const userData = useContext(UserProvider.context);
    const [dropdown, setDropdown] = useState(false);
    const [settings, setSettings] = useState(false);
    const [chatVisible, setChatVisible] = useState(true);
    const [followingVisible, setFollowingVisible] = useState(true);
    const [results, setResults] = useState([]);
    const [qResults, setQResults] = useState([]);
    const [query, setQuery] = useState("");

    const handleLogout = () => axios.get('/auth/logout').then(() => window.location.pathname = '/');

    const handleQuery = e => {
        setQuery(e.target.value);
        setDropdown(true);
        setSettings(false);
        if (!userData.accessToken) return;
        if (e.target.value === "") {
            setResults([]);
            setDropdown(false)
        } else {
            const headers = { headers: { 'Authorization': `Bearer ${userData.accessToken}`, 'Client-Id': process.env.REACT_APP_CLIENT_ID } }
            axios.get(`https://api.twitch.tv/helix/search/channels?query=${encodeURIComponent(e.target.value)}&first=5`, headers)
            .then(res => {
                setQResults(res.data.data);
                const params = res.data.data.map(user => user.broadcaster_login).join("&login=");
                return axios.get(`https://api.twitch.tv/helix/users?login=${params}`, headers)
            })
            .then(res => setResults(res.data.data))
            .catch(e => console.log(e.message));
        }
    }

    const resetSearch = () => {
        setQuery("");
        setResults([]);
        setDropdown(false);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (query) addStream(query);
        resetSearch();
    }

    const handleChatToggle = () => {
        chatVisible ? setChatVisible(false) : setChatVisible(true);
        toggleChatVisibility();
    }

    const handleFollowingToggle = () => {
        followingVisible ? setFollowingVisible(false) : setFollowingVisible(true);
        toggleFollowingVisibility();
    }

    return (
        <header className="header">
            <div className="header__logo">
                <img src={logo} className="header__logo--img" />
            </div>
            <div className="header__search">
                <form className="header__form" onSubmit={handleSubmit}>
                    <input className="header__searchbar" placeholder="Search streams..." name="searchbar" id="searchbar" value={query} onChange={handleQuery} onFocus={handleQuery} onBlur={() => setTimeout(() => setDropdown(false), 200)} autoComplete="off" />
                </form>
                {query && dropdown && <div className="results">
                    {results.length > 0 && results.map(user => (<div className="result" key={user.display_name} onClick={() => {addStream(user.display_name); resetSearch()}}>
                        <img className="result__img" src={user.profile_image_url} alt={user.display_name} />
                        <div className="result__user">{user.display_name}</div>
                        {qResults.find(qUser => qUser.display_name === user.display_name) && qResults.find(qUser => qUser.display_name === user.display_name).is_live && <div className="result__live">LIVE</div>}
                        <button className="result__add">Add</button>
                    </div>))}
                    <p className="results__alert">Press <span className="results__key">Enter ↵</span> to add <b>{query}</b></p>
                </div>}
            </div>
            <div className="header__dashboard">
                <div className="header__settings">
                    <p className="header__icon" onClick={() => setSettings(true)}>settings</p>
                    {settings && <div className="dropdown">
                        <div className="dropdown__ghost" onClick={() => setSettings(false)}></div>
                        <div className="dropdown__body">
                            <div className="dropdown__head">
                                <h3 className="dropdown__title">Settings</h3>
                                <button className="dropdown__button" onClick={() => setSettings(false)}>close</button>
                            </div>
                            <div className="dropdown__group">
                                <p className="dropdown__label">Show Following Area</p>
                                {followingVisible && <p className="dropdown__toggle dropdown__toggle--on" onClick={handleFollowingToggle}>toggle_on</p>}
                                {!followingVisible && <p className="dropdown__toggle" onClick={handleFollowingToggle}>toggle_off</p>}
                            </div>
                            <div className="dropdown__group">
                                <p className="dropdown__label">Show Chat Area</p>
                                {chatVisible && <p className="dropdown__toggle dropdown__toggle--on" onClick={handleChatToggle}>toggle_on</p>}
                                {!chatVisible && <p className="dropdown__toggle" onClick={handleChatToggle}>toggle_off</p>}
                            </div>
                        </div>
                    </div>}
                </div>
                {userData.display_name && <div className="profile">
                    <div className="profile__panel">
                        <h3 className="profile__display-name">{userData.display_name}</h3>
                        <p className="profile__link" onClick={handleLogout}>Logout</p>
                    </div>
                    <div className="profile__panel">
                        <img className="profile__img" src={userData.profile_image_url} alt={userData.display_name} />
                    </div>
                </div>}
                {!userData.display_name && <a href="/auth/twitch" className="header__button">Login</a>}
            </div>
        </header>
    )
}