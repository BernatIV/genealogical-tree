import {Col, Container, Row} from "react-bootstrap";
import './Guide.css';

const Guide = (props) => {


    return (
        <Container className={!props.darkMode ? 'guide-dark' : ''}>
            <Row>
                <Col md>
                    <h1 className="margin-top">&#127807; Arbre genealògic</h1>
                    <p>Aquest arbre ha estat creat per intentar fer una mica més fàcil visualitzar la complexitat dels
                    dels arbres genealògics. Espero haver-ho aconseguit.</p>
                    <h2>Editar l'arbre</h2>
                    <p>Es pot editar tot l'arbre quan cliques "Editar". Quan tanques el mode edició, només es pot navegar
                        per l'arbre fent zoom i arrossegant l'arbre sencer.</p>
                    <div className="margin-left">
                        <h3>Afegir un node</h3>
                        <p>Botó "Editar" i "Afegir persona". Un cop guardat el node apareix al mig i només cal arrossegar-lo
                            fins on es vulgui, relacionar-lo amb les persones que vulguis i guardar canvis. </p>
                        <h3>Eliminar un node</h3>
                        <p>Selecciona un node (fent un clic) i tecla "esborrar".</p>
                        <h3>Crear un enllaç entre dos nodes</h3>
                        <p>Clica un punt negre d'un node i arrastra fins a un altre.</p>
                        <h3>Esborra un enllaç</h3>
                        <p>Selecciona un enllaç (fent un clic) i tecla "esborrar".</p>
                    </div>
                    <br/>
                    <br/>
                    <p>Si veus errors, o tens propostes per fer aquest projecte millor, escriu-me a <b>marc.mane.duatis@gmail.com</b>.</p>

                    {/*<p><strong>Afegir un node</strong><br/>Botó editar -> Afegir node.</p>*/}
                    {/*<p><strong>Eliminar un node</strong><br/>Selecciona un node (fent un clic) i tecla "esborrar".</p>*/}
                    {/*<p><strong>Crear un enllaç entre dos nodes</strong><br/>Clica un punt negre d'un node i arrastra fins a un altre.</p>*/}
                    {/*<p><strong>Esborra un enllaç</strong><br/>Selecciona un enllaç (fent un clic) i tecla "esborrar".</p>*/}
                </Col>
            </Row>
        </Container>
    );
}
export default Guide;
