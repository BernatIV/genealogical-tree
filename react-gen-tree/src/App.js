import {useState} from 'react';
import NavBarApp from "./nav-bar/NavBarApp";
import Tree from "./tree/Tree";
import './App.css';
import 'reactflow/dist/style.css';
import loadingImg from './arbre.jpg';
import Guide from "./guide/Guide";
import Login from "./login/login";

function App() {
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('tree');

    const changeTabHandler = (tabId) => {
        setCurrentTab(tabId)
    }

    return (
        <div>
            <NavBarApp onChangeTab={changeTabHandler} />
            {loading && <img src={loadingImg} className="App-logo" alt="loading"/>}
            {currentTab === 'tree' && <Tree />}
            {currentTab === 'guide' && <Guide />}
            {currentTab === 'login' && <Login/>}
        </div>
    );
}

export default App;


/**
 * TODO 1: Customitzar els nodes perquè tinguin un punt al lateral, només si es vol, i puguin fer les relacions de parelles.
 *          Fer tipus de nodes. Les persones i els casaments
 *
 * FET 2: finestra modal: nom, lloc de naixement, data naixement, data defunció, ofici
 *
 * FET 3: Quan surti del mode edició tamb es bloquegi el candau que té el <Controls/>
 *
 * TODO 4: Comunicar-se amb el backend.
 *      I. Carregar els nodes i edges de la base de dades en carregar-se el component.
 *      II. Guardar un node a la base de dades quan premi el botó guardar.
 */
