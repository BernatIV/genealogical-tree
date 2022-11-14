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
    const [darkMode, setDarkMode] = useState(true);
    const [backgroundColorClass, setBackgroundColorClass] = useState('app-background-light');
    const [backgroundColor, setBackgroundColor] = useState('white');

    const changeTabHandler = (tabId) => {
        setCurrentTab(tabId)
    }

    const changeLoadingStateHandler = (isLoading) => {
        setLoading(isLoading);
    }

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        console.log(checked);

        if (checked) {
            setBackgroundColorClass('app-background-light');
            setBackgroundColor('white');
        } else {
            setBackgroundColorClass('app-background-dark');
            setBackgroundColor('#212529');
            // setBackgroundColor('#282c34');
        }
    };

    return (
        <div className={backgroundColorClass}>
            <NavBarApp onChangeTab={changeTabHandler}
                       onToggleDarkMode={toggleDarkMode}
                       darkMode={darkMode}/>
            {loading && <img src={loadingImg} className="App-logo" alt="loading"/>}
            {currentTab === 'tree' && <Tree onChangeLoadingState={changeLoadingStateHandler}
                                            backgroundColor={backgroundColor}/>}
            {currentTab === 'guide' && <Guide darkMode={darkMode}/>}
            {currentTab === 'login' && <Login/>}
        </div>
    );
}

export default App;


/**
 * FET 1: Customitzar els nodes perquè tinguin un punt al lateral, només si es vol, i puguin fer les relacions de parelles.
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
 * FET 4: Comunicar-se amb el backend.
 *      I. Carregar els nodes i edges de la base de dades en carregar-se el component.
 *      II. Guardar un node a la base de dades quan premi el botó guardar.
 *
 * TODO 5: Context Menu
 *      I. FET. Afegir context menu
 *      II. borrar el que està seleccionat o obtenir l'id del que estàs clicant
 *
 * TODO 6: Colors de la pàgina. No tant blanc perq mata molt
 *
 * FET 7: Els Handles han de ser més grans per poder clicar-los més ràpidament
 *
 * TODO 8: En mode no edició que els Handles siguin invisibles
 *
 * TODO 9: Deploy backend to AWS server
 */


/** --- DOCS---
 *
 * - DEPLOY FRONT TO GH-PAGES
 *   https://github.com/gitname/react-gh-pages
 *
 *
 */
