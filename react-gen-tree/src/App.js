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
 *          - PersonNode
 *              - que pugui ser 'selectable'
 *          - Quan es crea una relació, l'event que dispara crei una relació més amb un node de "casament" al mig
 *            perquè no ho hagi de fer l'usuari
 *          - CoupleRelationNode
 *              - que tingui dos handlers minúsculs per ajuntar les parelles i un molt gran per relacionar els fills.
 *                  Es pot crear un handler al mig de un edge?
 *
 * FET 2: finestra modal: nom, lloc de naixement, data naixement, data defunció, ofici
 *
 * FET 3: Quan surti del mode edició tamb es bloquegi el candau que té el <Controls/>
 *
 * TODO 4: Comunicar-se amb el backend.
 *      I. Carregar els nodes i edges de la base de dades en carregar-se el component.
 *      II. Guardar un node a la base de dades quan premi el botó guardar.
 *
 * TODO 5: Context Menu
 *      I. FET. Afegir context menu
 *      II. borrar el que està seleccionat o obtenir l'id del que estàs clicant
 *
 * TODO 6: Colors de la pàgina. No tant blanc perq mata molt
 *
 * TODO 7: Els Handles han de ser més grans per poder clicar-los més ràpidament
 */


/**
 *  PSEUDO-CODE for connecting two parents
 *
 * 1. onConnect -> fire event
 *
 * 2. if the two node connected are parents -> create a handle in the middle of the edge.
 *      if not, then it means it is targeting children therefore we don't need it.
 *
 * 3.
 *
 *
 */