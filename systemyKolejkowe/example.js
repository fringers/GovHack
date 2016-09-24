function getQueue(id) {
    $.get('https://api.um.warszawa.pl/api/action/wsstore_get/?id='+id.toString())
    .done(data => { 
        _handleSR(data);
    });
}

function _handleSR(data) {
    console.log(data)
    var html = `<label>`+data.result.date+`: `+data.result.time+`</label>
    <table><tbody>
        <td>aktualnyNumer</td>
        <td>czasObslugi</td>
        <td>idGrupy</td>
        <td>liczbaCzynnychStan</td>
        <td>liczbaKlwKolejce</td>
        <td>lp</td>
        <td>nazwaGrupy</td>
        <td>status</td>
    </tbody>`;
    _.forEach(data.result.grupy, (group) => {
        html += '<tr>';
        html += '<td>'+ group.aktualnyNumer + '</td>';
        html += '<td>'+ group.czasObslugi + '</td>';
        html += '<td>'+ group.idGrupy + '</td>';
        html += '<td>'+ group.liczbaCzynnychStan + '</td>';
        html += '<td>'+ group.liczbaKlwKolejce + '</td>';
        html += '<td>'+ group.lp + '</td>';
        html += '<td>'+ group.nazwaGrupy + '</td>';
        html += '<td>'+ group.status + '</td>';
        html += '</tr>';
    });
    html += "</table>";
    var content = $('#content');
    content.empty();
    content.append(html);
}