import search_icon from "../../assets/search_icon.svg"
import { useEffect, useRef, useState } from "react";
import Titlecards from '../../components/Titlecards/Titlecards.jsx'
import { persistentGlobalData } from "../../components/Titlecards/Titlecards.jsx";


const Search = () => {
    const [search, setSearch] = useState("");
    return(
        <>
            <div className="search-bar">
                <img src={search_icon} alt=""/>
                <input onChange={(e)=>setSearch(e.target.value)}  type="text" placeholder="Movies, shows and more"/>
                <p>X</p>
            </div>
            <div className="result">
                {search.length === 0 ? 
                    <>
                        <Titlecards title={"Blockbusters Movies"} category={"popular"} />
                        <Titlecards title={"Only on Netflix"} category={"top_rated"} />
                        <Titlecards title={"Upcoming"} category={"upcoming"} />
                        <Titlecards title={"Top Pics For You"} category={"now_playing"} />
                    </>
                    : (
                        persistentGlobalData
                            .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
                            .map(item => (
                                <p key={item.id}>{item.title}</p>
                        ))
                    )
                }
            </div>
        </>
    );
}

export default Search;