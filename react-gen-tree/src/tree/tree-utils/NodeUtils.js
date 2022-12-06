import moment from "moment/moment";

export const fillDateField = (newNode) => {
    let dateContent;
    const birthDate = new Date(newNode.birthDate);
    const deathDate = new Date(newNode.deathDate);

    if ((newNode.birthDate !== '' && newNode.birthDate !== null) &&
        (newNode.deathDate === '' || newNode.deathDate === null)) {

        dateContent = <div style={{fontSize: 8}}>Data de naixement: {birthDate.toLocaleDateString("es-ES")}</div>;
    }

    if ((newNode.birthDate === '' || newNode.birthDate === null) &&
        (newNode.deathDate !== '' && newNode.deathDate !== null)) {
        dateContent = <div style={{fontSize: 8}}>Data de mort: {deathDate.toLocaleDateString("es-ES")}</div>;
    }

    if (newNode.birthDate !== '' && newNode.birthDate !== null &&
        newNode.deathDate !== '' && newNode.deathDate !== null) {
        dateContent =
            <div style={{fontSize: 8}}>
                ({birthDate.toLocaleDateString("es-ES")}) - ({deathDate.toLocaleDateString("es-ES")})
            </div>;
    }

    if (newNode.manualInputDate && newNode.manualInputDate.trim() !== '') {
        dateContent = <div style={{fontSize: 8}}>({newNode.manualInputDate.trim()})</div>;
    }
    return dateContent;
}

export const parseStringDDMMYYYToDate = (dateString) => {
    const dateMomentObject = moment(dateString, "DD/MM/YYYY");
    return dateMomentObject.toDate();
}
